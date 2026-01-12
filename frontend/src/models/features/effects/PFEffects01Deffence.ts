import type { Float } from "../../BrandedTypes";
// ### 防御・回避に関する特殊能力
export type FeatureEffectPilot01Deffence =
  | { type: "EnableReduceDamage"; successRate: Float }
  | { type: "EnableParrying"; evasionRate: Float };
