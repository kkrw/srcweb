import { type FeatureSpec, FeatureTarget } from "./../types";

// ### サポート系特殊能力
export const FEATURES_P_06_SUPPORT = {
  SubPilotSupport: {
    name: "サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "メインパイロットの命中＆回避を`3×サポートレベル`増加させます。\nそのパイロットがサブパイロットまたはサポートパイロットの場合にのみ有効です。",
  },
  MeleeSupport: {
    name: "格闘サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "メインパイロットの格闘を`2×格闘サポートレベル`増加させます。\nそのパイロットがサブパイロットまたはサポートパイロットの場合にのみ有効です。",
  },
  RangedSupport: {
    name: "射撃サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "メインパイロットの射撃を`2×射撃サポートレベル`増加させます。\nそのパイロットがサブパイロットまたはサポートパイロットであり、かつメインパイロットが「術」および「魔力所有」能力を持っていない場合にのみ有効です。",
  },
  MagicSupport: {
    name: "魔力サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "メインパイロットの射撃を`2×魔力サポートレベル`増加させます。\nそのパイロットがサブパイロットまたはサポートパイロットであり、かつメインパイロットが「術」もしくは「魔力所有」能力を持っている場合にのみ有効です。",
  },
  HitSupport: {
    name: "命中サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "メインパイロットの命中を`2×命中サポートレベル`増加させます。\nそのパイロットがサブパイロットまたはサポートパイロットの場合にのみ有効です。",
  },
  EvasionSupport: {
    name: "回避サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "メインパイロットの回避を`2×回避サポートレベル`増加させます。\nそのパイロットがサブパイロットまたはサポートパイロットの場合にのみ有効です。",
  },
  SkillSupport: {
    name: "技量サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "メインパイロットの技量を`2×技量サポートレベル`増加させます。\nそのパイロットがサブパイロットまたはサポートパイロットの場合にのみ有効です。",
  },
  ReactionSupport: {
    name: "反応サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "メインパイロットの反応を`2×反応サポートレベル`増加させます。\nそのパイロットがサブパイロットまたはサポートパイロットの場合にのみ有効です。",
  },
  Command: {
    name: "指揮",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "自分の周りにいる味方ユニットのパイロットの命中・回避を`5×指揮レベル`増加させます。\nザコ・汎用のパイロット、及び階級能力を有するパイロットにのみ有効です。\n指揮範囲はパイロットの持つ階級能力レベルによって決まります。\n階級能力を持たない場合、指揮範囲は半径２マスになります。\n範囲内に指揮能力保持者が複数いても効果は重複しません。\n階級レベルの高いパイロットの指揮効果が優先されます。\nなお、パイロットに後述するチーム能力を持たせることで指揮対象を限定する事が出来ます。",
    mainPilotOnly: true,
  },
  Rank: {
    name: "階級",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "指揮範囲と指揮効果の優先度を決定します。\n指揮能力保持者に持たせる以外にもザコパイロット以外のパイロットが指揮効果の恩恵を得られるようにするために持たせることもできます。\n指揮範囲は以下のようになっています。\n\n| レベル |    指揮範囲 | 例     |\n| -----: | ----------: | ------ |\n|      0 | 半径 2 マス | 一般兵 |\n|      1 | 半径 2 マス | 伍長   |\n|      2 | 半径 2 マス | 軍曹   |\n|      3 | 半径 2 マス | 曹長   |\n|      4 | 半径 2 マス | 准尉   |\n|      5 | 半径 2 マス | 少尉   |\n|      6 | 半径 2 マス | 中尉   |\n|      7 | 半径 3 マス | 大尉   |\n|      8 | 半径 3 マス | 少佐   |\n|      9 | 半径 3 マス | 中佐   |\n|     10 | 半径 4 マス | 大佐   |\n|     11 | 半径 4 マス | 准将   |\n|     12 | 半径 4 マス | 少将   |\n|     13 | 半径 5 マス | 中将   |\n|     14 | 半径 5 マス | 大将   |\n|     15 | 半径 5 マス | 元帥   |\n\n階級能力に別名を指定した場合、他の能力と異なりステータスウィンドウ等で能力名の後のレベル表示は行われません。\nこれは「大尉 Lv7」のような不自然な表示を防ぐための仕様です。",
    mainPilotOnly: true,
  },
  WideSupport: {
    name: "広域サポート",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "自分から半径 2 マス以内にいる味方ユニットのパイロットの命中・回避を`5×広域サポートレベル`増加させます。\n指揮能力と異なり、すべてのパイロットに有効です。\n範囲内に広域サポート能力保持者が複数いても効果は重複しません。\nなお、パイロットに後述するチーム能力を持たせることでサポート対象を限定する事が出来ます。",
    mainPilotOnly: true,
  },
} as const satisfies Record<string, FeatureSpec>;
