/**
 * スペシャルパワー（特殊能力）のデータモデル
 *
 * パイロットが習得するスペシャルパワーの定義です。
 * 例: "熱血", "必中", "加速" など
 */
export interface SpecialPower {
  /**
   * スペシャルパワーの名称
   * 例: "熱血", "必中", "加速"
   */
  name: string;

  /**
   * 習得するパイロットレベル
   */
  requiredLevel: number;

  /**
   * 使用に必要なSP消費量
   */
  spCost?: number;
}

/**
 * SpecialPower のファクトリ関数
 */
export function createSpecialPower(params: Partial<SpecialPower> = {}): SpecialPower {
  return {
    name: params.name || "",
    requiredLevel: params.requiredLevel || 1,
    spCost: params.spCost || 0,
  };
}
