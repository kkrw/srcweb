import { TERRAIN_UNKNOWN } from "./map/constants";
import type { Terrain } from "./map/types";

/**
 * マップのセル（タイル）のデータモデル
 *
 * マップの各グリッド（セル）の地形情報を管理します。
 */
export interface MapCell {
  /**
   * X座標
   */
  x: number;

  /**
   * Y座標
   */
  y: number;

  /**
   * 地形ID
   */
  terrain: Terrain;

  /**
   * 地形画像のバリエーション番号
   */
  bitmapNo: number;

  /**
   * 上層レイヤーの地形ID
   * null または 0 の場合は上層なし
   */
  layerTerrainID: number | null;

  /**
   * 上層レイヤー画像番号
   * null または 0 の場合は上層なし
   */
  layerBitmapNo: number | null;

  /**
   * マスの属性
   * 上層/下層/画像のみ等の区分
   */
  boxType: number;
}

/**
 * マップ（Map）のデータモデル
 *
 * 現在プレイ中のマップ（グリッド、地形、配置）の状態を保持します。
 */
export interface MapData {
  /**
   * マップファイル名
   * 現在読み込まれているマップ定義ファイル（.map）のパス
   */
  mapFileName: string;

  /**
   * マップ横幅
   * マップのグリッド数（X軸）
   */
  width: number;

  /**
   * マップ縦幅
   * マップのグリッド数（Y軸）
   */
  height: number;

  /**
   * マップセルの配列
   * 全てのマップセル（タイル）の情報を保持します
   */
  cells: MapCell[];

  /**
   * 描画モード
   * 例: "夜", "夕焼け", "セピア" 等の画面効果状態
   */
  drawMode: string;

  /**
   * フィルタ色
   * 画面全体にかけるフィルタの色コード
   */
  filterColor: number;

  /**
   * フィルタ透過度
   * フィルタの強さ（0-100%）
   */
  filterTransparency: number;
}

/**
 * MapCell のファクトリ関数
 */
export function createMapCell(params: Partial<MapCell> = {}): MapCell {
  return {
    x: params.x || 0,
    y: params.y || 0,
    terrain: params.terrain || TERRAIN_UNKNOWN,
    bitmapNo: params.bitmapNo || 0,
    layerTerrainID: params.layerTerrainID ?? null,
    layerBitmapNo: params.layerBitmapNo ?? null,
    boxType: params.boxType || 0,
  };
}

/**
 * MapData のファクトリ関数
 */
export function createMapData(params: Partial<MapData> = {}): MapData {
  return {
    mapFileName: params.mapFileName || "",
    width: params.width || 0,
    height: params.height || 0,
    cells: params.cells || [],
    drawMode: params.drawMode || "",
    filterColor: params.filterColor || 0,
    filterTransparency: params.filterTransparency || 0,
  };
}

/**
 * 指定座標のマップセルを取得します
 *
 * TODO: パフォーマンス最適化
 * 現在の実装は配列の全走査を行うため、大きなマップでは非効率です。
 * 以下の方法を検討してください:
 * 1. 二次元配列 (MapCell[][]) による O(1) アクセス
 * 2. Map<string, MapCell> (キー: `${x},${y}`) によるハッシュマップ
 * 3. Cells を Width × Height の固定長配列にして index = y * Width + x でアクセス
 */
export function getCell(
  map: MapData,
  x: number,
  y: number
): MapCell | undefined {
  return map.cells.find((cell) => cell.x === x && cell.y === y);
}

/**
 * 指定座標のマップセルを設定します
 *
 * TODO: パフォーマンス最適化
 * 現在の実装は配列の全走査を行うため、大きなマップでは非効率です。
 * getCell() と同様に、二次元配列や Map による実装を検討してください。
 */
export function setCell(map: MapData, cell: MapCell): void {
  const index = map.cells.findIndex((c) => c.x === cell.x && c.y === cell.y);
  if (index !== -1) {
    map.cells[index] = cell;
  } else {
    map.cells.push(cell);
  }
}
