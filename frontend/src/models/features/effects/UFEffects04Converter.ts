import type { Float, Integer } from "../../BrandedTypes";
import type { ConversionSpec } from "../types";

// ### コンバータ系特殊能力
export type FeatureEffectUnit04Converter =
  | {
      type: "ForceConverter";
      conversionSpec: ConversionSpec[];
    }
  | {
      type: "BoostDamage";
      damageBoostRate: Float;
      requiredMorale?: Integer;
    };
