import type { Float, Integer } from "../../BrandedTypes";
import { type FeatureSpec, FeatureTarget } from "./../types";

// ### 回避系特殊能力
export const FEATURES_U_02_EVASION = {
  SelfDuplication: {
    name: "分身",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "ExtraEvasion",
        successRate: 0.1 as Float,
        requiredMorale: 130 as Integer,
        isPassive: false,
      },
    ],
    defaultLevel: 5 as Float,
    description: "戦意 130 以上のとき、50% の確率で敵の攻撃を無効化します。",
  },
  ExtraEvasion: {
    name: "超回避",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "ExtraEvasion",
        successRate: 0.1 as Float,
        isPassive: false,
      },
    ],
    description: "(Lv / 16) の確率で敵の攻撃を無効化します。",
  },
  EmergencyTeleport: {
    name: "緊急テレポート",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `緊急テレポートLv*=別名 転移距離 [ＥＮ消費量 必要気力 オプション]`\n攻撃を受けた際に 10× レベル%の確率でテレポートし、攻撃を回避します。\nテレポート先は指定した転移距離内のエリアのうち、敵から最も離れている場所から選ばれます。\n発動時には「緊急テレポート」のメッセージが表示されます。\nＥＮ消費量、必要気力を指定することができます。\n両者を省略した場合はＥＮ消費量が 0、必要気力が 100 とみなされます。\nオプションには「手動」を指定することができます。\nこのオプションが指定された場合、緊急テレポートは反撃手段に回避を選んだ時にのみ発動します。\n緊急テレポートとテレポートとは別能力です。\nテレポート能力を持っていないユニットにも緊急テレポートを持たせることが可能です。\n分身能力はユニットが行動不能になっている際は使用することができません。\n例 `緊急テレポートLv2=ディメンションシフト 3 10 100 手動`",
  },
  Dummy: {
    name: "ダミー",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `ダミーLv*[=別名]`\nダミーを身代わりにして自分に命中した攻撃をレベル分の回数だけ無効化します。\n発動時には「ダミー」のメッセージが表示されます。\n例 `ダミーLv3=ダミーバルーン`",
  },
  EvasionAttack: {
    name: "攻撃回避",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `攻撃回避Lv*=別名 対象属性 [必要気力]`\n指定した属性に該当する攻撃の命中率を本来の`100－10×レベル%`に減少させます。\n対象属性の先頭に「!」を付けておくと、その属性を持たない攻撃に対してのみ攻撃回避が有効になります。\n必要気力は省略することができます。\n必要気力を省略した場合は、気力にかかわらず使用可能になります。\n攻撃回避は複数指定可能であり、同一属性への重複も可能です。\n攻撃回避は他の回避系特殊能力と異なり常時発動が前提となるため、発動時にメッセージが表示されることがありません。\n例 `攻撃回避Lv5=ブリンク 全 110`",
  },
  ECM: {
    name: "ＥＣＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `ＥＣＭLv*[=別名]`\n半径３マス以内にいる味方ユニットに対する攻撃の命中率を元の `(100 - 5×レベル)%` に減少させます。\nただし攻撃を受けるユニットの 3 マス以内にＥＣＭ能力を持つ敵ユニットがいる場合は敵側のＥＣＭ能力レベル分だけ効果が減少します。\n特殊な誘導機能を持つ攻撃(サ、誘、有)や至近距離からの攻撃(武、突、接)に対しては無効です。",
  },
  DebuffResistance: {
    name: "抵抗力",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `抵抗力Lv*[=別名]`\n相手の攻撃の特殊効果発生確率を`10×レベル%`減少させます。",
  },
  MeleeWeapon: {
    name: "格闘武器",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `格闘武器=武器名`\n切り払いが可能になります。\n切り払いで使う武器の名前を指定してください。\n指定した武器がユニットデータ上に存在しなくてもかまいません。\n指定しなかった場合は威力の最も低い格闘武器(武属性を持つ武器)が切り払いに使用されます。\n(従って特別な場合以外は指定する必要はありません)\n例 `格闘武器=拳`",
    visible: false,
  },
  InterceptWeapon: {
    name: "迎撃武器",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `迎撃武器=武器名`\n迎撃が可能になります。\n迎撃で使う武器の名前を指定してください。\nただし、この能力を指定しなかった場合でも以下の条件を満たす武器があればその武器が迎撃に使用されます。\n\n- 移動後に使用可能\n- 射撃武器\n- 最大弾数が 10 以上または最大弾数が 0 で消費ＥＮが 5 以下\n  従って通常は迎撃武器を設定する必要はありません。\n  例 `迎撃武器=対空機銃`",
    visible: false,
  },
  Stealth: {
    name: "ステルス",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "Stealth",
        rangeRate: 1 as Integer,
        ignoreMapAttack: false,
        disabledOnAttack: true,
        disabledTurns: 1 as Integer,
        getEvasionBonus: true,
        evasionBonusRate: 20 as Float,
        getHitBonus: true,
        hitBonus: 20 as Integer,
      },
    ],
    description:
      "敵の攻撃を無効化するステルス状態になります。攻撃をするとステルス状態が解除されます。",
    defaultLevel: 3 as Float,
  },
  AntiStealth: {
    name: "ステルス無効化",
    target: FeatureTarget.Unit,
    effects: [{ type: "AntiStealth" }],
    description: "このユニットに対してはステルスの全ての効果が無効化されます。",
  },
} as const satisfies Record<string, FeatureSpec>;
