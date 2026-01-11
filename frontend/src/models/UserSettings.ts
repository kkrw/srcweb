/**
 * ユーザー設定のデータモデル
 *
 * ゲームの表示や動作に関するユーザー個別の設定を管理します。
 */
export interface UserSettings {
  /**
   * グリッド表示
   * マップのグリッド線を表示するかどうか
   */
  showGridLines: boolean;

  /**
   * 戦闘アニメーション
   * 戦闘アニメのON/OFF設定
   */
  enableBattleAnimation: boolean;
}

/**
 * UserSettings のファクトリ関数
 */
export function createUserSettings(params: Partial<UserSettings> = {}): UserSettings {
  return {
    showGridLines: params.showGridLines ?? true,
    enableBattleAnimation: params.enableBattleAnimation ?? true,
  };
}
