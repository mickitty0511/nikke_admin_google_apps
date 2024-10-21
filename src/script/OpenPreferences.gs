/**
 * PropertyServiceから設定を取得する関数
 */
function getSettings() {
  var userProperties = PropertiesService.getUserProperties();
  return {
    "オプションシートの更新設定": {
      "自動一括更新": userProperties.getProperty('batch_update_option_dropdowns') === 'true',
      "1行ごとに手動更新": userProperties.getProperty('update_option_dropdown') === 'true'
    },
    "ヘルプウィンドウの設定": {
      "起動時に非表示": userProperties.getProperty('hideHelpWindow') === 'true'
    },
    "設定画面の表示": {
      "サイドバーで表示": userProperties.getProperty('showSettingsInSidebar') === 'true'
    }
  };
}

/**
 * 設定を更新する関数
 */
function updateSetting(section, key, value) {
  var userProperties = PropertiesService.getUserProperties();
  var propertyKey;
  
  if (section === "オプションシートの更新設定") {
    propertyKey = key === "自動一括更新" ? 'batch_update_option_dropdowns' : 'update_option_dropdown';
  } else if (section === "ヘルプウィンドウの設定") {
    propertyKey = 'hideHelpWindow';
  } else if (section === "設定画面の表示") {
    propertyKey = 'showSettingsInSidebar';
  }
  
  userProperties.setProperty(propertyKey, value.toString());
  return getSettings();
}

/**
 * 初期設定を行う関数
 */
function initializeSettings() {
  var userProperties = PropertiesService.getUserProperties();
  if (userProperties.getProperty('initialized') !== 'true') {
    userProperties.setProperties({
      'batch_update_option_dropdowns': 'false',
      'update_option_dropdown': 'false',
      'hideHelpWindow': 'false',
      'showSettingsInSidebar': 'false',
      'initialized': 'true'
    });
  }
}

/**
 * 設定画面を表示する関数
 */
function openPreferences() {
  initializeSettings(); // 初期設定を確認
  var userProperties = PropertiesService.getUserProperties();
  var showInSidebar = userProperties.getProperty('showSettingsInSidebar') === 'true';
  
  var html = HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('NIKKE管理シート設定');
  
  if (showInSidebar) {
    SpreadsheetApp.getUi().showSidebar(html);
  } else {
    SpreadsheetApp.getUi().showModalDialog(html.setWidth(450).setHeight(400), 'NIKKE管理シート設定');
  }
}

/**
 * サイドバー表示設定を更新し、適切な表示方法に切り替える関数
 */
function updateSidebarSetting(showInSidebar) {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('showSettingsInSidebar', showInSidebar.toString());
  
  if (showInSidebar) {
    // サイドバーを表示
    return {
      message: "設定画面をサイドバーで表示します。",
      action: "switchToSidebar"
    };
  } else {
    // ダイアログを表示
    return {
      message: "設定画面をダイアログで表示します。",
      action: "switchToDialog"
    };
  }
}

/**
 * サイドバーを閉じてダイアログを表示する関数
 */
function closeSidebarAndOpenDialog() {
  var html = HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setWidth(450)
      .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(html, 'NIKKE管理シート設定');
}

/**
 * サイドバーを表示し、ダイアログを閉じる関数
 */
function switchToSidebar() {
  var html = HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('NIKKE管理シート設定');
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * ダイアログを表示する関数
 */
function switchToDialog() {
  var html = HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setWidth(450)
      .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(html, 'NIKKE管理シート設定');
}
