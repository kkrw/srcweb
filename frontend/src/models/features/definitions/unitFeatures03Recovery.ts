import type { Float } from "../../BrandedTypes";
import { type FeatureSpec, FeatureTarget } from "./../types";

// ### 回避系特殊能力
export const FEATURES_U_03_RECOVERY = {
  // ### 回復系特殊能力
  RepairDevice: {
    name: "修理装置",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `修理装置Lv*[=別名]`\n他のユニットの修理を行うことができます。修理を受けたユニットのＨＰ回復率は修理装置のレベルによって決まります。\n\n|    レベル | 回復率 |\n| --------: | -----: |\n| 1（既定） |    30% |\n|         2 |    50% |\n|         3 |   100% |",
  },
  ResupplyDevice: {
    name: "補給装置",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `補給装置[=別名]`\n他のユニットの補給を行うことができます。補給を受けたユニットのパイロットの気力は 10 低下します。",
  },
  Mothership: {
    name: "母艦",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `母艦[=別名]`\n他のユニットを格納し、格納したユニットのＨＰやＥＮ、弾数、アビリティ使用回数を回復させることが出来ます。ＨＰとＥＮはそれぞれ１ターンに最大値の 50%回復します。また、弾数とアビリテ ィ使用回数は１ターンで全て回復します。\nなお、格納できるユニットは母艦能力および格納不可能力を持たないユニットに限られます。",
  },
  Undockable: {
    name: "格納不可",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `格納不可[=別名]`\nこの能力を持つユニットは母艦に格納することができなくなります。",
  },
  AutoRepair: {
    name: "ＨＰ回復",
    target: FeatureTarget.Unit,
    effects: [{ type: "AutoRepair", repairRate: 0.1 as Float }],
    description: "毎ターン、HP を (Lv * 10)% 回復します。",
  },
  AutoEnSupply: {
    name: "ＥＮ回復",
    target: FeatureTarget.Unit,
    effects: [{ type: "AutoEnSupply", supplyRate: 0.1 as Float }],
    description: "毎ターン、EN を (Lv * 10)% 回復します。",
  },
  SpiritualPowerRecovery: {
    name: "霊力回復",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `霊力回復Lv*[=別名]`\n通常の霊力回復に加えて(毎ターン最大霊力値の 1/16 回復)、10× レベル%の割合で霊力が毎ターン回復します。",
  },
  HPConsumption: {
    name: "ＨＰ消費",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `ＨＰ消費Lv*[=別名]`\n`10×レベル%`の割合で毎ターンＨＰが減少します。\nただしＨＰが 0 になることはありません。",
  },
  ENConsumption: {
    name: "ＥＮ消費",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `ＥＮ消費Lv*[=別名]`\n`10×レベル%`の割合で毎ターンＥＮが減少します。\nＥＮが 0 になると行動不能になるので注意してください。",
  },
  SpiritualPowerConsumption: {
    name: "霊力消費",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `霊力消費Lv*[=別名]`\n`10×レベル%`の割合で毎ターン霊力が減少します。",
  },
} as const satisfies Record<string, FeatureSpec>;
