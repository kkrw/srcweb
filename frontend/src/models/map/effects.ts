import type { TerrainEffect } from "./types";

export const TERRAIN_EFFECTS = {
  GainHP: {
    name: "GainHP",
  },
  GainEN: {
    name: "GainEN",
  },
  AddStatus: {
    name: "AddStatus",
  },
  Collision: {
    name: "Collision",
  },
  Friction: {
    name: "Friction",
  },
  Stop: {
    name: "Stop",
  },
} as const satisfies Record<string, TerrainEffect>;
