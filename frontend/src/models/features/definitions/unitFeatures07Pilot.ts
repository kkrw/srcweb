import { type FeatureSpec, FeatureTarget } from "../types";

// ### パイロット関連特殊能力
export const FEATURES_U_07_PILOT = {
  AddPilot: {
    name: "追加パイロット",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `追加パイロット=パイロット名称`\n特定の形態でのみパイロットを追加したい場合に用います。\n追加できるパイロットは 1 名のみです。\n複数指定はできません。\nパイロットは名称で指定します（愛称は使えません）。\nユニット生成時に追加パイロットも自動的に作成されるため Pilot コマンドや Create コマンドで作成する必要はありません。\n「追加パイロットはメインパイロット」として扱われ、戦闘メッセージはそのユニットに追加パイロットのみが乗っているものとして選択されます。\n同じ追加パイロットを持つユニットはマップ上に複数存在することはできません。\nただし、ザコまたは汎用の指定がされているパイロットの場合は例外です。\nまた、追加パイロットだけが乗っているユニットを出撃させることはできません(召喚アビリティで召喚する場合は例外)。\n追加パイロットがスペシャルパワーを持っている場合、メインパイロットのスペシャルパワーの代わりに追加パイロットのスペシャルパワーが使われます。\nこのとき、追加パイロットのＳＰはメインパイロットと共有されます。\n追加パイロットがスペシャルパワーを持たない場合は元のメインパイロットのスペシャルパワーがそのまま使われます。\nただしこの場合追加パイロットがザコまたは汎用パイロットであり同じパイロットが複数存在し、なおかつ追加パイロットが召喚ユニットに乗っていない場合は正しい動作が行われません。\nザコまたは汎用の追加パイロットを召喚ユニット以外に乗せて使用する場合は必ず元のメインパイロットにスペシャルパワーを持たせてください。\n召喚アビリティで召喚するユニットには必ず追加パイロットが必要です。\n例 `追加パイロット=ロイ(スーパーモード)`",
    visible: false,
  },
  BerserkPilot: {
    name: "暴走時パイロット",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `暴走時パイロット=パイロット名称`\n暴走時のみ有効な追加パイロットです。\n暴走時にのみ有効になるという以外は追加パイロットと同等です。",
    visible: false,
  },
  AddSupport: {
    name: "追加サポート",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `追加サポート=パイロット名称`\n特定の形態でのみサポートパイロットを追加したい場合に用います。\n追加できるサポートパイロットは 1 名のみです。\n複数指定はできません。\nサポートパイロットは名称で指定します（愛称は使えません）。\n指定したサポートパイロットはユニット生成時に自動的に作成されるため Pilot コマンドで作成する必要はありません。\n「追加したサポートパイロットは通常のサポートパイロットと同様に扱われます。\n追加したサポートパイロットのレベルは常にメインパイロット」と同じレベルに合わされます。\n同じ追加サポートを持つユニットがマップ上に複数存在しても構いません。\nただし、この場合は追加サポートに「(ザコ)」または「(汎用)」指定を持つパイロットを指定して下さい。",
    visible: false,
  },
  PilotNickname: {
    name: "パイロット愛称",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `パイロット愛称=愛称`\n「メインパイロット」の愛称を指定したものに変更します。\nもとの愛称を引用したい場合はその部分に `$(愛称)` と指定してください。\n例 `パイロット愛称=帝国軍$(愛称)`",
    visible: false,
  },
  PilotPhonetic: {
    name: "パイロット読み仮名",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `パイロット読み仮名=読み仮名`\n「メインパイロット」の読み仮名を指定したものに変更します。\nもとの読み仮名を引用したい場合はその部分に `$(読み仮名)` と指定してください。\n例 `パイロット読み仮名=ていこくぐん$(読み仮名)`",
    visible: false,
  },
  PilotImage: {
    name: "パイロット画像",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `パイロット画像=画像ファイル名`\nメインパイロットの画像として指定したファイルを使用するようにします。\n例 `パイロット画像=SRC_AliceLilian(Glasses).bmp`",
    visible: false,
  },
  ChangePersonality: {
    name: "性格変更",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `性格変更=性格名`\nメインパイロットの性格を指定したものに変更させます。\n例 `性格変更=超強気`",
    visible: false,
  },
  Gender: {
    name: "性別",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `性別=男性 or 女性`\nメインパイロットの性別を変更するために使用します。\n指定した性別はパイロットデータで指定された性別より優先されます。",
    visible: false,
  },
  MeleeEnhance: {
    name: "格闘強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `格闘強化Lv*[=別名 必要気力]`\n「メインパイロット」の格闘攻撃力が`5×レベル`増加します。\n必要気力を省略した場合はメインパイロットの気力にかかわらず発動します。",
  },
  RangedEnhance: {
    name: "射撃強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `射撃強化Lv*[=別名 必要気力]`\nメインパイロットの射撃攻撃力が`5×レベル`増加します。\n必要気力を省略した場合はメインパイロットの気力にかかわらず発動します。",
  },
  HitEnhance: {
    name: "命中強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `命中強化Lv*[=別名 必要気力]`\nメインパイロットの命中が`5×レベル`増加します。\n必要気力を省略した場合はメインパイロットの気力にかかわらず発動します。",
  },
  EvasionEnhance: {
    name: "回避強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `回避強化Lv*[=別名 必要気力]`\nメインパイロットの回避が`5×レベル`増加します。\n必要気力を省略した場合はメインパイロットの気力にかかわらず発動します。",
  },
  SkillEnhance: {
    name: "技量強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `技量強化Lv*[=別名 必要気力]`\nメインパイロットの技量が`5×レベル`増加します。\n必要気力を省略した場合はメインパイロットの気力にかかわらず発動します。",
  },
  ReactionEnhance: {
    name: "反応強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `反応強化Lv*[=別名 必要気力]`\nメインパイロットの反応が`5×レベル`増加します。\n必要気力を省略した場合はメインパイロットの気力にかかわらず発動します。",
  },
  PilotTerrainAdaptation: {
    name: "パイロット地形適応変更",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `パイロット地形適応変更=空適応修正値 陸適応修正値 水中適応修正値 宇宙適応修正値`\nパイロットの地形適応を変更します。\n４種の地形適応それぞれについて、適応の修正段階数を数値で指定して下さい。\n下の例の場合、水中適応が２段階上がり、空適応と陸適応がそれぞれ１段階ずつ下がります。\nなお、本能力では地形適応は A までしか上がりません。\n例 `パイロット地形適応変更=-1 -1 2 0`",
    visible: false,
  },
  AddPilotAbility: {
    name: "パイロット能力付加",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      '書式 `パイロット能力付加=特殊能力`\nメインパイロットに指定した特殊能力を付加します。\n特殊能力はパイロットデータの特殊能力指定と同様に指定します。\nパイロット用特殊能力「追加レベル」「能力値ＵＰ」「能力値ＤＯＷＮ」を付加する特殊能力に指定することはできません。\nこのような場合はパイロット能力付加の代わりに上の「能力値強化」の能力を使ってください。\n同種の能力を複数付加させる事は出来ません。\nこのため、スペシャルパワー自動発動等の本来は同種の能力を複数保持可能な特殊能力も一つだけしか付加することが出来ないので注意して下さい。\n例 `パイロット能力付加="術Lv3=召喚魔法"`',
    visible: false,
  },
  EnhancePilotAbility: {
    name: "パイロット能力強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `パイロット能力強化=特殊能力`\nメインパイロットの持つ特殊能力のレベルを指定しただけ増加させます。\n特殊能力はパイロットデータの特殊能力指定と同様にして行います。\nただし特殊能力に「追加レベル」「能力値ＵＰ」「能力値ＤＯＷＮ」を指定することはできません。\n例 `パイロット能力強化=切り払いLv3`",
    visible: false,
  },
} as const satisfies Record<string, FeatureSpec>;
