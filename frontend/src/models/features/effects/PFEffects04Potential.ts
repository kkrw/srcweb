import type { Float, Integer } from "../../BrandedTypes";
// ### 瀕死時に発動する特殊能力
export type FeatureEffectPilot04Potential = {
  type: "Potentiality";
  hpThreshold: Float;
  hitBonus: Integer;
  evasionBonus: Integer;
  criticalRateBonus: Integer;
};
