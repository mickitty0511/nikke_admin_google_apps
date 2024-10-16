function checkAndApplyDropdown(sheet, range) {
  // 編集されたセルが D列で、D1 以外の行であることを確認
  if (range.getColumn() === 4 && range.getRow() > 1) {
    optionlist_sheetname = "オプションリスト"
    data_range = 'B2:D'
    //data_rangeの1列目(0)
    option_name_col_num = 0 
    //オプションリストの選択肢の取得列
    option_col_num = 4 
    //B列を1としてD列に至るまでの列数
    level_num = 15

    applyDropdown(
      sheet
      , range
      , optionlist_sheetname
      , data_range
      , option_name_col_num
      , option_col_num
      , level_num
    );
  }
}

function applyDropdown(
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