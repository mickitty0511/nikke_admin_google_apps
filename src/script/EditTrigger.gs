function onEdit(e) {
  // 編集されたシートを取得
  const sheet = e.range.getSheet();
  // 自動処理設定シートを取得
  const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("自動処理設定");
  // 自動処理設定シートのB列の値を取得
  const settingsValues = settingsSheet.getRange("B2:B").getValues();

  // update_option_dropdown の行番号を取得
  let updateOptionDropdownRow = -1;
  // batch_update_option_dropdowns の行番号を取得
  let batchUpdateOptionDropdownsRow = -1;

  for (let i = 0; i < settingsValues.length; i++) {
    if (settingsValues[i][0] === "update_option_dropdown") {
      updateOptionDropdownRow = i + 2; // 行番号は 0 から始まるため、+2 する
    } else if (settingsValues[i][0] === "batch_update_option_dropdowns") {
      batchUpdateOptionDropdownsRow = i + 2;
    }
  }

  // update_option_dropdown の値を取得
  const updateOptionDropdownValue = settingsSheet.getRange("D" + updateOptionDropdownRow).getValue();
  // batch_update_option_dropdowns の値を取得
  const batchUpdateOptionDropdownsValue = settingsSheet.getRange("D" + batchUpdateOptionDropdownsRow).getValue();

  if (sheet.getName() === "自動処理設定") {
    // batch_update_option_dropdowns が TRUE の場合のみ batchApplyPulldown を実行
    if (batchUpdateOptionDropdownsValue === true) {
      batchApplyPulldown();
    }

  }else if (sheet.getName() === "オプション") {
    // "オプション" シートの編集の場合は、以前の処理を実行
    // update_option_dropdown が TRUE の場合のみ checkAndApplyPulldown を実行
    if (updateOptionDropdownValue === true) {
      // 編集されたセルが自動処理設定ではないことを確認
      checkAndApplyPulldown(sheet, e.range);
    }
  } else {
    // 他のシートの場合は何もしない
  }
}

function batchApplyPulldown() {
  const optionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("オプション");
  const lastRow = optionSheet.getLastRow();

  // D列の2行目から値のある最後の行までをループ
  for (let row = 2; row <= lastRow; row++) {
    const range = optionSheet.getRange(row, 4);
    if (range.getValue() !== "") { // D列に値がある場合のみプルダウンを更新
      checkAndApplyPulldown(optionSheet, range);
    }
  }
}

function checkAndApplyPulldown(sheet, range) {
  // 編集されたセルが D列で、D1 以外の行であることを確認
  if (range.getColumn() === 4 && range.getRow() > 1) {
    optionlist_sheetname = "オプションリスト"
    data_range = 'B2:D'
    option_name_col_num = 0 //data_rangeの1列目(0)
    option_col_num = 4 //B列を1としてD列に至るまでの列数
    level_num = 15
    applyPulldown(sheet, range, optionlist_sheetname, data_range, option_name_col_num, option_col_num, level_num);
  }
}

function applyPulldown(
  sheet,
  range,
  optionlist_sheetname,
  data_range,
  option_name_col_num,
  option_col_num,
  level_num
) {
  // 編集されたセルの値を取得
  const value = range.getValue();
  // 別シートのデータを取得
  const dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(optionlist_sheetname);
  const dataRange = dataSheet.getRange(data_range); // 別シートの B列とD列の2行目以降の範囲
  const data = dataRange.getValues();

  // 編集されたセルの値に対応するデータの行番号を取得
  let row = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i][option_name_col_num] === value) {
      row = i; // 行番号は 0 から始まるため、+1 は不要
      break;
    }
  }

  // 編集されたセルの行番号を取得
  const editedRow = range.getRow();

  // E列からH列までの各列にプルダウンを設定
  for (let col = 5; col <= 8; col++) {
    // 行番号を調整して16行分のデータを選択
    const startRow = row + 1; // 特定の行を含む
    const endRow = Math.min(startRow + level_num, data.length); // 最多16行、データ範囲を超えないように調整

    const validationRule = SpreadsheetApp.newDataValidation().requireValueInRange(dataSheet.getRange(startRow + 1, option_col_num, endRow - startRow + 1, 1)).build();
    sheet.getRange(editedRow, col).setDataValidation(validationRule);
  }
}