function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // カスタムメニューを設定
  spreadsheet.addMenu("★NIKKE管理設定", [
    {
      name: "★【操作説明】はじめに",
      functionName: "showHelpWindow"
    },
    {
      name: "設定を開く",
      functionName: "openPreferences"
    },
    {
      name: "オプション一括更新",
      functionName: "checkAndStartBatchApplyDropdown"
    }
  ]);
  
  // ヘルプウィンドウを自動表示
  showHelpWindowIfNeeded();
}