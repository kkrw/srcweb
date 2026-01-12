import type { Float, Integer } from "../../BrandedTypes";
import type { ZOCType } from "../types";

// ### 移動系特殊能力
export type FeatureEffectUnit05Mobility =
  | {
      type: "EnableHover";
      enableHover: boolean;
    }
  | {
      type: "EnConsumptionMovement";
      enConsumptionRate?: Float;
      enConsumptionAmount?: Integer;
    }
  | {
      type: "FixMovementCost";
      terrainName: string;
      cost: Integer;
    }
  | {
      type: "ZOC";
      rangeRate: Integer;
      defaultArea: ZOCType;
    }
  | {
      type: "ExtraMovement";
    };
