import type { Float, Integer } from "../../BrandedTypes";
import { type FeatureSpec, FeatureTarget } from "./../types";

// ### 回避系特殊能力
export const FEATURES_U_02_EVASION = {
  SelfDuplication: {
    name: "分身",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "ExtraEvasion",
        successRate: 0.1 as Float,
        requiredMorale: 130 as Integer,
        isPassive: false,
      },
    ],
    defaultLevel: 5 as Float,
    description: "50%の確率で攻撃を完全に回避。;発動条件：気力130以上。",
  },
  ExtraEvasion: {
    name: "超回避",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "ExtraEvasion",
        successRate: 0.1 as Float,
        isPassive: false,
      },
    ],
    description: "あらゆる攻撃を 10×超回避レベル% の確率で回避。",
  },
  EmergencyTeleport: {
    name: "緊急テレポート",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "攻撃を受けた際に 10×緊急テレポートレベル% の確率でテレポートし、攻撃を回避。;テレポート先は指定マス以内の範囲の内、最も敵から遠い地点から選ばれる。",
  },
  Dummy: {
    name: "ダミー",
    target: FeatureTarget.Unit,
    effects: [],
    description: "ダミーを身代わりにして自分に命中した攻撃を ダミーレベル 回だけ無効化する。",
  },
  EvasionAttack: {
    name: "攻撃回避",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した属性の攻撃の命中率を元の 100-10×攻撃回避レベル% に減少させる。",
  },
  ECM: {
    name: "ＥＣＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "半径３マス以内の味方ユニットに対する攻撃の命中率を元の 100-5×ＥＣＭレベル% に減少させる。",
  },
  DebuffResistance: {
    name: "抵抗力",
    target: FeatureTarget.Unit,
    effects: [],
    description: "武器の特殊効果を受ける確率を 10×抵抗力レベル% 減少させる。",
  },
  MeleeWeapon: {
    name: "格闘武器",
    target: FeatureTarget.Unit,
    effects: [],
    description: "切り払いで使用する武器を指定する。",
    visible: false,
  },
  InterceptWeapon: {
    name: "迎撃武器",
    target: FeatureTarget.Unit,
    effects: [],
    description: "迎撃で使用する武器を指定する。",
    visible: false,
  },
  Stealth: {
    name: "ステルス",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "Stealth",
        rangeRate: 1 as Integer,
        ignoreMapAttack: false,
        disabledOnAttack: true,
        disabledTurns: 1 as Integer,
        getEvasionBonus: true,
        evasionBonusRate: 20 as Float,
        getHitBonus: true,
        hitBonus: 20 as Integer,
      },
    ],
    description:
      "敵から ステルスレベル マス以内にいない限り発見されない。;ただし自分から攻撃すると１ターン無効。",
    defaultLevel: 3 as Float,
  },
  AntiStealth: {
    name: "ステルス無効化",
    target: FeatureTarget.Unit,
    effects: [{ type: "AntiStealth" }],
    description: "このユニットに対してはステルスの全ての効果が無効化される。",
  },
} as const satisfies Record<string, FeatureSpec>;
