import type { Float } from "../../BrandedTypes";
import { type FeatureSpec, FeatureTarget } from "../types";

// ### 防御・回避に関する特殊能力
export const FEATURES_P_01_DEFFENCE = {
  EnableParry: {
    name: "切り払い",
    target: FeatureTarget.Pilot,
    effects: [{ type: "EnableParrying", evasionRate: (1 / 16) as Float }],
    description:
      "格闘武器(武)、突進技(突)、実弾攻撃(実)による攻撃を 切り払いレベル/16 の確率で切り払って回避する。",
  },
  EnableShield: {
    name: "Ｓ防御",
    target: FeatureTarget.Pilot,
    effects: [{ type: "EnableReduceDamage", successRate: (1 / 16) as Float }],
    description:
      "シールド防御を行い、ダメージを Ｓ防御レベル×100＋400 減少させる。;ユニットが盾を持っていない場合は Ｓ防御レベル/16 の確率でシールド防御を行う。",
  },
  Interception: {
    name: "迎撃",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "実弾攻撃(実)による攻撃を 迎撃レベル/16 の確率で迎撃する。",
  },
  PilotShadowClone: {
    name: "分身",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "分身レベル/16 の確率で分身し、攻撃を回避する。",
    mainPilotOnly: true,
  },
  Durability: {
    name: "耐久",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ダメージ計算の際に装甲を 5×耐久レベル%増加させる。",
    mainPilotOnly: true,
  },
} as const satisfies Record<string, FeatureSpec>;
