import { type FeatureSpec, FeatureTarget } from "../types";

// ### アイテム関連特殊能力
export const FEATURES_U_09_EQUIPMENT = {
  EquipSlot: {
    name: "装備個所",
    target: FeatureTarget.Unit,
    effects: [],
    description: "アイテムを装備できる位置を指定。",
    visible: false,
  },
  WeaponClass: {
    name: "武器クラス",
    target: FeatureTarget.Unit,
    effects: [],
    description: "装備可能な武器の種類を指定。",
  },
  ArmorClass: {
    name: "防具クラス",
    target: FeatureTarget.Unit,
    effects: [],
    description: "装備可能な防具の種類を指定。",
  },
  Hardpoint: {
    name: "ハードポイント",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した装備個所にアイテムをレベル数だけ装備可能。",
    visible: false,
  },
  Ambidextrous: {
    name: "両手利き",
    target: FeatureTarget.Unit,
    effects: [],
    description: "両手に武器を装備可能。",
  },
} as const satisfies Record<string, FeatureSpec>;
