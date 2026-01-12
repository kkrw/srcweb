import type { Float } from "../../BrandedTypes";
import { type FeatureSpec, FeatureTarget } from "./../types";

// ### 回復系特殊能力
export const FEATURES_U_03_RECOVERY = {
  RepairDevice: {
    name: "修理装置",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "他のユニットのＨＰを最大ＨＰの30%だけ回復。;（Lv2:50%、Lv3:100%）",
  },
  ResupplyDevice: {
    name: "補給装置",
    target: FeatureTarget.Unit,
    effects: [],
    description: "他のユニットのＥＮと弾薬を全快。;ただしユニットのパイロットの気力は-10。",
  },
  Mothership: {
    name: "母艦",
    target: FeatureTarget.Unit,
    effects: [],
    description: "他のユニットを格納し、修理・運搬可能。",
  },
  Undockable: {
    name: "格納不可",
    target: FeatureTarget.Unit,
    effects: [],
    description: "母艦に格納することが出来ない。",
  },
  AutoRepair: {
    name: "ＨＰ回復",
    target: FeatureTarget.Unit,
    effects: [{ type: "AutoRepair", repairRate: 0.1 as Float }],
    description: "毎ターン最大ＨＰの 10×ＨＰ回復レベル% 分のＨＰを回復。",
  },
  AutoEnSupply: {
    name: "ＥＮ回復",
    target: FeatureTarget.Unit,
    effects: [{ type: "AutoEnSupply", supplyRate: 0.1 as Float }],
    description: "毎ターン最大ＥＮの 10×ＥＮ回復レベル% 分のＥＮを回復。",
  },
  SpiritualPowerRecovery: {
    name: "霊力回復",
    target: FeatureTarget.Unit,
    effects: [],
    description: "毎ターン最大霊力の 10×霊力回復レベル% 分の霊力を回復。",
  },
  HPConsumption: {
    name: "ＨＰ消費",
    target: FeatureTarget.Unit,
    effects: [],
    description: "毎ターン最大ＨＰの 10×ＨＰ消費レベル% 分のＨＰを消費。",
  },
  ENConsumption: {
    name: "ＥＮ消費",
    target: FeatureTarget.Unit,
    effects: [],
    description: "毎ターン最大ＥＮの 10×ＥＮ消費レベル% 分のＥＮを消費。",
  },
  SpiritualPowerConsumption: {
    name: "霊力消費",
    target: FeatureTarget.Unit,
    effects: [],
    description: "毎ターン最大霊力の 10×霊力消費レベル% 分の霊力を消費。",
  },
} as const satisfies Record<string, FeatureSpec>;
