import type { Float, Integer } from "../../BrandedTypes";

// ### 回復系特殊能力
export type FeatureEffectUnit03Recovery =
  | {
      type: "AutoRepair";
      repairRate?: Float;
      repairAmount?: Integer;
    }
  | {
      type: "AutoEnSupply";
      supplyRate?: Float;
      supplyAmount?: Integer;
    };
