import { FEATURES_P_01_DEFFENCE } from "./definitions/pilotFeatures01Defence";
import { FEATURES_P_02_ATTACK } from "./definitions/pilotFeatures02Attack";
import { FEATURES_P_03_SPECIAL_ABILITY } from "./definitions/pilotFeatures03SpecialAbility";
import { FEATURES_P_04_POTENTIAL } from "./definitions/pilotFeatures04Potential";
import { FEATURES_P_05_ASSIST_ACTION } from "./definitions/pilotFeatures05AssistAction";
import { FEATURES_P_06_SUPPORT } from "./definitions/pilotFeatures06Support";
import { FEATURES_P_07_GROWTH } from "./definitions/pilotFeatures07Growth";
import { FEATURES_P_08_SPECIAL_POWER } from "./definitions/pilotFeatures08SP";
import { FEATURES_P_09_MORALE } from "./definitions/pilotFeatures09Morale";
import { FEATURES_P_99_OTHER } from "./definitions/pilotFeatures99Other";
import { FEATURES_U_01_DEFENCE } from "./definitions/unitFeatures01Defence";
import { FEATURES_U_02_EVASION } from "./definitions/unitFeatures02Evasion";
import { FEATURES_U_03_RECOVERY } from "./definitions/unitFeatures03Recovery";
import { FEATURES_U_04_CONVERTER } from "./definitions/unitFeatures04Converter";
import { FEATURES_U_05_MOBILITY } from "./definitions/unitFeatures05Mobility";
import { FEATURES_U_06_TRANSFORM } from "./definitions/unitFeatures06Transform";
import { FEATURES_U_07_PILOT } from "./definitions/unitFeatures07Pilot";
import { FEATURES_U_08_WEAPON } from "./definitions/unitFeatures08Weapon";
import { FEATURES_U_09_EQUIPMENT } from "./definitions/unitFeatures09Equipment";
import { FEATURES_U_10_BGM } from "./definitions/unitFeatures10BGM";
import { FEATURES_U_11_RANK_UP } from "./definitions/unitFeatures11RankUp";
import { FEATURES_U_12_ENCHANCE } from "./definitions/unitFeatures12Enchance";
import { FEATURES_U_99_OTHER } from "./definitions/unitFeatures99Other";
import { type FeatureSpec, FeatureTarget } from "./types";

const nullDescription = "<null>";

export const FEATURES = {
  None: {
    target: FeatureTarget.None,
    name: "",
    effects: [],
    description: nullDescription,
  },
  // # ========== パイロット用特殊能力 =========
  DummyForPilot: {
    target: FeatureTarget.Pilot,
    name: "",
    effects: [],
    description: nullDescription,
  },
  ...FEATURES_P_01_DEFFENCE,
  ...FEATURES_P_02_ATTACK,
  ...FEATURES_P_03_SPECIAL_ABILITY,
  ...FEATURES_P_04_POTENTIAL,
  ...FEATURES_P_05_ASSIST_ACTION,
  ...FEATURES_P_06_SUPPORT,
  ...FEATURES_P_07_GROWTH,
  ...FEATURES_P_08_SPECIAL_POWER,
  ...FEATURES_P_09_MORALE,
  ...FEATURES_P_99_OTHER,
  // # ========== ユニット用特殊能力 ==========
  DummyForUnit: {
    target: FeatureTarget.Unit,
    name: "",
    effects: [],
    description: nullDescription,
  },
  ...FEATURES_U_01_DEFENCE,
  ...FEATURES_U_02_EVASION,
  ...FEATURES_U_03_RECOVERY,
  ...FEATURES_U_04_CONVERTER,
  ...FEATURES_U_05_MOBILITY,
  ...FEATURES_U_06_TRANSFORM,
  ...FEATURES_U_07_PILOT,
  ...FEATURES_U_08_WEAPON,
  ...FEATURES_U_09_EQUIPMENT,
  ...FEATURES_U_10_BGM,
  ...FEATURES_U_11_RANK_UP,
  ...FEATURES_U_12_ENCHANCE,
  ...FEATURES_U_99_OTHER,
} as const satisfies Record<string, FeatureSpec>;
