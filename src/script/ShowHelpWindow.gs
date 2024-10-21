/**
 * ヘルプウィンドウを表示する関数
 * @param {boolean} includeToggle - トグルボタンを表示するかどうか
 */
function showHelpWindow(includeToggle = true) {
  var template = HtmlService.createTemplateFromFile('helpWindow');
  
  // タブのデータをテンプレートに渡す
  template.tabs = [
    {id: 'basic', label: '基本設定'},
    {id: 'nikke_info', label: '基本情報シート'},
    {id: 'option', label: 'オプションシート'},
    {id: 'collection', label: 'コレクションシート'},
    {id: 'skill', label: 'スキルシート'},
    {id: 'treasure', label: '宝ものシート'}
  ];
  
  // トグルボタンの表示有無をテンプレートに渡す
  template.showToggle = includeToggle;
  
  var html = template.evaluate()
      .setWidth(800)
      .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, '操作説明');
}

/**
 * メニューからヘルプウィンドウを表示する関数（トグルボタンを非表示）
 */
function showHelpWindowFromMenu() {
  showHelpWindow(false);
}

/**
 * ヘルプウィンドウを必要に応じて表示する関数
 */
function showHelpWindowIfNeeded() {
  var userProperties = PropertiesService.getUserProperties();
  var hideHelp = userProperties.getProperty('hideHelpWindow');
  
  if (hideHelp !== 'true') {
    showHelpWindow(true);
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
