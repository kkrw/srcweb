import type { AbilityData } from "./AbilityData";
import { type Integer } from "./BrandedTypes";
import type { FeatureData } from "./FeatureData";
import { Adaptation } from "./interpreter/Adaptation";
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
  Name: string;

  /**
   * 数値型のID
   * UnitDataList で管理される際の連番
   */
  ID: Integer;

  /**
   * ユニットの分類（系譜やタイプ）
   */
  UnitClass: string;

  /**
   * パイロット数
   * 負の値の場合は括弧付きの指定（固定パイロット等）を意味する特殊な仕様があります
   */
  PilotCapacity: Integer;

  /**
   * 装備可能な強化パーツのスロット数
   */
  NumItemSlots: Integer;

  /**
   * 地形適応 (Air, Ground, Water, Space)
   * 形式: "AAAA" -> 空・陸・水・宇
   */
  Adaptation: Adaptation;

  /**
   * 耐久力の最大値（基本値）
   */
  HP: Integer;

  /**
   * エネルギーの最大値（基本値）
   */
  EN: Integer;

  /**
   * 移動タイプ
   * 例: "空陸", "陸", "空"
   */
  MovementType: string;

  /**
   * 移動力の基本値
   */
  Speed: Integer;

  /**
   * サイズ区分
   * S, M, L, LL など
   */
  Size: string;

  /**
   * 装甲値の基本値
   */
  Armor: Integer;

  /**
   * 運動性の基本値
   */
  Mobility: Integer;

  /**
   * 修理費
   * 撃墜された際の修理費、および獲得資金の基礎値
   */
  Cost: Integer;

  /**
   * 経験値
   * 撃墜時に得られる経験値の基礎値
   */
  ExpValue: Integer;

  /**
   * 愛称
   * 画面表示用の短い名称
   */
  Nickname: string;

  /**
   * 読み仮名
   * ソートやフィルタリングに使用
   */
  KanaName: string;

  /**
   * ビットマップ名
   * ユニットアイコンのファイル名
   */
  Bitmap: string;

  /**
   * ビットマップが存在するか
   * 画像ロード失敗時のフラグ
   * true の場合、getBitmap() はプレースホルダー "-.bmp" を返します
   */
  IsBitmapMissing: boolean;

  /**
   * 特殊能力
   * 変形、合体、バリアなどの特殊能力を保持します
   */
  Features: FeatureData[];

  /**
   * 武器データ
   * このユニットが持つ固定武器のリストです
   */
  Weapons: WeaponData[];

  /**
   * アビリティデータ
   * 修理装置などの能動的な能力（コマンド）を保持します
   */
  Abilities: AbilityData[];
}

/**
 * UnitData のファクトリ関数
 */
export function createUnitData(params: Partial<UnitData> = {}): UnitData {
  return {
    Name: params.Name || "",
    ID: params.ID || (0 as Integer),
    UnitClass: params.UnitClass || "",
    PilotCapacity: params.PilotCapacity || (1 as Integer),
    NumItemSlots: params.NumItemSlots || (0 as Integer),
    Adaptation: params.Adaptation || Adaptation.fromString("AAAA"),
    HP: params.HP || (0 as Integer),
    EN: params.EN || (0 as Integer),
    MovementType: params.MovementType || "",
    Speed: params.Speed || (0 as Integer),
    Size: params.Size || "M",
    Armor: params.Armor || (0 as Integer),
    Mobility: params.Mobility || (0 as Integer),
    Cost: params.Cost || (0 as Integer),
    ExpValue: params.ExpValue || (0 as Integer),
    Nickname: params.Nickname || "",
    KanaName: params.KanaName || "",
    Bitmap: params.Bitmap || "",
    IsBitmapMissing: params.IsBitmapMissing || false,
    Features: params.Features || [],
    Weapons: params.Weapons || [],
    Abilities: params.Abilities || [],
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
    Adaptation:
      typeof rawData.Adaptation === "string"
        ? Adaptation.fromString(rawData.Adaptation)
        : rawData.Adaptation,
  });
}

/**
 * ビットマップ名を取得します
 * IsBitmapMissing が true の場合、プレースホルダー "-.bmp" を返します
 */
export function getBitmap(unit: UnitData): string {
  return unit.IsBitmapMissing ? "-.bmp" : unit.Bitmap;
}
