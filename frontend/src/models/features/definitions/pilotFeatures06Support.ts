import { type FeatureSpec, FeatureTarget } from "./../types";

// ### サポート系特殊能力
export const FEATURES_P_06_SUPPORT = {
  SubPilotSupport: {
    name: "サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "自分がサポートパイロットの時にメインパイロットの命中・回避に +3×サポートレベル。",
  },
  MeleeSupport: {
    name: "格闘サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "自分がサポートパイロットの時にメインパイロットの格闘に +2×格闘サポートレベル。",
  },
  RangedSupport: {
    name: "射撃サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "自分がサポートパイロットの時にメインパイロットの射撃に +2×射撃サポートレベル。",
  },
  MagicSupport: {
    name: "魔力サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "自分がサポートパイロットの時にメインパイロットの魔力に +2×魔力サポートレベル。",
  },
  HitSupport: {
    name: "命中サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "自分がサポートパイロットの時にメインパイロットの命中に +2×命中サポートレベル。",
  },
  EvasionSupport: {
    name: "回避サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "自分がサポートパイロットの時にメインパイロットの回避に +2×回避サポートレベル。",
  },
  SkillSupport: {
    name: "技量サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "自分がサポートパイロットの時にメインパイロットの技量に +2×技量サポートレベル。",
  },
  ReactionSupport: {
    name: "反応サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "自分がサポートパイロットの時にメインパイロットの反応に +2×反応サポートレベル。",
  },
  Command: {
    name: "指揮",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "半径〇マス以内にいる味方ザコ・汎用及び階級所有パイロットの命中・回避に +5×指揮レベル。",
    mainPilotOnly: true,
  },
  Rank: {
    name: "階級",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "半径〇マス以内にいるザコ及び階級所有パイロットに指揮効果を与える。",
    mainPilotOnly: true,
  },
  WideSupport: {
    name: "広域サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "半径２マス以内にいる味方パイロットの命中・回避に +5×広域サポートレベル。",
    mainPilotOnly: true,
  },
} as const satisfies Record<string, FeatureSpec>;
