function onEdit(e) {
  // 編集されたシートを取得
  const sheet = e.range.getSheet();
  
  // ユーザープロパティから設定を取得
  const userProperties = PropertiesService.getUserProperties();
  const updateOptionDropdownValue = userProperties.getProperty('update_option_dropdown') === 'true';

  if (sheet.getName() === "オプション") {
    // "オプション" シートの編集の場合
    // update_option_dropdown が TRUE の場合のみ 
    if (updateOptionDropdownValue) {
      // ドロップダウン更新処理を実行
      checkAndApplyDropdown(sheet, e.range);
    }
  } else {
    // 他のシートの場合は何もしない
  }
}
