import type { Float } from "../models/BrandedTypes";
import { parseCondition } from "../models/Condition";
import { createFeatureData, DEFAULT_LEVEL } from "../models/FeatureData";
import { FEATURES } from "../models/features/definitions";
import { findFeatureByName } from "../models/features/registry";
import type { Feature, FeatureSpec } from "../models/features/types";
import { parseSkillRequirement } from "../models/SkillRequirement";
import { isNumericString } from "./utils";

/**
 * Represents a preprocessed line with original line number tracking
 */
export type ParsedFeature = Feature & { isDescriptionOnly?: boolean };

/**
 * Parses a single feature definition string
 * Based on VB5 UnitData.cls AddFeature method (lines 151-307)
 *
 * @param featureText - Feature definition string (e.g., "変形Lv3=ドラゴン <地上> (術Lv2)")
 * @returns Feature object
 */
export function parseFeature(featureText: string): ParsedFeature {
  let ftype = "";
  let flevel = DEFAULT_LEVEL;
  let fdata = "";
  let requiredSkill = "";
  let requiredCondition = "";

  let buf = featureText.trim();

  // 1. Extract required skill from "(...)"
  if (buf.endsWith(")")) {
    const skillStart = buf.indexOf(" (");
    if (skillStart > 0) {
      requiredSkill = buf.substring(skillStart + 2, buf.length - 1).trim();
      buf = buf.substring(0, skillStart).trim();

      // If the entire string was "(...)", set to empty
      if (buf === "") {
        buf = featureText.trim();
        requiredSkill = "";
      }
    }
  }

  // 2. Extract required condition from "<...>"
  if (buf.endsWith(">")) {
    const conditionStart = buf.indexOf(" <");
    if (conditionStart > 0) {
      requiredCondition = buf
        .substring(conditionStart + 2, buf.length - 1)
        .trim();
      buf = buf.substring(0, conditionStart).trim();

      // If the entire string was "<...>", set to empty
      if (buf === "") {
        buf = featureText.trim();
        requiredCondition = "";
      }
    }
  }

  // 3. Parse level and parameters
  const lvIndex = buf.indexOf("Lv");
  const eqIndex = buf.indexOf("=");

  // Important: Ignore "Lv" if it appears after "=" (to exclude Lv in parameters)
  let validLvIndex = lvIndex;
  if (lvIndex > 0 && eqIndex > 0 && lvIndex > eqIndex) {
    validLvIndex = -1;
  }

  // 4. Split into 4 patterns
  if (validLvIndex > 0 && eqIndex > 0) {
    // Pattern 1: Both "Lv" and "=" exist
    // Example: "変形Lv3=ドラゴン"
    ftype = buf.substring(0, validLvIndex).trim();

    const levelStr = buf.substring(validLvIndex + 2, eqIndex).trim();
    flevel = parseFloat(levelStr) as Float;
    if (isNaN(flevel)) {
      flevel = DEFAULT_LEVEL;
    }

    fdata = buf.substring(eqIndex + 1).trim();
  } else if (validLvIndex > 0) {
    // Pattern 2: Only "Lv" exists
    // Example: "変形Lv3"
    ftype = buf.substring(0, validLvIndex).trim();

    const levelStr = buf.substring(validLvIndex + 2).trim();
    flevel = parseFloat(levelStr) as Float;
    if (isNaN(flevel)) {
      flevel = DEFAULT_LEVEL;
    }
  } else if (eqIndex > 0) {
    // Pattern 3: Only "=" exists
    // Example: "変形=ドラゴン"
    ftype = buf.substring(0, eqIndex).trim();
    fdata = buf.substring(eqIndex + 1).trim();
  } else {
    // Pattern 4: Neither exists
    // Example: "バリア"
    ftype = buf.trim();
  }

  // 5. Remove all double quotes from parameters
  // This handles both surrounding quotes and quotes within the parameter string
  fdata = fdata.replaceAll(`"`, "");

  // 6. Parse parameters / alias
  let visible = true;
  let displayName: string | undefined = undefined;
  let description: string | undefined = undefined;
  let isDescriptionOnly = false;
  let rawParameters: string[] | undefined = undefined;

  const tokens = fdata ? fdata.trim().split(/\s+/) : [];
  if (tokens.length > 0 && tokens[0] !== "") {
    const head = tokens[0];
    if (head === "非表示") {
      visible = false;
      if (tokens.length > 1) {
        rawParameters = tokens.slice(1);
      }
    } else if (head === "解説") {
      isDescriptionOnly = true;
      description = tokens.slice(1).join(" ");
    } else if (!isNumericString(head)) {
      displayName = head;
      if (tokens.length > 1) {
        rawParameters = tokens.slice(1);
      }
    } else {
      rawParameters = tokens;
    }
  }

  // 7. Find the feature spec from the registry
  const foundSpec = findFeatureByName(ftype);
  const spec: FeatureSpec = foundSpec || FEATURES.DummyForUnit;

  // 8. Determine the level to use
  // If no level was specified (DEFAULT_LEVEL), use spec's defaultLevel if available
  let effectiveLevel: number | undefined = flevel;
  if (effectiveLevel === DEFAULT_LEVEL) {
    if (spec.defaultLevel !== undefined) {
      effectiveLevel = spec.defaultLevel;
    } else {
      effectiveLevel = undefined;
    }
  }

  // 9. Create the Feature object
  const feature = createFeatureData({
    spec: spec || FEATURES.None,
    level: effectiveLevel,
    name: ftype,
    displayName: displayName,
    description: description,
    showLevel: true,
    visible: visible,
    requiredSkill: parseSkillRequirement(requiredSkill),
    requiredCondition: parseCondition(requiredCondition),
    rawParameters: rawParameters,
  });

  // Special handling for Dummy abilities: parameters are treated as description
  // e.g. "Name=Alias Description Text" -> displayName="Alias", description="Description Text"
  if (
    feature.spec === FEATURES.DummyForUnit &&
    !feature.description &&
    feature.rawParameters
  ) {
    feature.description = feature.rawParameters.join(" ");
    feature.rawParameters = undefined;
  }

  return {
    ...feature,
    isDescriptionOnly,
  };
}
