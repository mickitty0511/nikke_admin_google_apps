function checkAndStartBatchApplyDropdown() {
  const userProperties = PropertiesService.getUserProperties();
  const batchUpdateEnabled = userProperties.getProperty('batch_update_option_dropdowns') === 'true';

  if (!batchUpdateEnabled) {
    // 許諾ダイアログを表示（HTML版）
    const html = HtmlService.createHtmlOutputFromFile('checkandStartBatchApplyDropdown')
    .setWidth(600)
    .setHeight(400);
    
    SpreadsheetApp.getUi().showModalDialog(html, 'オプション一括更新の有効化');
  } else {
    // すでに有効化されている場合は直接サイドバーを表示
    showBatchUpdateSidebar();
  }
}

function enableBatchUpdate() {
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('batch_update_option_dropdowns', 'true');
  showBatchUpdateSidebar();
}

function showBatchUpdateSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('batchUpdateView')
    .setTitle('オプションシート一括更新')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

function startBatchApplyDropdown() {
  const userProperties = PropertiesService.getUserProperties();
  const optionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("オプション");
  
  // D列（4列目）の値が空でない行数をカウント
  const lastRow = optionSheet.getLastRow();
  let totalRows = 0;
  for (let row = 2; row <= lastRow; row++) {
    if (optionSheet.getRange(row, 4).getValue() !== "") {
      totalRows++;
    }
  }
  
  console.log(`Total rows with data in column D: ${totalRows}`);
  
  userProperties.setProperty('batchStartRow', '2');
  userProperties.setProperty('totalRows', totalRows.toString());
  userProperties.setProperty('completedRows', '0');
  userProperties.setProperty('batchProcessing', 'true');
  
  // バックグラウンドで処理を開始
  ScriptApp.newTrigger('executeBatchProcessWithCache')
    .timeBased()
    .after(1)
    .create();
  
  return {total: totalRows, completed: 0};
}

function executeBatchProcess() {
  try {
    const optionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("オプション");
    const userProperties = PropertiesService.getUserProperties();
    let startRow = parseInt(userProperties.getProperty('batchStartRow')) || 2;
    const totalRows = parseInt(userProperties.getProperty('totalRows'));
    let completedRows = parseInt(userProperties.getProperty('completedRows')) || 0;
    
    const batchSize = 15; // 一度に処理する行数
    let processedInBatch = 0;
    
    while (processedInBatch < batchSize && startRow <= optionSheet.getLastRow()) {
      const range = optionSheet.getRange(startRow, 4);
      if (range.getValue() !== "") { // D列に値がある場合のみプルダウンを更新
        checkAndApplyDropdown(optionSheet, range);
        completedRows++;
        processedInBatch++;
      }
      startRow++;
    }
    
    // 進捗状況を更新
    userProperties.setProperty('batchStartRow', startRow.toString());
    userProperties.setProperty('completedRows', completedRows.toString());
    
    console.log(`Batch processed. StartRow: ${startRow}, CompletedRows: ${completedRows}, TotalRows: ${totalRows}`);

    // 処理が完了したかチェック
    if (completedRows >= totalRows) {
      userProperties.setProperty('batchProcessing', 'false');
      userProperties.deleteProperty('batchStartRow');
      userProperties.deleteProperty('totalRows');
      userProperties.deleteProperty('completedRows');
      console.log('Batch process completed');
      deleteTriggers(); // すべての無効になったトリガーを削除
    } else {
      console.log('Attempting to create next trigger...');
      deleteTriggers(); // 既存の無効になったトリガーを削除
      // 次のバッチを実行（トリガーを使用）
      const trigger = ScriptApp.newTrigger('executeBatchProcess')
        .timeBased()
        .after(1000) // 1秒後に実行
        .create();
      console.log(`Next trigger created: ${trigger.getUniqueId()}`);
    }
  } catch (error) {
    console.error('Error in executeBatchProcess:', error);
    console.error('Error stack:', error.stack);
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('batchProcessing', 'false');
    deleteTriggers(); // エラー時にも無効になったトリガーを削除
  }
}

function showSuccessMessage() {
  Browser.msgBox('一括更新が完了しました。');
}

function getBatchProgress() {
  const userProperties = PropertiesService.getUserProperties();
  const totalRows = parseInt(userProperties.getProperty('totalRows')) || 0;
  const completedRows = parseInt(userProperties.getProperty('completedRows')) || 0;
  const isProcessing = userProperties.getProperty('batchProcessing') === 'true';
  
  return {
    total: totalRows,
    completed: completedRows,
    isProcessing: isProcessing
  };
}

function deleteTriggers(targetFunction) {
  const triggers = ScriptApp.getProjectTriggers();
  const executeBatchProcessTriggers = triggers.filter(trigger => 
    trigger.getHandlerFunction() === targetFunction
  );
  
  console.log(`Total triggers before deletion: ${triggers.length}`);
  console.log(`executeBatchProcess triggers before deletion: ${executeBatchProcessTriggers.length}`);
  
  executeBatchProcessTriggers.forEach(trigger => {
    if (trigger.getTriggerSource() === ScriptApp.TriggerSource.CLOCK) {
      const now = new Date();
      const triggerTime = trigger.getTriggerSourceId();
      if (now > new Date(triggerTime)) {
        // トリガーが既に実行されている（無効になっている）場合は削除
        ScriptApp.deleteTrigger(trigger);
        console.log(`Deleted expired trigger: ${trigger.getUniqueId()}`);
      }
    }
  });
  
  const remainingTriggers = ScriptApp.getProjectTriggers();
  console.log(`Total triggers after deletion: ${remainingTriggers.length}`);
}

function getOptionListData() {
  const cache = CacheService.getScriptCache();
  let optionListData = cache.get('optionListData');

  if (!optionListData) {
    const optionlistSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("オプションリスト");
    const dataRange = optionlistSheet.getRange('B2:D'); // 必要に応じて範囲を調整
    optionListData = JSON.stringify(dataRange.getValues());
    
    // キャッシュに保存（最大6時間）
    cache.put('optionListData', optionListData, 21600);
  }

  return JSON.parse(optionListData);
}

function executeBatchProcessWithCache() {
  try {
    const optionListData = getOptionListData();
    const optionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("オプション");
    const userProperties = PropertiesService.getUserProperties();
    let startRow = parseInt(userProperties.getProperty('batchStartRow')) || 2;
    const totalRows = parseInt(userProperties.getProperty('totalRows'));
    let completedRows = parseInt(userProperties.getProperty('completedRows')) || 0;
    
    const batchSize = 15; // 一度に処理する行数
    const endRow = Math.min(startRow + batchSize - 1, optionSheet.getLastRow());
    
    batchCheckAndApplyDropdown(optionSheet, startRow, endRow, optionListData);
    completedRows += (endRow - startRow + 1);
    
    // 進捗状況を更新
    userProperties.setProperty('batchStartRow', (endRow + 1).toString());
    userProperties.setProperty('completedRows', completedRows.toString());
    
    console.log(`Batch processed. StartRow: ${startRow}, EndRow: ${endRow}, CompletedRows: ${completedRows}, TotalRows: ${totalRows}`);

    // 処理が完了したかチェック
    if (completedRows >= totalRows) {
      userProperties.setProperty('batchProcessing', 'false');
      userProperties.deleteProperty('batchStartRow');
      userProperties.deleteProperty('totalRows');
      userProperties.deleteProperty('completedRows');
      console.log('Batch process completed');
      deleteTriggers('executeBatchProcessWithCache'); // すべての無効になったトリガーを削除
    } else {
      console.log('Attempting to create next trigger...');
      deleteTriggers('executeBatchProcessWithCache'); // 既存の無効になったトリガーを削除
      // 次のバッチを実行（トリガーを使用）
      const trigger = ScriptApp.newTrigger('executeBatchProcessWithCache')
        .timeBased()
        .after(1000) // 1秒後に実行
        .create();
      console.log(`Next trigger created: ${trigger.getUniqueId()}`);
    }
  } catch (error) {
    console.error('Error in executeBatchProcessWithCache:', error);
    console.error('Error stack:', error.stack);
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('batchProcessing', 'false');
    deleteTriggers('executeBatchProcessWithCache'); // エラー時にも無効になったトリガーを削除
  }
}

function checkAndApplyDropdownWithCache(sheet, range, optionListData) {
  // 既存の関数をそのまま呼び出し、optionListDataを渡す
  checkAndApplyDropdown(sheet, range, optionListData);
}

function batchCheckAndApplyDropdown(sheet, startRow, endRow, optionListData) {
  const rangeToUpdate = sheet.getRange(startRow, 4, endRow - startRow + 1, 1);
  const values = rangeToUpdate.getValues();
  
  const optionlistSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("オプションリスト");
  const data = optionListData || optionlistSheet.getRange('B2:D').getValues();

  const updatedRanges = [];

  for (let i = 0; i < values.length; i++) {
    const value = values[i][0];
    if (value !== "") {
      const row = data.findIndex(r => r[0] === value);
      if (row !== -1) {
        const startDataRow = row + 1;
        const endDataRow = Math.min(startDataRow + 15, data.length);
        
        for (let col = 5; col <= 8; col++) {
          const validationRule = SpreadsheetApp.newDataValidation()
            .requireValueInRange(optionlistSheet.getRange(startDataRow + 1, 4, endDataRow - startDataRow + 1, 1))
            .build();
          updatedRanges.push({
            range: sheet.getRange(startRow + i, col),
            rule: validationRule
          });
        }
      }
    }
  }

  // バッチで一括適用
  updatedRanges.forEach(item => {
    item.range.setDataValidation(item.rule);
  });
}
