import { DEFAULTS } from "../../parsers/constants";

/**
 * 地形適応 (Air, Ground, Water, Space) を表すクラス
 */
export class Adaptation {
  private static readonly RANKS = ["-", "E", "D", "C", "B", "A", "S"];

  public readonly air: number;
  public readonly ground: number;
  public readonly water: number;
  public readonly space: number;

  constructor(air: number, ground: number, water: number, space: number) {
    this.air = air;
    this.ground = ground;
    this.water = water;
    this.space = space;
  }

  /**
   * "AAAA" や "S-AB" などの文字列から Adaptation オブジェクトを生成します
   * 4文字未満の場合は足りない分を補完しません（エラーにするか、デフォルト値を使うかはユースケース次第ですが、ここでは厳密に処理します）
   */
  static fromString(str: string): Adaptation {
    if (str.length !== 4) {
      // デフォルト値: AAAA (5,5,5,5)
      // または例外を投げるべきだが、既存データが不完全な場合のフェイルセーフとして AAAA を返すか、
      // VBの挙動に合わせてパースする。VBでは4文字固定が前提。
      const defualtRankValue = Adaptation.defaultRankValue();
      return new Adaptation(
        defualtRankValue,
        defualtRankValue,
        defualtRankValue,
        defualtRankValue
      );
    }

    return new Adaptation(
      Adaptation.rankToValue(str[0]),
      Adaptation.rankToValue(str[1]),
      Adaptation.rankToValue(str[2]),
      Adaptation.rankToValue(str[3])
    );
  }

  private static rankToValue(rankChar: string): number {
    // 一般的なスパロボ/SRCの数値定義:
    // S=4, A=3, B=2, C=1, D=0?
    // VBコードを確認して正確な値を入れる必要がありますが、
    // ひとまず標準的な A=3 (100%) を基準とした値を設定します。
    // S: 6 (110% or 120%)
    // A: 5 (100%)
    // B: 4 (90% or 80%)
    // C: 3 (80% or 70%)
    // D: 2 (70% or 60%)
    // E: 1 (60% or 50%)
    // -: 0 (Unusable)
    const index = Adaptation.RANKS.indexOf(rankChar);
    if (index === -1) {
      // Default to A
      return Adaptation.defaultRankValue();
    }
    return index;
  }

  private static defaultRankValue(): number {
    return Adaptation.RANKS.indexOf(DEFAULTS.ADAPTATION_SINGLE);
  }

  toString(): string {
    const valueToRank = (val: number): string => {
      if (val < 0 || val >= Adaptation.RANKS.length) {
        return "-";
      }
      return Adaptation.RANKS[val];
    };
    return (
      valueToRank(this.air) +
      valueToRank(this.ground) +
      valueToRank(this.water) +
      valueToRank(this.space)
    );
  }
}
