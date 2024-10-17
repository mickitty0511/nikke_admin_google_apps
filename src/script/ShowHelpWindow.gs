/**
 * ヘルプウィンドウを表示する関数
 */
function showHelpWindow() {
  var html = HtmlService.createHtmlOutputFromFile('helpWindow')
      .setWidth(600)
      .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(html, '操作説明');
}

/**
 * ヘルプウィンドウを必要に応じて表示する関数
 */
function showHelpWindowIfNeeded() {
  var userProperties = PropertiesService.getUserProperties();
  var hideHelp = userProperties.getProperty('hideHelpWindow');
  
  if (hideHelp !== 'true') {
    showHelpWindow();
  }
}


/**
 * ヘルプウィンドウの表示設定を更新する関数
 * @param {boolean} hide - ヘルプウィンドウを非表示にするかどうかのフラグ
 */
function setHideHelpWindow(hide) {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('hideHelpWindow', hide.toString());
}

/**
 * ヘルプウィンドウの表示設定を取得する関数
 * @returns {string} ヘルプウィンドウを非表示にするかどうかのフラグ
 */
function getHideHelpWindow() {
  var userProperties = PropertiesService.getUserProperties();
  return userProperties.getProperty('hideHelpWindow') || 'false';
}
