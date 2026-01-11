import type { Integer } from "../../BrandedTypes";
import { type FeatureSpec, FeatureTarget, ZOCType } from "../types";

// ### 移動系特殊能力
export const FEATURES_U_05_MOBILITY = {
  Teleport: {
    name: "テレポート",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `テレポートLvN[=別名 ＥＮ消費量]`\n指定されたＥＮを消費して「移動力＋ N」の距離をテレポートすることが可能です。\nテレポートによる移動は地形や敵ユニットによる影響を受けません。\nＺＯＣも無効です。\n別名とＥＮ消費量は省略可能です(ただし別名だけを省略するのは不可)。\nＥＮ消費量が省略された場合は 40 ＥＮ消費するものと見なされます。",
  },
  Jump: {
    name: "ジャンプ",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `ジャンプLvN[=別名 ＥＮ消費量]`\n指定されたＥＮを消費して`移動力＋N`の距離をジャンプし、地上地形を無視して移動することが可能です(ただし敵ユニットを飛び越すことはできません)。\nＺＯＣも無効です。\n別名とＥＮ消費量は省略可能です(ただし別名だけを省略するのは不可)。\nＥＮ消費量が省略された場合、ジャンプしてもＥＮは消費しません。\nなお、空中にいる時はジャンプ移動できません。",
  },
  PhasingMovement: {
    name: "透過移動",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `透過移動[=別名]`\n幽霊など、障害物を通り抜けて移動するユニットの表現に用います。全ての地形の移動力が 1 になりますが、テレポートと異なり敵ユニットのいるマスを通過することはできません。",
  },
  PassThroughMovement: {
    name: "すり抜け移動",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `すり抜け移動[=別名]`\n敵ユニットのいるマスを通過出来るようになります。\n「また後述するＺＯＣ能力や Option コマンド」のオプション「ＺＯＣ」によるＺＯＣを移動中に通過することが出来るようになります。",
  },
  WaterMovement: {
    name: "水上移動",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `水上移動[=別名]`\n水上を移動することが可能になります。\n船のように水上のみを移動するユニットには水上移動能力を付加するとともに、移動可能地形に「-」を指定し、地形適応を「-A--」にしてください。",
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
      "水上移動を可能にし、雪原と砂漠での移動コストが 1 になります。移動時に EN を 5 消費します。",
  },
  Swim: {
    name: "水泳",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `水泳[=別名]`\n水面を泳ぎながら移動できるようになります。\n水を含む地形を移動する際に水中を通ることは通常の場合と変わりませんが、移動可能地形に「水」が含まれていなくても深海地形に進入することが出来ます。",
  },
  ExtraMovement: {
    name: "追加移動力",
    target: FeatureTarget.Unit,
    effects: [{ type: "ExtraMovement" }],
    description: "移動力が Lv 分増加します。",
  },
  TerrainAdaptation: {
    name: "地形適応",
    target: FeatureTarget.Unit,
    effects: [
      { type: "FixMovementCost", terrainName: "森林", cost: 1 as Integer },
    ],
    description:
      "指定された地形での移動コストを 1 にします。（パラメータで地形名を指定）",
  },
  MovementRestriction: {
    name: "移動制限",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `移動制限=別名 地形名称１ 地形名称２ …`\n特定の地形でのみ移動可能になります。\nただし、ユニットが空中や地中にいる場合は制限を受けません。地形は複数指定可能です。\n例 `移動制限=砂渡り 砂漠 砂`",
  },
  Impassable: {
    name: "進入不可",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `進入不可=別名 地形名称１ 地形名称２ …`\n特定の地形に進入できなくなります。\nただし、ユニットが空中や地中にいる場合は制限を受けません。地形は複数指定可能です。\n例 `進入不可=体重１００ｔ 砂漠 砂`",
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
    description: "周囲の地形を制圧し、敵ユニットの移動を妨げます。",
  },
  ZOCNullification: {
    name: "ＺＯＣ無効化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `ＺＯＣ無効化Lv*=別名`\nＺＯＣによる影響を受けずに移動できます。\nただしレベル指定がされている場合、ＺＯＣ無効化レベル以上のレベルのＺＯＣは無効化出来ません。\nレベル指定なし、あるいは Lv1 の場合は常に効果を発揮します。\n例 `ＺＯＣ無効化Lv2=ＺＯＣ突破`",
  },
  WideZOCNullification: {
    name: "広域ＺＯＣ無効化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `広域ＺＯＣ無効化Lv*=別名 効果範囲`\n効果範囲マス以内の対抗陣営によるＺＯＣマスを無効化します。\nレベル指定がされている場合、広域ＺＯＣ無効化レベル以上のレベルのＺＯＣは無効化出来ません。\nレベル指定なし、あるいは Lv1 の場合は常に効果を発揮します。\n例 `広域ＺＯＣ無効化=ＺＯＣ妨害 3`",
  },
  AdjacentZOCNullification: {
    name: "隣接ユニットＺＯＣ無効化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `隣接ユニットＺＯＣ無効化Lv*=別名`\n隣接した対抗陣営のユニットによるＺＯＣマスの発生を無効化します。\nレベル指定がされている場合、広域ＺＯＣ無効化レベル以上のレベルのＺＯＣは無効化出来ません。\nレベル指定なし、あるいは Lv1 の場合は常に効果を発揮します。\n例 `隣接ユニットＺＯＣ無効化=ＺＯＣ封じ`",
  },
} as const satisfies Record<string, FeatureSpec>;
