import type { Integer } from "../BrandedTypes";
import type { Terrain } from "./types";

export const TERRAINS = {
  Plain: {
    id: 1,
    name: "Plain",
    movementCost: 1 as Integer,
  },
  SnowField: {
    id: 2,
    name: "Snow Field",
    movementCost: 2 as Integer,
  },
} as const satisfies Record<string, Terrain>;
