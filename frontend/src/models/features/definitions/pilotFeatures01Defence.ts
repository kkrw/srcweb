import type { Float } from "../../BrandedTypes";
import { type FeatureSpec, FeatureTarget } from "../types";

// ### 防御・回避に関する特殊能力
export const FEATURES_P_01_DEFFENCE = {
  EnableParry: {
    name: "切り払い",
    target: FeatureTarget.Pilot,
    effects: [{ type: "EnableParrying", evasionRate: (1 / 16) as Float }],
    description:
      "ユニットが持つ武器または格闘武器を使って Lv/16 の確率で敵の攻撃を無効化します。",
  },
  EnableShield: {
    name: "Ｓ防御",
    target: FeatureTarget.Pilot,
    effects: [{ type: "EnableReduceDamage", successRate: (1 / 16) as Float }],
    description:
      "ユニットが持つシールドを使って Lv/16 の確率でダメージを軽減します。",
  },
  Interception: {
    name: "迎撃",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "迎撃技能です。ユニットが迎撃用武器を持っている場合に迎撃レベル/16 の確率で実弾攻撃(実)による攻撃を完全に無効化することができます。主に切り払いを持たないパイロット用に使ってください。\nメインパイロット以外のパイロットが技能を持っている場合にも有効です。そのユニットに乗っているパイロット＆サポートのうち最も高いレベルの迎撃能力が迎撃に使われます。",
  },
  PilotShadowClone: {
    name: "分身",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "分身レベル/16 の確率で分身し、攻撃をかわすことができます。\n攻撃側のパイロットが分身能力を持っている場合、分身の確率は自分の分身能力のレベルが相手の分身能力レベル/2 だけ下げられたものとして判定します。\n(SRC Ver.1.6 の騎士に相当する能力です。)",
    mainPilotOnly: true,
  },
  Durability: {
    name: "耐久",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ダメージ計算の際にユニットの装甲値が 5× 耐久レベル%増加します。\n「Option コマンド」で「防御力レベルアップ」のオプションを選択するとステータスウィンドウにダメージ計算の際の装甲値の修正値であるパイロットの能力値「防御」が表示されますが、耐久レベルは「防御」への修正値として使われます(この場合、耐久能力は特殊能力一覧に表示されません)。\n防御 = 100 + パイロットのレベル + 5× 耐久レベル",
    mainPilotOnly: true,
  },
} as const satisfies Record<string, FeatureSpec>;
