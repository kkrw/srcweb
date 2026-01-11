import type { Float, Integer } from "../../BrandedTypes";

// ### 回避系特殊能力
export type FeatureEffectUnit02Evasion =
  | {
      type: "ExtraEvasion";
      successRate: Float;
      enCost?: Integer;
      requiredMorale?: Integer;
      isPassive: boolean;
    }
  | {
      type: "Stealth";
      rangeRate: Integer;
      ignoreMapAttack: boolean;
      disabledOnAttack: boolean;
      disabledTurns: Integer;
      getEvasionBonus: boolean;
      evasionBonusRange?: Integer;
      evasionBonusRate?: Float;
      evasionBonus?: Integer;
      getHitBonus: boolean;
      hitBonusRate?: Float;
      hitBonus?: Integer;
    }
  | {
      type: "AntiStealth";
    };
