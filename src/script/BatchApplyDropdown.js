function checkAndStartBatchApplyDropdown() {
  const userProperties = PropertiesService.getUserProperties();
  const batchUpdateEnabled = userProperties.getProperty('batch_update_option_dropdowns') === 'true';

  if (!batchUpdateEnabled) {
    // 許諾ダイアログを表示
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'オプション一括更新の有効化',
      'オプション一括更新機能が無効になっています。有効化しますか？',
      ui.ButtonSet.YES_NO
    );

    if (response == ui.Button.YES) {
      // ユーザーが許可した場合、設定を有効化
      userProperties.setProperty('batch_update_option_dropdowns', 'true');
      startBatchApplyDropdown();
    } else {
      // ユーザーが拒否した場合、メッセージを表示
      Browser.msgBox('オプション一括更新は実行されませんでした。設定から有効化してください。');
    }
  } else {
    // すでに有効化されている場合は直接実行
    startBatchApplyDropdown();
  }
}

function startBatchApplyDropdown() {
  deleteBatchTriggers('batchApplyDropdown');

  // 開始行をリセット
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('batchStartRow', '2');
  
  // 総行数を取得して保存
  const optionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("オプション");
  const totalRows = optionSheet.getLastRow() - 1; // ヘッダー行を除く
  userProperties.setProperty('totalRows', totalRows.toString());
  
  // プログレスバーを表示
  showProgressBar(0, totalRows);
  
  // バッチ処理を開始
  batchApplyDropdown();
}

function batchApplyDropdown() {
  const optionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("オプション");
  const batchSize = 15; // 一度に処理する行数
  
  // 処理開始行と総行数を取得
  const userProperties = PropertiesService.getUserProperties();
  let startRow = parseInt(userProperties.getProperty('batchStartRow')) || 2;
  const totalRows = parseInt(userProperties.getProperty('totalRows'));
  
  // バッチサイズ分の行を処理
  const endRow = Math.min(startRow + batchSize - 1, optionSheet.getLastRow());
  for (let row = startRow; row <= endRow; row++) {
    const range = optionSheet.getRange(row, 4);
    if (range.getValue() !== "") { // D列に値がある場合のみプルダウンを更新
      checkAndApplyDropdown(optionSheet, range);
    }
  }
  
  // 進捗状況を更新
  const processedRows = endRow - 1; // ヘッダー行を除く
  updateProgressBar(processedRows, totalRows);
  
  // 次回の開始行を保存
  const nextStartRow = endRow + 1;
  if (nextStartRow <= optionSheet.getLastRow()) {
    userProperties.setProperty('batchStartRow', nextStartRow.toString());
    // 次のバッチ処理をトリガーで設定
    ScriptApp.newTrigger('batchApplyDropdown')
      .timeBased()
      .after(1000) // 1秒後に実行
      .create();
  } else {
    // 全ての処理が完了したらプロパティをリセット
    userProperties.deleteProperty('batchStartRow');
    userProperties.deleteProperty('totalRows');
    // プログレスバーを閉じる
    closeProgressBar();
    // 成功メッセージを表示
    showSuccessMessage();
    // トリガーを削除
    deleteBatchTriggers('batchApplyDropdown');
  }
}

function showProgressBar(current, total) {
  const html = HtmlService.createHtmlOutput(`
    <style>
      .progress-bar {
        width: 100%;
        background-color: #f0f0f0;
        padding: 3px;
        border-radius: 3px;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, .2);
      }
      .progress-bar-fill {
        display: block;
        height: 22px;
        background-color: #659cef;
        border-radius: 3px;
        transition: width 500ms ease-in-out;
      }
    </style>
    <div class="progress-bar">
      <span class="progress-bar-fill" style="width:0%;">
        <span id="progress-text">0%</span>
      </span>
    </div>
  `)
    .setWidth(300)
    .setHeight(80);
  SpreadsheetApp.getUi().showModelessDialog(html, 'オプション一括更新の進捗状況');
}

function updateProgressBar(current, total) {
  const html = HtmlService.createHtmlOutput(`
    <script>
      function updateProgress(current, total) {
        var percentage = Math.round((current / total) * 100);
        window.parent.document.querySelector('.progress-bar-fill').style.width = percentage + '%';
        window.parent.document.getElementById('progress-text').textContent = percentage + '%';
      }
      updateProgress(${current}, ${total});
    </script>
  `);
  SpreadsheetApp.getUi().showModelessDialog(html, 'Updating Progress');
}

function closeProgressBar() {
  const html = HtmlService.createHtmlOutput(`
    <script>
      google.script.host.close();
    </script>
  `)
    .setWidth(1)
    .setHeight(1);
  SpreadsheetApp.getUi().showModelessDialog(html, 'Closing Progress Bar');
}

function showSuccessMessage() {
  Browser.msgBox('一括更新が完了しました。');
}

// トリガーを削除する関数
function deleteBatchTriggers(functionName) {
  // 既存のトリガーがある場合に削除
  const triggers = ScriptApp.getProjectTriggers();
  const batchTriggers = triggers.filter(trigger => trigger.getHandlerFunction() === functionName);
  if (batchTriggers.length > 0) {
    batchTriggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  }
}
