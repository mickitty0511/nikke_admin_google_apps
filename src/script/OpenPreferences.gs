/**
 * PropertyServiceから設定を取得する関数
 */
function getSettings() {
  var userProperties = PropertiesService.getUserProperties();
  return {
    "オプションシートの更新設定": {
      "自動一括更新": userProperties.getProperty('batch_update_option_dropdowns') === 'true',
      "1行ごとに手動更新": userProperties.getProperty('update_option_dropdown') === 'true'
    }
  };
}

/**
 * 設定を更新する関数
 */
function updateSetting(section, key, value) {
  var userProperties = PropertiesService.getUserProperties();
  var propertyKey = key === "自動一括更新" ? 'batch_update_option_dropdowns' : 'update_option_dropdown';
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
      'initialized': 'true'
    });
  }
}

/**
 * index.htmlを表示する関数
 */
function openPreferences() {
  initializeSettings(); // 初期設定を確認
  var html = HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setWidth(450)
      .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(html, 'NIKKE管理シート設定');
}
