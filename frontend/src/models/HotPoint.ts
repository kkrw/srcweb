/**
 * ホットポイント（クリック可能領域）のデータモデル
 *
 * マップ上のクリック可能な領域を定義します。
 */
export interface HotPoint {
  /**
   * ホットポイントの識別名
   */
  name: string;

  /**
   * X座標（左端）
   */
  left: number;

  /**
   * Y座標（上端）
   */
  top: number;

  /**
   * 幅
   */
  width: number;

  /**
   * 高さ
   */
  height: number;

  /**
   * ツールチップ等に表示する名称
   */
  caption: string;
}

/**
 * HotPoint のファクトリ関数
 */
export function createHotPoint(params: Partial<HotPoint> = {}): HotPoint {
  return {
    name: params.name || "",
    left: params.left || 0,
    top: params.top || 0,
    width: params.width || 0,
    height: params.height || 0,
    caption: params.caption || "",
  };
}
