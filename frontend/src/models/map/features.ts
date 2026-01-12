import type { Float } from "../BrandedTypes.ts";
import { TERRAIN_EFFECTS } from "./effects.ts";
import type { TerrainFeatureSpec } from "./types.ts";

type RecoverTerrainSpec = {
  type: "rate" | "value";
  value: Float;
} & TerrainFeatureSpec;

export const TERRAIN_FEATURES = {
  RecoverHP: {
    name: "ＨＰ回復",
    effects: [TERRAIN_EFFECTS.GainHP],
    type: "rate",
    value: 0.1,
  } as RecoverTerrainSpec,
  RecoverEN: {
    name: "ＥＮ回復",
    effects: [TERRAIN_EFFECTS.GainEN],
    type: "rate",
    value: 0.1,
  } as RecoverTerrainSpec,
  DamageHP: {
    name: "ＨＰ減少",
    effects: [TERRAIN_EFFECTS.GainHP],
    type: "rate",
    value: -0.1,
  } as RecoverTerrainSpec,
  DamageEN: {
    name: "ＥＮ減少",
    effects: [TERRAIN_EFFECTS.GainEN],
    type: "rate",
    value: -0.1,
  } as RecoverTerrainSpec,
  GainHP: {
    name: "ＨＰ増加",
    effects: [TERRAIN_EFFECTS.GainHP],
    type: "value",
    value: 1000,
  } as RecoverTerrainSpec,
  GainEN: {
    name: "ＥＮ増加",
    effects: [TERRAIN_EFFECTS.GainEN],
    type: "value",
    value: 10,
  } as RecoverTerrainSpec,
  ReduceHP: {
    name: "ＨＰ低下",
    effects: [TERRAIN_EFFECTS.GainHP],
    type: "value",
    value: -1000,
  } as TerrainFeatureSpec,
  ReduceEN: {
    name: "ＥＮ低下",
    effects: [TERRAIN_EFFECTS.GainEN],
    type: "value",
    value: -10,
  } as TerrainFeatureSpec,
  AddStatus: {
    name: "状態付加",
    effects: [TERRAIN_EFFECTS.AddStatus],
  },
  Collision: {
    name: "衝突",
    effects: [TERRAIN_EFFECTS.Collision],
  },
  Friction: {
    name: "摩擦",
    effects: [TERRAIN_EFFECTS.Friction],
  },
  Stop: {
    name: "移動停止",
    effects: [TERRAIN_EFFECTS.Stop],
  },
} as const satisfies Record<string, TerrainFeatureSpec>;
