import type { Float } from "../BrandedTypes";
import type { Condition } from "../Condition";
import type { SkillRequirement } from "../SkillRequirement";
import type { FeatureEffect } from "./effects";

export const FeatureTarget = {
  Pilot: "Pilot",
  Unit: "Unit",
  None: "None",
} as const;
export type FeatureTarget = (typeof FeatureTarget)[keyof typeof FeatureTarget];

export interface FeatureSpec {
  readonly target: FeatureTarget;
  readonly name: string;
  readonly effects: readonly FeatureEffect[];
  readonly description: string;
  readonly defaultLevel?: Float;
  readonly mainPilotOnly?: boolean;
  readonly visible?: boolean;
}

export interface Feature {
  readonly spec: FeatureSpec;
  level?: number;
  name: string;
  displayName?: string;
  description?: string;
  showLevel: boolean;
  visible: boolean;
  requiredSkill?: SkillRequirement[];
  requiredCondition?: Condition;
  rawParameters?: string[];
}

export interface ConversionSpec {
  target: "hp" | "en" | "armor" | "mobility" | "speed";
  sourceFeatureName: string;
  unit: Float;
  rate: Float;
}

export const ZOCType = {
  AREA: "area",
  LINE: "line",
  VERTICAL: "vertical",
  HORIZONTAL: "horizontal",
} as const;
export type ZOCType = (typeof ZOCType)[keyof typeof ZOCType];
