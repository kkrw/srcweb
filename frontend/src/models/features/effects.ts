import type { Float, Integer } from "../BrandedTypes";
import type { ConversionSpec, ZOCType } from "./types";

export type FeatureEffect =
  // # ========== パイロット用特殊能力 ========
  // ### 防御・回避に関する特殊能力
  | { type: "EnableReduceDamage"; successRate: Float }
  | { type: "EnableParrying"; evasionRate: Float }
  // ### 攻撃に関する特殊能力
  // ### 特異資質に関する特殊能力
  // ### 瀕死時に発動する特殊能力
  | {
      type: "Potentiality";
      hpThreshold: Float;
      hitBonus: Integer;
      evasionBonus: Integer;
      criticalRateBonus: Integer;
    }
  // ### 援護行動に関する特殊能力
  // ### サポート系特殊能力
  // ### パイロット成長に関する特殊能力
  // ### スペシャルパワーに関する特殊能力
  // ### 気力に関する特殊能力
  // ### その他の特殊能力
  // # ========== ユニット用特殊能力 ==========
  // ### 防御特性に関する特殊能力
  // ### 防御系特殊能力
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
    }
  // ### 回避系特殊能力
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
    }
  // ### 回復系特殊能力
  | {
      type: "AutoRepair";
      repairRate?: Float;
      repairAmount?: Integer;
    }
  | {
      type: "AutoEnSupply";
      supplyRate?: Float;
      supplyAmount?: Integer;
    }
  // ### コンバータ系特殊能力
  | {
      type: "ForceConverter";
      conversionSpec: ConversionSpec[];
    }
  | {
      type: "BoostDamage";
      damageBoostRate: Float;
      requiredMorale?: Integer;
    }
  // ### 移動系特殊能力
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
// ### 変形系特殊能力
// ### パイロット関連特殊能力
// ### 武器関連特殊能力
// ### アイテム関連特殊能力
// ### ＢＧＭ関連特殊能力
// ### ユニット改造関連特殊能力
// ### ユニット強化関連特殊能力
// ### その他の特殊能力
