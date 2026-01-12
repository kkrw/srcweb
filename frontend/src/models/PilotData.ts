import { DEFAULTS } from "../parsers/constants";
import type { AbilityData } from "./AbilityData";
import { Adaptation } from "./Adaptation";
import { type Integer } from "./BrandedTypes";
import type { FeatureAcquisitionData } from "./FeatureData";
import type { SpecialPower } from "./SpecialPower";
import type { WeaponData } from "./WeaponData";
import type { Feature } from "./features/types";

/**
 * パイロット（Pilot）のデータモデル
 *
 * パイロット（キャラクター）の基本能力値（ステータス）や、
 * 習得するスペシャルパワー、特殊技能などを定義するマスターデータです。
 */
export interface PilotData {
  /**
   * パイロットを識別するユニークな名前（主キー候補）
   */
  name: string;

  /**
   * 性別
   * 例: "男性", "女性"
   */
  sex: string;

  /**
   * パイロットの分類や属性
   * 例: ["ニュータイプ"], ["強化人間"], ["ＭＳ(∀)", "ＭＳ", "ＭＳ(ＧＧ)"]
   * ユニットへの搭乗制限などに使用されます
   * 複数のユニットタイプを指定可能（空白区切り）
   */
  availableUnitClasses: string[];

  /**
   * 地形適応
   * 形式: "AAAA" (左から空・陸・水・宇)
   * ランク: S, A, B, C, - など
   */
  adaptation: Adaptation;

  /**
   * 経験値
   * 撃墜時に敵が得られる経験値の基礎値
   */
  expValue: Integer;

  /**
   * 格闘攻撃力
   * 格闘攻撃の威力や命中率に影響するパラメータ
   */
  meleeAtk: Integer;

  /**
   * 射撃攻撃力
   * 射撃攻撃の威力や命中率に影響するパラメータ
   */
  rangedAtk: Integer;

  /**
   * 命中
   * 攻撃の命中率に影響するパラメータ
   */
  accuracy: Integer;

  /**
   * 回避
   * 攻撃の回避率に影響するパラメータ
   */
  evasion: Integer;

  /**
   * 敏捷性（反応）
   * 回避率や行動順序に影響するパラメータ
   */
  agility: Integer;

  /**
   * 技量
   * クリティカル率や特殊技能の発動率に影響するパラメータ
   */
  technique: Integer;

  /**
   * 性格
   * 気力の増減パターンを決定するタイプ
   * 例: "強気", "弱気"
   */
  personality: string;

  /**
   * 精神ポイント（MPに相当）の最大値（初期値）
   */
  sp: Integer;

  /**
   * 戦闘時に再生される専用BGMのファイル名
   */
  bgmFiles: string[];

  /**
   * 愛称
   * 画面表示用の名称
   */
  nickname: string;

  /**
   * 読み仮名
   * ソートやフィルタリングに使用
   */
  kanaName: string;

  /**
   * ビットマップ名
   * 顔グラフィックのファイル名
   */
  faceGraphicFile: string;

  /**
   * ビットマップが存在するか
   * 画像ロード失敗時のフラグ
   * true の場合、getBitmap() はプレースホルダー "-.bmp" を返します
   */
  isBitmapMissing: boolean;

  /**
   * 習得するスペシャルパワーのリスト
   * 例: "熱血", "必中"など
   */
  specialPowers: SpecialPower[];

  /**
   * パイロット固有の技能
   * 例: "切り払い", "底力"
   */
  features: FeatureAcquisitionData[];

  /**
   * このパイロットが搭乗することでユニットに追加される特殊能力
   */
  unitFeatures: Feature[];

  /**
   * パイロット自身が持つ攻撃手段
   * 人間ユニット等の場合に使用
   */
  weapons: WeaponData[];

  /**
   * パイロット自身が持つ特殊行動
   */
  abilities: AbilityData[];
}

/**
 * PilotData のファクトリ関数
 */
export function createPilotData(params: Partial<PilotData> = {}): PilotData {
  return {
    name: params.name || "",
    sex: params.sex || "",
    availableUnitClasses: params.availableUnitClasses || [],
    adaptation: params.adaptation || Adaptation.fromString(DEFAULTS.ADAPTATION),
    expValue: params.expValue || (0 as Integer),
    meleeAtk: params.meleeAtk || (0 as Integer),
    rangedAtk: params.rangedAtk || (0 as Integer),
    accuracy: params.accuracy || (0 as Integer),
    evasion: params.evasion || (0 as Integer),
    agility: params.agility || (0 as Integer),
    technique: params.technique || (0 as Integer),
    personality: params.personality || "",
    sp: params.sp || (0 as Integer),
    bgmFiles: params.bgmFiles || [],
    nickname: params.nickname || "",
    kanaName: params.kanaName || "",
    faceGraphicFile: params.faceGraphicFile || "",
    isBitmapMissing: params.isBitmapMissing || false,
    specialPowers: params.specialPowers || [],
    features: params.features || [],
    unitFeatures: params.unitFeatures || [],
    weapons: params.weapons || [],
    abilities: params.abilities || [],
  };
}

/**
 * ビットマップ名を取得します
 * IsBitmapMissing が true の場合、プレースホルダー "-.bmp" を返します
 */
export function getBitmap(pilot: PilotData): string {
  return pilot.isBitmapMissing ? "-.bmp" : pilot.faceGraphicFile;
}
