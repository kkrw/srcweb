import type { Float, Integer } from "../../BrandedTypes";

// ### 防御特性に関する特殊能力
export type FeatureEffectUnit01Defence =
  | {
      type: "ReduceDamage";
      damageReductionRate?: Float;
      damageReduction?: Integer;
      successRateBonus?: Float;
      enCost?: Integer;
    }
  | {
      type: "BlockDamage";
      damageCapacity: Integer;
      enCost?: Integer;
    };
