import type { FeatureEffectPilot01Deffence as FeatureEffectPilot01Defence } from "./effects/PFEffects01Deffence";
// import type { FeatureEffectPilot02Attack } from "./effects/PFEffects02Attack";
// import type { FeatureEffectPilot03SpecialAbility } from "./effects/PFEffects03SpecialAbility";
import type { FeatureEffectPilot04Potential } from "./effects/PFEffects04Potential";
// import type { FeatureEffectPilot05AssistAttack } from "./effects/PFEffects05AssistAttack";
// import type { FeatureEffectPilot06Support } from "./effects/PFEffects06Support";
// import type { FeatureEffectPilot07Growth } from "./effects/PFEffects07Growth";
// import type { FeatureEffectPilot08SpecialPower } from "./effects/PFEffects08SpecialPower";
// import type { FeatureEffectPilot09Morale } from "./effects/PFEffects09Morale";
// import type { FeatureEffectPilot10BGM } from "./effects/PFEffects10BGM";
// import type { FeatureEffectPilot99Other } from "./effects/PFEffects99Other";
import type { FeatureEffectUnit01Defence } from "./effects/UFEffects01Defence";
import type { FeatureEffectUnit02Evasion } from "./effects/UFEffects02Evasion";
import type { FeatureEffectUnit03Recovery } from "./effects/UFEffects03Recovery";
import type { FeatureEffectUnit04Converter } from "./effects/UFEffects04Converter";
import type { FeatureEffectUnit05Mobility } from "./effects/UFEffects05Mobility";
// import type { FeatureEffectUnit06Transform } from "./effects/UFEffects06Transform";
// import type { FeatureEffectUnit07Pilot } from "./effects/UFEffects07Pilot";
// import type { FeatureEffectUnit08Weapon } from "./effects/UFEffects08Weapon";
// import type { FeatureEffectUnit09Equipment } from "./effects/UFEffects09Equipment";
// import type { FeatureEffectUnit10BGM } from "./effects/UFEffects10BGM";
// import type { FeatureEffectUnit11RankUp } from "./effects/UFEffects11RankUp";
// import type { FeatureEffectUnit12Enhance } from "./effects/UFEffects12Enchance";
// import type { FeatureEffectUnit99Other } from "./effects/UFEffects99Other";

export type FeatureEffect =
  // # ========== パイロット用特殊能力 ========
  | FeatureEffectPilot01Defence
  // | FeatureEffectPilot02Attack
  // | FeatureEffectPilot03SpecialAbility
  | FeatureEffectPilot04Potential
  // | FeatureEffectPilot05AssistAttack
  // | FeatureEffectPilot06Support
  // | FeatureEffectPilot07Growth
  // | FeatureEffectPilot08SpecialPower
  // | FeatureEffectPilot09Morale
  // | FeatureEffectPilot10BGM
  // | FeatureEffectPilot99Other
  // # ========== ユニット用特殊能力 ==========
  | FeatureEffectUnit01Defence
  | FeatureEffectUnit02Evasion
  | FeatureEffectUnit03Recovery
  | FeatureEffectUnit04Converter
  | FeatureEffectUnit05Mobility;
// | FeatureEffectUnit06Transform
// | FeatureEffectUnit07Pilot
// | FeatureEffectUnit08Weapon
// | FeatureEffectUnit09Equipment
// | FeatureEffectUnit10BGM
// | FeatureEffectUnit11RankUp
// | FeatureEffectUnit12Enhance
// | FeatureEffectUnit99Other
