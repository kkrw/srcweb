import { type FeatureSpec, FeatureTarget } from "../types";

// ### アイテム関連特殊能力
export const FEATURES_U_10_BGM = {
  // ### ＢＧＭ関連特殊能力
  BGM: {
    name: "ＢＧＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `ＢＧＭ=MIDIファイル名`\n戦闘時のＢＧＭの指定をすることができます。\n指定された MIDI ファイルはパイロットデータで指定されたものより優先されます。\n敵ユニットがこの能力を保有しており、かつユニットに乗っているパイロットがザコパイロットでない場合はボス戦用のＢＧＭと見なされ、敵側のＢＧＭが優先されます。\nこの場合、ＢＧＭは他の敵との戦闘が発生するかフェイズが終わるまで変更されません。\n例 `ＢＧＭ=BossBattle.mid`",
    visible: false,
  },
  WeaponBGM: {
    name: "武器ＢＧＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `武器ＢＧＭ=武器名 MIDIファイル名`\n指定した武器を使う際の戦闘ＢＧＭを指定した MIDI ファイルに変更します。\nこの能力は味方ユニットの場合にのみ有効です。\n例 `武器ＢＧＭ=必殺！虚空斬 VanityBlade.mid`",
    visible: false,
  },
  AbilityBGM: {
    name: "アビリティＢＧＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `アビリティＢＧＭ=アビリティ名 MIDIファイル名`\n指定したアビリティを使う際に指定した MIDI ファイルを演奏します。\nこの能力は味方ユニットの場合にのみ有効です。\n例 `アビリティＢＧＭ=天使の祝福 AngelBless.mid`",
    visible: false,
  },
  CombineBGM: {
    name: "合体ＢＧＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `合体ＢＧＭ=合体後のユニット名称 MIDIファイル名`\n合体の際に指定した MIDI ファイルをＢＧＭとして演奏します。",
    visible: false,
  },
  SeparateBGM: {
    name: "分離ＢＧＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `分離ＢＧＭ=MIDIファイル名`\n分離の際に指定した MIDI ファイルをＢＧＭとして演奏します。",
    visible: false,
  },
  TransformBGM: {
    name: "変形ＢＧＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `変形ＢＧＭ=変形後のユニット名称 MIDIファイル名`\n変形の際に指定した MIDI ファイルをＢＧＭとして演奏します。",
    visible: false,
  },
  HyperModeBGM: {
    name: "ハイパーモードＢＧＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `ハイパーモードＢＧＭ=ハイパーモード後のユニット名称 MIDIファイル名`\nハイパーモード発動の際に指定した MIDI ファイルをＢＧＭとして演奏します。",
    visible: false,
  },
} as const satisfies Record<string, FeatureSpec>;
