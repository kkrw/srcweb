import type { FeatureData } from "./FeatureData";
import type { WeaponData } from "./WeaponData";
import type { AbilityData } from "./AbilityData";
import type { SpecialPower } from "./SpecialPower";
import type { SkillData } from "./SkillData";

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
  Name: string;

  /**
   * 性別
   * 例: "男性", "女性"
   */
  Sex: string;

  /**
   * パイロットの分類や属性
   * 例: "ニュータイプ", "強化人間"
   * ユニットへの搭乗制限などに使用されます
   */
  PilotClass: string;

  /**
   * 地形適応（4文字の文字列）
   * 形式: "AAAA" (左から空・陸・水・宇)
   * ランク: S, A, B, C, - など
   */
  Adaptation: string;

  /**
   * 経験値
   * 撃墜時に敵が得られる経験値の基礎値
   */
  ExpValue: number;

  /**
   * 格闘攻撃力
   * 格闘攻撃の威力や命中率に影響するパラメータ
   */
  MeleeAtk: number;

  /**
   * 射撃攻撃力
   * 射撃攻撃の威力や命中率に影響するパラメータ
   */
  RangedAtk: number;

  /**
   * 命中
   * 攻撃の命中率に影響するパラメータ
   */
  Accuracy: number;

  /**
   * 回避
   * 攻撃の回避率に影響するパラメータ
   */
  Evasion: number;

  /**
   * 敏捷性（反応）
   * 回避率や行動順序に影響するパラメータ
   */
  Agility: number;

  /**
   * 技量
   * クリティカル率や特殊技能の発動率に影響するパラメータ
   */
  Technique: number;

  /**
   * 性格
   * 気力の増減パターンを決定するタイプ
   * 例: "強気", "弱気"
   */
  Personality: string;

  /**
   * 精神ポイント（MPに相当）の最大値（初期値）
   */
  SP: number;

  /**
   * 戦闘時に再生される専用BGMのファイル名
   */
  BGM: string;

  /**
   * 愛称
   * 画面表示用の名称
   */
  Nickname: string;

  /**
   * 読み仮名
   * ソートやフィルタリングに使用
   */
  KanaName: string;

  /**
   * ビットマップ名
   * 顔グラフィックのファイル名
   */
  Bitmap: string;

  /**
   * ビットマップが存在するか
   * 画像ロード失敗時のフラグ
   * true の場合、getBitmap() はプレースホルダー "-.bmp" を返します
   */
  IsBitmapMissing: boolean;

  /**
   * 習得するスペシャルパワーのリスト
   * 例: "熱血", "必中"など
   */
  SpecialPowers: SpecialPower[];

  /**
   * パイロット固有の技能
   * 例: "切り払い", "底力"
   */
  Skills: SkillData[];

  /**
   * このパイロットが搭乗することでユニットに追加される特殊能力
   */
  Features: FeatureData[];

  /**
   * パイロット自身が持つ攻撃手段
   * 人間ユニット等の場合に使用
   */
  Weapons: WeaponData[];

  /**
   * パイロット自身が持つ特殊行動
   */
  Abilities: AbilityData[];
}

/**
 * PilotData のファクトリ関数
 */
export function createPilotData(params: Partial<PilotData> = {}): PilotData {
  return {
    Name: params.Name || "",
    Sex: params.Sex || "",
    PilotClass: params.PilotClass || "",
    Adaptation: params.Adaptation || "AAAA",
    ExpValue: params.ExpValue || 0,
    MeleeAtk: params.MeleeAtk || 0,
    RangedAtk: params.RangedAtk || 0,
    Accuracy: params.Accuracy || 0,
    Evasion: params.Evasion || 0,
    Agility: params.Agility || 0,
    Technique: params.Technique || 0,
    Personality: params.Personality || "",
    SP: params.SP || 0,
    BGM: params.BGM || "",
    Nickname: params.Nickname || "",
    KanaName: params.KanaName || "",
    Bitmap: params.Bitmap || "",
    IsBitmapMissing: params.IsBitmapMissing || false,
    SpecialPowers: params.SpecialPowers || [],
    Skills: params.Skills || [],
    Features: params.Features || [],
    Weapons: params.Weapons || [],
    Abilities: params.Abilities || [],
  };
}

/**
 * ビットマップ名を取得します
 * IsBitmapMissing が true の場合、プレースホルダー "-.bmp" を返します
 */
export function getBitmap(pilot: PilotData): string {
  return pilot.IsBitmapMissing ? "-.bmp" : pilot.Bitmap;
}
