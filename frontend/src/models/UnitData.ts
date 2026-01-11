import { DEFAULTS } from "../parsers/constants";
import type { AbilityData } from "./AbilityData";
import { Adaptation } from "./Adaptation";
import { type Integer } from "./BrandedTypes";
import type { Feature } from "./features/types";
import type { WeaponData } from "./WeaponData";

/**
 * ユニット（Unit）のデータモデル
 *
 * ユニット（ロボットや戦艦など）の基本定義情報（スペック）を管理します。
 * これはマスターデータであり、実際のゲーム中で動くユニットは別のクラスで管理されます。
 */
export interface UnitData {
  /**
   * ユニットを識別するユニークな名前（主キー候補）
   */
  name: string;

  /**
   * 数値型のID
   * UnitDataList で管理される際の連番
   */
  id: Integer;

  /**
   * ユニットの分類（系譜やタイプ）
   */
  unitClass: string;

  /**
   * パイロット数
   * 負の値の場合は括弧付きの指定（固定パイロット等）を意味する特殊な仕様があります
   */
  pilotCapacity: Integer;

  /**
   * 装備可能な強化パーツのスロット数
   */
  numItemSlots: Integer;

  /**
   * 地形適応 (Air, Ground, Water, Space)
   * 形式: "AAAA" -> 空・陸・水・宇
   */
  adaptation: Adaptation;

  /**
   * 耐久力の最大値（基本値）
   */
  hp: Integer;

  /**
   * エネルギーの最大値（基本値）
   */
  en: Integer;

  /**
   * 移動タイプ
   * 例: "空陸", "陸", "空"
   */
  movementType: string;

  /**
   * 移動力の基本値
   */
  speed: Integer;

  /**
   * サイズ区分
   * S, M, L, LL など
   */
  size: string;

  /**
   * 装甲値の基本値
   */
  armor: Integer;

  /**
   * 運動性の基本値
   */
  mobility: Integer;

  /**
   * 修理費
   * 撃墜された際の修理費、および獲得資金の基礎値
   */
  cost: Integer;

  /**
   * 経験値
   * 撃墜時に得られる経験値の基礎値
   */
  expValue: Integer;

  /**
   * 愛称
   * 画面表示用の短い名称
   */
  nickname: string;

  /**
   * 読み仮名
   * ソートやフィルタリングに使用
   */
  kanaName: string;

  /**
   * ビットマップ名
   * ユニットアイコンのファイル名
   */
  bitmap: string;

  /**
   * ビットマップが存在するか
   * 画像ロード失敗時のフラグ
   * true の場合、getBitmap() はプレースホルダー "-.bmp" を返します
   */
  isBitmapMissing: boolean;

  /**
   * 特殊能力
   * 変形、合体、バリアなどの特殊能力を保持します
   */
  features: Feature[];

  /**
   * 武器データ
   * このユニットが持つ固定武器のリストです
   */
  weapons: WeaponData[];

  /**
   * アビリティデータ
   * 修理装置などの能動的な能力（コマンド）を保持します
   */
  abilities: AbilityData[];
}

/**
 * UnitData のファクトリ関数
 */
export function createUnitData(params: Partial<UnitData> = {}): UnitData {
  return {
    name: params.name || "",
    id: params.id || (0 as Integer),
    unitClass: params.unitClass || "",
    pilotCapacity: params.pilotCapacity || (1 as Integer),
    numItemSlots: params.numItemSlots || (0 as Integer),
    adaptation: params.adaptation || Adaptation.fromString(DEFAULTS.ADAPTATION),
    hp: params.hp || (0 as Integer),
    en: params.en || (0 as Integer),
    movementType: params.movementType || "",
    speed: params.speed || (0 as Integer),
    size: params.size || "M",
    armor: params.armor || (0 as Integer),
    mobility: params.mobility || (0 as Integer),
    cost: params.cost || (0 as Integer),
    expValue: params.expValue || (0 as Integer),
    nickname: params.nickname || "",
    kanaName: params.kanaName || "",
    bitmap: params.bitmap || "",
    isBitmapMissing: params.isBitmapMissing || false,
    features: params.features || [],
    weapons: params.weapons || [],
    abilities: params.abilities || [],
  };
}

/**
 * 文字列データから UnitData を生成するためのヘルパー関数
 */
export function parseUnitData(
  rawData: Partial<UnitData> & { Adaptation?: string | Adaptation }
): UnitData {
  return createUnitData({
    ...rawData,
    adaptation:
      typeof rawData.adaptation === "string"
        ? Adaptation.fromString(rawData.adaptation)
        : rawData.adaptation,
  });
}

/**
 * ビットマップ名を取得します
 * IsBitmapMissing が true の場合、プレースホルダー "-.bmp" を返します
 */
export function getBitmap(unit: UnitData): string {
  return unit.isBitmapMissing ? "-.bmp" : unit.bitmap;
}
