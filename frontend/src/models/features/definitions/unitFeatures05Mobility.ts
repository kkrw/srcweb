import type { Integer } from "../../BrandedTypes";
import { type FeatureSpec, FeatureTarget, ZOCType } from "../types";

// ### 移動系特殊能力
export const FEATURES_U_05_MOBILITY = {
  Teleport: {
    name: "テレポート",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "テレポートを行い、移動力+テレポートレベル で地形を無視して移動。;発動時にＥＮ消費。",
  },
  Jump: {
    name: "ジャンプ",
    target: FeatureTarget.Unit,
    effects: [],
    description: "移動力+ジャンプレベル で地上地形を無視しながらジャンプ移動。",
  },
  PhasingMovement: {
    name: "透過移動",
    target: FeatureTarget.Unit,
    effects: [],
    description: "障害物を無視して移動。",
  },
  PassThroughMovement: {
    name: "すり抜け移動",
    target: FeatureTarget.Unit,
    effects: [],
    description: "敵ユニットがいるマスを通過可能。",
  },
  WaterMovement: {
    name: "水上移動",
    target: FeatureTarget.Unit,
    effects: [],
    description: "水上に浮かんで移動可能。",
  },
  EnableHover: {
    name: "ホバー移動",
    target: FeatureTarget.Unit,
    effects: [
      { type: "EnableHover", enableHover: true },
      { type: "FixMovementCost", terrainName: "雪原", cost: 1 as Integer },
      { type: "FixMovementCost", terrainName: "砂漠", cost: 1 as Integer },
      { type: "EnConsumptionMovement", enConsumptionAmount: 5 as Integer },
    ],
    description:
      "空中に浮きながら移動することで砂漠と雪原の移動コストが１になる。;また、水上移動も可能。ただし移動時に5ＥＮ消費。",
  },
  Swim: {
    name: "水泳",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "水中を泳いで移動可能。深海等の深い水の地形に進入することが出来る。",
  },
  ExtraMovement: {
    name: "追加移動力",
    target: FeatureTarget.Unit,
    effects: [{ type: "ExtraMovement" }],
    description: "指定地形にいると、移動力が 追加移動力レベル 増加。",
  },
  TerrainAdaptation: {
    name: "地形適応",
    target: FeatureTarget.Unit,
    effects: [
      { type: "FixMovementCost", terrainName: "森林", cost: 1 as Integer },
    ],
    description: "指定された地形での移動コストを１にする。",
  },
  MovementRestriction: {
    name: "移動制限",
    target: FeatureTarget.Unit,
    effects: [],
    description: "特定の地形でのみ移動可能になる。",
  },
  Impassable: {
    name: "進入不可",
    target: FeatureTarget.Unit,
    effects: [],
    description: "特定の地形に進入できなくなる。",
  },
  ZOC: {
    name: "ＺＯＣ",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "ZOC",
        rangeRate: 1 as Integer,
        defaultArea: ZOCType.AREA,
      },
    ],
    description: "周囲のマスに進入した敵ユニットの移動を妨げる。",
  },
  ZOCNullification: {
    name: "ＺＯＣ無効化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "ＺＯＣによる影響を受けずに移動できる。",
  },
  WideZOCNullification: {
    name: "広域ＺＯＣ無効化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "効果範囲マス以内の対抗陣営によるＺＯＣマスを無効化する。",
  },
  AdjacentZOCNullification: {
    name: "隣接ユニットＺＯＣ無効化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "隣接した対抗陣営のユニットによるＺＯＣマスの発生を無効化する。",
  },
} as const satisfies Record<string, FeatureSpec>;
