import { type FeatureSpec, FeatureTarget } from "../types";

// ### ユニット改造関連特殊能力
export const FEATURES_U_11_RANK_UP = {
  MaxUpgrade: {
    name: "最大改造数",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `最大改造数Lv*`\nインターミッションでユニットの改造を行う際の最大改造数をレベルを使って指定します。\nただし、シナリオ側で「Option コマンド」により最大改造数が規定されている場合はそちらが優先されるので注意して下さい。\n例えばユニットが「最大改造数 Lv13」の能力を持っていてもシナリオ側で「１５段階改造」のオプションが設定されていない限り 10 段階を超える改造は出来ません。",
    visible: false,
  },
  UpgradeCostModifier: {
    name: "改造費修正",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `改造費修正Lv*`\nインターミッションでユニットの改造を行う際の改造費を以下のように変更します。\n修正後の改造費 ＝ `元の改造費×(100 ＋ 10×レベル)／100`\nつまりレベルごとに改造費が 10%増加します。\n改造費を減らしたい場合はマイナスのレベルを指定して下さい。",
    visible: false,
  },
  RankUp: {
    name: "ランクアップ",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `ランクアップLv*=ランクアップ後の形態名`\nユニットランク.2.N_T が指定されたレベル以上になるとランクアップが行われます。\nランクアップ先のデータにさらにランクアップ能力を持たせることで数段階のランクアップを行うことも可能です。\n例 `ランクアップLv5=アレクサンダー(ランクアップ)`\nランクアップ先のユニットデータに変形やハイパーモードを持たせるときは、データ内で変形先をランクアップ前の名称で指定してください。",
    visible: false,
  },
} as const satisfies Record<string, FeatureSpec>;
