import type { Float, Integer } from "../BrandedTypes";
import { type FeatureSpec, FeatureTarget, ZOCType } from "./types";

export const FEATURES = {
  None: {
    target: FeatureTarget.None,
    name: "",
    effects: [],
    description: "<null>",
  },
  // # ========== パイロット用特殊能力 =========
  DummyForPilot: {
    target: FeatureTarget.Pilot,
    name: "",
    effects: [],
    description: "<null>",
  },
  // ### 防御・回避に関する特殊能力
  EnableParry: {
    name: "切り払い",
    target: FeatureTarget.Pilot,
    effects: [{ type: "EnableParrying", evasionRate: (1 / 16) as Float }],
    description:
      "ユニットが持つ武器または格闘武器を使って Lv/16 の確率で敵の攻撃を無効化します。",
  },
  EnableShield: {
    name: "Ｓ防御",
    target: FeatureTarget.Pilot,
    effects: [{ type: "EnableReduceDamage", successRate: (1 / 16) as Float }],
    description:
      "ユニットが持つシールドを使って Lv/16 の確率でダメージを軽減します。",
  },
  // 迎撃
  // 分身
  // 耐久
  // ### 攻撃に関する特殊能力
  // 潜在力開放
  // 得意技
  // 不得手
  // ハンター
  // カウンター
  // 先読み
  // 先手必勝
  // 再攻撃
  // ### 特異資質に関する特殊能力
  // 超感覚
  // 知覚強化
  // 念力
  // オーラ
  // 超能力
  // 超反応
  // サイボーグ
  // 悟り
  // 霊力
  // 霊力成長
  // 同調率
  // 同調率成長
  // ### 瀕死時に発動する特殊能力
  Potential: {
    name: "底力",
    target: FeatureTarget.Pilot,
    effects: [
      {
        type: "Potentiality",
        hpThreshold: 0.25 as Float,
        hitBonus: 30 as Integer,
        evasionBonus: 30 as Integer,
        criticalRateBonus: 30 as Integer,
      },
    ],
    description:
      "ユニットの HP が 1/4 以下のとき、命中・回避率・クリティカル率が 30% 上昇します。",
  },
  // 超底力
  // 覚悟
  // 不屈
  // 起死回生
  // ### 援護行動に関する特殊能力
  // 援護攻撃
  // 援護防御
  // 援護
  // 統率
  // ### サポート系特殊能力
  // サポート
  // 格闘サポート
  // 射撃サポート
  // 魔力サポート
  // 命中サポート
  // 回避サポート
  // 技量サポート
  // 反応サポート
  // 指揮
  // 階級
  // 広域サポート
  // ### パイロット成長に関する特殊能力
  // 素質
  // 遅成長
  // ＳＰ高成長
  // ＳＰ低成長
  // 追加レベル
  // 格闘ＵＰ
  // 射撃ＵＰ
  // 命中ＵＰ
  // 回避ＵＰ
  // 技量ＵＰ
  // 反応ＵＰ
  // ＳＰＵＰ
  // 格闘ＤＯＷＮ
  // 射撃ＤＯＷＮ
  // 命中ＤＯＷＮ
  // 回避ＤＯＷＮ
  // 技量ＤＯＷＮ
  // 反応ＤＯＷＮ
  // ＳＰＤＯＷＮ
  // ### スペシャルパワーに関する特殊能力
  // 集中力
  // ＳＰ回復
  // 精神統一
  // ＳＰ消費減少
  // スペシャルパワー自動発動
  // ### 気力に関する特殊能力
  // 闘争本能
  // 損傷時気力増加
  // 命中時気力増加
  // 失敗時気力増加
  // 回避時気力増加
  // 気力上限
  // 気力下限
  // ### その他の特殊能力
  // 資金獲得
  // 術
  // 技
  // 魔力所有
  // 英雄
  // 再生
  // ２回行動
  // 戦術
  // メッセージ
  // 修理
  // 補給
  // チーム
  // # ========== ユニット用特殊能力 ==========
  DummyForUnit: {
    target: FeatureTarget.Unit,
    name: "",
    effects: [],
    description: "<null>",
  },
  // ### 防御特性に関する特殊能力
  // 吸収
  // 無効化
  // 耐性
  // 弱点
  // 有効
  // 特殊効果無効化
  // ### 防御系特殊能力
  Shield: {
    name: "シールド",
    target: FeatureTarget.Unit,
    effects: [{ type: "ReduceDamage", damageReductionRate: 0.5 as Float }],
    description: "受けるダメージを 50% 軽減します。",
  },
  EnergyShield: {
    name: "エネルギーシールド",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "ReduceDamage",
        damageReductionRate: 0.5 as Float,
        damageReduction: 100 as Integer,
        enCost: 10 as Integer,
      },
    ],
    description:
      "EN を 10 消費して受けるダメージを 50% 軽減した上で更に Lv * 100 軽減します。",
  },
  SmallShield: {
    name: "小型シールド",
    target: FeatureTarget.Unit,
    effects: [{ type: "ReduceDamage", damageReductionRate: (1 / 3) as Float }],
    description: "受けるダメージを 1/3 軽減します。",
  },
  LargeShield: {
    name: "大型シールド",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "ReduceDamage",
        damageReductionRate: 0.5 as Float,
        successRateBonus: (1 / 16) as Float,
      },
    ],
    description:
      "受けるダメージを 50% 軽減します。シールド防御成功率に 1/16% のボーナスを得ます。",
  },
  // アクティブシールド
  // 盾
  Barrier: {
    name: "バリア",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "BlockDamage",
        damageCapacity: 1000 as Integer,
        enCost: 10 as Integer,
      },
    ],
    description: "EN を 10 消費して Lv * 1000 以下のダメージを無効化します。",
  },
  // バリアシールド
  // 広域バリア
  // フィールド
  // アクティブフィールド
  // 広域フィールド
  // プロテクション
  // アクティブプロテクション
  // 広域プロテクション
  // レジスト
  // アーマー
  // 反射
  // 当て身技
  // 阻止
  // 広域阻止
  // 融合
  // ビーム吸収
  // 変換
  // 自動反撃
  // ### 回避系特殊能力
  // 分身
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
  // 緊急テレポート
  // ダミー
  // 攻撃回避
  // ＥＣＭ
  // 抵抗力
  // 格闘武器
  // 迎撃武器
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
  // ### 回復系特殊能力
  // 修理装置
  // 補給装置
  // 母艦
  // 格納不可
  AutoRepair: {
    name: "ＨＰ回復",
    target: FeatureTarget.Unit,
    effects: [{ type: "AutoRepair", repairRate: 0.1 as Float }],
    description: "毎ターン、HP を (Lv * 10)% 回復します。",
  },
  AutoEnSupply: {
    name: "ＥＮ回復",
    target: FeatureTarget.Unit,
    effects: [{ type: "AutoEnSupply", supplyRate: 0.1 as Float }],
    description: "毎ターン、EN を (Lv * 10)% 回復します。",
  },
  // 霊力回復
  // ＨＰ消費
  // ＥＮ消費
  // 霊力消費
  // ### コンバータ系特殊能力
  // 霊力変換器
  SpiritConverter: {
    name: "霊力変換器",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "ForceConverter",
        conversionSpec: [
          {
            target: "hp",
            sourceFeatureName: "霊力",
            unit: 1 as Float,
            rate: 10 as Float,
          },
          {
            target: "en",
            sourceFeatureName: "霊力",
            unit: 1 as Float,
            rate: 0.5 as Float,
          },
          {
            target: "armor",
            sourceFeatureName: "霊力",
            unit: 1 as Float,
            rate: 50 as Float,
          },
          {
            target: "mobility",
            sourceFeatureName: "霊力",
            unit: 1 as Float,
            rate: 2 as Float,
          },
        ],
      },
    ],
    description:
      "霊力 Lv に応じてユニットの最大ＨＰ、最大ＥＮ、装甲、運動性が上昇します。",
  },
  // オーラ変換器
  // サイキックドライブ
  // シンクロドライブ
  // ブースト
  // ### 移動系特殊能力
  // テレポート
  // ジャンプ
  // 透過移動
  // すり抜け移動
  // 水上移動
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
  // 水泳
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
  // 移動制限
  // 進入不可
  // ＺＯＣ
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
  // ＺＯＣ無効化
  // 広域ＺＯＣ無効化
  // 隣接ユニットＺＯＣ無効化
  // ### 変形系特殊能力
  // 変形
  // 換装
  // パーツ分離
  // パーツ合体
  // ハイパーモード
  // ノーマルモード
  // 合体
  // 分離
  // 合体制限
  // 主形態
  // 他形態
  // 制限時間
  // ### パイロット関連特殊能力
  // 追加パイロット
  // 暴走時パイロット
  // 追加サポート
  // パイロット愛称
  // パイロット読み仮名
  // パイロット画像
  // 性格変更
  // 性別
  // 格闘強化
  // 射撃強化
  // 命中強化
  // 回避強化
  // 技量強化
  // 反応強化
  // パイロット地形適応変更
  // パイロット能力付加
  // パイロット能力強化
  // ### 武器関連特殊能力
  // 合体技
  // 変形技
  // 追加攻撃
  // 武器強化
  // 射程延長
  // 命中率強化
  // ＣＴ率強化
  // 特殊効果発動率強化
  // 攻撃属性
  // ### アイテム関連特殊能力
  // 装備個所
  // 武器クラス
  // 防具クラス
  // ハードポイント
  // 両手利き
  // ### ＢＧＭ関連特殊能力
  // ＢＧＭ
  // 武器ＢＧＭ
  // アビリティＢＧＭ
  // 合体ＢＧＭ
  // 分離ＢＧＭ
  // 変形ＢＧＭ
  // ハイパーモードＢＧＭ
  // ### ユニット改造関連特殊能力
  // 最大改造数
  // 改造費修正
  // ランクアップ
  // ### ユニット強化関連特殊能力
  // ＨＰ強化
  // ＥＮ強化
  // 装甲強化
  // 運動性強化
  // 移動力強化
  // ＨＰ割合強化
  // ＥＮ割合強化
  // 装甲割合強化
  // 運動性割合強化
  // ### その他の特殊能力
  // 制御不可
  // 不安定
  // 召喚ユニット
  // 召喚解除コマンド名
  // 変身解除コマンド名
  // 部隊ユニット
  // 支配
  // 防御不可
  // 回避不可
  // １人乗り可能
  // アイテム所有
  // レアアイテム所有
  // ラーニング可能技
  // 地形ユニット
  // 非表示
  // 必要技能
  // 不必要技能
  // 戦闘アニメ
  // 特殊効果
  // メッセージクラス
  // 用語名
} as const satisfies Record<string, FeatureSpec>;
