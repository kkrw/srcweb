import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parsePilotFile } from "../../parsers/pilotParser";

describe("Pilot Parser", () => {
  const samplePilotText = readFileSync(
    join(__dirname, "fixtures", "sample_pilot.txt"),
    "utf-8"
  );

  // ==========================================================================
  // 特殊能力パターン (パターン19-25)
  // ==========================================================================
  describe("特殊能力パターン", () => {
    it("パターン19: レベル進行特殊能力", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[18];
      expect(pilot.name).toBe("テスト＝レベル進行パイロット");
      // 切り払いLv1-7
      expect(pilot.features).toHaveLength(14);
      expect(pilot.features[0].feature.name).toBe("切り払い");
      expect(pilot.features[0].feature.level).toBe(1);
      expect(pilot.features[0].requiredLevel).toBe(1);
      expect(pilot.features[1].feature.name).toBe("切り払い");
      expect(pilot.features[1].feature.level).toBe(2);
      expect(pilot.features[1].requiredLevel).toBe(18);
      expect(pilot.features[6].feature.name).toBe("切り払い");
      expect(pilot.features[6].feature.level).toBe(7);
      expect(pilot.features[6].requiredLevel).toBe(80);
      // 迎撃Lv1-4
      expect(pilot.features[7].feature.name).toBe("迎撃");
      expect(pilot.features[7].feature.level).toBe(1);
      expect(pilot.features[10].feature.name).toBe("迎撃");
      expect(pilot.features[10].feature.level).toBe(4);
      expect(pilot.features[10].requiredLevel).toBe(60);
      // 底力Lv1-3
      expect(pilot.features[11].feature.name).toBe("底力");
      expect(pilot.features[11].feature.level).toBe(1);
      expect(pilot.features[13].feature.name).toBe("底力");
      expect(pilot.features[13].feature.level).toBe(3);
      expect(pilot.features[13].requiredLevel).toBe(50);
    });

    it("パターン20: 特殊能力の別名指定", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[19];
      expect(pilot.name).toBe("テスト＝別名パイロット");
      expect(pilot.features).toHaveLength(5);
      // オーラLv1=法力
      expect(pilot.features[0].feature.name).toBe("オーラ");
      expect(pilot.features[0].feature.level).toBe(1);
      expect(pilot.features[0].feature.displayName).toBe("法力");
      expect(pilot.features[0].requiredLevel).toBe(1);
      // Lv2, Lv3（別名継承）
      expect(pilot.features[1].feature.name).toBe("オーラ");
      expect(pilot.features[1].feature.level).toBe(2);
      expect(pilot.features[1].requiredLevel).toBe(22);
      expect(pilot.features[2].feature.name).toBe("オーラ");
      expect(pilot.features[2].feature.level).toBe(3);
      expect(pilot.features[2].requiredLevel).toBe(38);
      // 念力Lv2=サイコパワー
      expect(pilot.features[3].feature.name).toBe("念力");
      expect(pilot.features[3].feature.level).toBe(2);
      expect(pilot.features[3].feature.displayName).toBe("サイコパワー");
      // 霊力Lv50（別名なし）
      expect(pilot.features[4].feature.name).toBe("霊力");
      expect(pilot.features[4].feature.level).toBe(50);
      expect(pilot.features[4].feature.displayName).toBeUndefined();
    });

    it("パターン21: 特殊能力の別名が途中で変わるパターン", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[20];
      expect(pilot.name).toBe("テスト＝別名変更パイロット");
      expect(pilot.features).toHaveLength(7);
      // 切り払いLv1=剣術初段
      expect(pilot.features[0].feature.name).toBe("切り払い");
      expect(pilot.features[0].feature.level).toBe(1);
      expect(pilot.features[0].feature.displayName).toBe("剣術初段");
      expect(pilot.features[0].requiredLevel).toBe(1);
      // Lv2（別名なし）
      expect(pilot.features[1].feature.name).toBe("切り払い");
      expect(pilot.features[1].feature.level).toBe(2);
      expect(pilot.features[1].requiredLevel).toBe(15);
      // 切り払いLv3=剣術師範
      expect(pilot.features[2].feature.name).toBe("切り払い");
      expect(pilot.features[2].feature.level).toBe(3);
      expect(pilot.features[2].feature.displayName).toBe("剣術師範");
      expect(pilot.features[2].requiredLevel).toBe(30);
      // Lv4
      expect(pilot.features[3].feature.name).toBe("切り払い");
      expect(pilot.features[3].feature.level).toBe(4);
      expect(pilot.features[3].requiredLevel).toBe(45);
      // 切り払いLv5=剣聖
      expect(pilot.features[4].feature.name).toBe("切り払い");
      expect(pilot.features[4].feature.level).toBe(5);
      expect(pilot.features[4].feature.displayName).toBe("剣聖");
      expect(pilot.features[4].requiredLevel).toBe(60);
      // 底力Lv1=根性
      expect(pilot.features[5].feature.name).toBe("底力");
      expect(pilot.features[5].feature.level).toBe(1);
      expect(pilot.features[5].feature.displayName).toBe("根性");
      expect(pilot.features[5].requiredLevel).toBe(1);
      // 底力Lv5=不屈の精神
      expect(pilot.features[6].feature.name).toBe("底力");
      expect(pilot.features[6].feature.level).toBe(5);
      expect(pilot.features[6].feature.displayName).toBe("不屈の精神");
      expect(pilot.features[6].requiredLevel).toBe(40);
    });

    it("パターン22: レベル非表示別名（半角括弧）", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[21];
      expect(pilot.name).toBe("テスト＝レベル非表示パイロット");
      expect(pilot.features).toHaveLength(2);
      // 広域サポートLv2=(カリスマ) - レベル非表示
      expect(pilot.features[0].feature.name).toBe("広域サポート");
      expect(pilot.features[0].feature.level).toBe(2);
      expect(pilot.features[0].feature.displayName).toBe("(カリスマ)");
      // 指揮Lv3=(将軍)
      expect(pilot.features[1].feature.name).toBe("指揮");
      expect(pilot.features[1].feature.level).toBe(3);
      expect(pilot.features[1].feature.displayName).toBe("(将軍)");
    });

    it("パターン23: 非表示特殊能力", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[22];
      expect(pilot.name).toBe("テスト＝非表示能力パイロット");
      expect(pilot.features).toHaveLength(2);
      // 術Lv0=非表示
      expect(pilot.features[0].feature.name).toBe("術");
      expect(pilot.features[0].feature.level).toBe(0);
      expect(pilot.features[0].feature.visible).toBe(false);
      // 霊力Lv30
      expect(pilot.features[1].feature.name).toBe("霊力");
      expect(pilot.features[1].feature.level).toBe(30);
      expect(pilot.features[1].feature.visible).toBe(true);
    });

    it("パターン24: 解説変更特殊能力", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[23];
      expect(pilot.name).toBe("テスト＝解説変更パイロット");
      expect(pilot.features).toHaveLength(1);
      // 資金獲得Lv5=こそ泥、解説が設定される
      expect(pilot.features[0].feature.name).toBe("資金獲得");
      expect(pilot.features[0].feature.level).toBe(5);
      expect(pilot.features[0].feature.displayName).toBe("こそ泥");
      expect(pilot.features[0].feature.description).toBe(
        "手練の技で金目の物を根こそぎ奪い取り獲得資金が50%アップ"
      );
    });

    it("パターン25: ダミー特殊能力", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[24];
      expect(pilot.name).toBe("テスト＝ダミー能力パイロット");
      expect(pilot.features).toHaveLength(5);
      // 忍術Lv1-3（ダミー能力）
      expect(pilot.features[0].feature.name).toBe("忍術");
      expect(pilot.features[0].feature.level).toBe(1);
      expect(pilot.features[1].feature.name).toBe("忍術");
      expect(pilot.features[1].feature.level).toBe(2);
      expect(pilot.features[1].requiredLevel).toBe(23);
      expect(pilot.features[2].feature.name).toBe("忍術");
      expect(pilot.features[2].feature.level).toBe(3);
      expect(pilot.features[2].requiredLevel).toBe(45);
      // 魔法使いLv2
      expect(pilot.features[3].feature.name).toBe("魔法使い");
      expect(pilot.features[3].feature.level).toBe(2);
      // カスタム能力（レベルなし）
      expect(pilot.features[4].feature.name).toBe("カスタム能力");
      expect(pilot.features[4].feature.level).toBeUndefined();
    });
  });

  // ==========================================================================
  // 防御・回避系特殊能力 (パターン26)
  // ==========================================================================
  describe("防御・回避系特殊能力", () => {
    it("パターン26: 防御・回避系特殊能力", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[25];
      expect(pilot.name).toBe("テスト＝防御回避パイロット");
      expect(pilot.features).toHaveLength(11);
      // Ｓ防御Lv1-3
      expect(pilot.features[0].feature.name).toBe("Ｓ防御");
      expect(pilot.features[0].feature.level).toBe(1);
      expect(pilot.features[2].feature.name).toBe("Ｓ防御");
      expect(pilot.features[2].feature.level).toBe(3);
      expect(pilot.features[2].requiredLevel).toBe(40);
      // 切り払いLv2-4
      expect(pilot.features[3].feature.name).toBe("切り払い");
      expect(pilot.features[3].feature.level).toBe(2);
      expect(pilot.features[5].feature.name).toBe("切り払い");
      expect(pilot.features[5].feature.level).toBe(4);
      expect(pilot.features[5].requiredLevel).toBe(50);
      // 迎撃Lv1-2
      expect(pilot.features[6].feature.name).toBe("迎撃");
      expect(pilot.features[6].feature.level).toBe(1);
      expect(pilot.features[7].feature.name).toBe("迎撃");
      expect(pilot.features[7].feature.level).toBe(2);
      expect(pilot.features[7].requiredLevel).toBe(30);
      // 分身Lv1-2
      expect(pilot.features[8].feature.name).toBe("分身");
      expect(pilot.features[8].feature.level).toBe(1);
      expect(pilot.features[9].feature.name).toBe("分身");
      expect(pilot.features[9].feature.level).toBe(2);
      expect(pilot.features[9].requiredLevel).toBe(35);
      // 耐久Lv2
      expect(pilot.features[10].feature.name).toBe("耐久");
      expect(pilot.features[10].feature.level).toBe(2);
    });
  });

  // ==========================================================================
  // 攻撃系特殊能力 (パターン27)
  // ==========================================================================
  describe("攻撃系特殊能力", () => {
    it("パターン27: 攻撃系特殊能力", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[26];
      expect(pilot.name).toBe("テスト＝攻撃パイロット");
      expect(pilot.features).toHaveLength(8);
      // 潜在力開放Lv2
      expect(pilot.features[0].feature.name).toBe("潜在力開放");
      expect(pilot.features[0].feature.level).toBe(2);
      // 得意技Lv1=剣の達人
      expect(pilot.features[1].feature.name).toBe("得意技");
      expect(pilot.features[1].feature.level).toBe(1);
      expect(pilot.features[1].feature.displayName).toBe("剣の達人");
      // ハンターLv1=対獣
      expect(pilot.features[2].feature.name).toBe("ハンター");
      expect(pilot.features[2].feature.level).toBe(1);
      expect(pilot.features[2].feature.displayName).toBe("対獣");
      // カウンターLv1-2
      expect(pilot.features[3].feature.name).toBe("カウンター");
      expect(pilot.features[3].feature.level).toBe(1);
      expect(pilot.features[4].feature.name).toBe("カウンター");
      expect(pilot.features[4].feature.level).toBe(2);
      expect(pilot.features[4].requiredLevel).toBe(30);
      // 先読みLv1
      expect(pilot.features[5].feature.name).toBe("先読み");
      expect(pilot.features[5].feature.level).toBe(1);
      // 先手必勝（レベルなし）
      expect(pilot.features[6].feature.name).toBe("先手必勝");
      expect(pilot.features[6].feature.level).toBeUndefined();
      // 再攻撃Lv1
      expect(pilot.features[7].feature.name).toBe("再攻撃");
      expect(pilot.features[7].feature.level).toBe(1);
    });
  });

  // ==========================================================================
  // 特異資質系特殊能力 (パターン28-29)
  // ==========================================================================
  describe("特異資質系特殊能力", () => {
    it("パターン28: 特異資質系特殊能力", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[27];
      expect(pilot.name).toBe("テスト＝特異資質パイロット");
      expect(pilot.features).toHaveLength(9);
      // 超感覚Lv1-2
      expect(pilot.features[0].feature.name).toBe("超感覚");
      expect(pilot.features[0].feature.level).toBe(1);
      expect(pilot.features[1].feature.name).toBe("超感覚");
      expect(pilot.features[1].feature.level).toBe(2);
      expect(pilot.features[1].requiredLevel).toBe(25);
      // 知覚強化Lv2
      expect(pilot.features[2].feature.name).toBe("知覚強化");
      expect(pilot.features[2].feature.level).toBe(2);
      // 念力Lv3
      expect(pilot.features[3].feature.name).toBe("念力");
      expect(pilot.features[3].feature.level).toBe(3);
      // オーラLv2
      expect(pilot.features[4].feature.name).toBe("オーラ");
      expect(pilot.features[4].feature.level).toBe(2);
      // 超能力Lv1
      expect(pilot.features[5].feature.name).toBe("超能力");
      expect(pilot.features[5].feature.level).toBe(1);
      // 超反応（レベルなし）
      expect(pilot.features[6].feature.name).toBe("超反応");
      expect(pilot.features[6].feature.level).toBeUndefined();
      // サイボーグLv1
      expect(pilot.features[7].feature.name).toBe("サイボーグ");
      expect(pilot.features[7].feature.level).toBe(1);
      // 悟りLv1
      expect(pilot.features[8].feature.name).toBe("悟り");
      expect(pilot.features[8].feature.level).toBe(1);
    });

    it("パターン29: 霊力・同調率系", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[28];
      expect(pilot.name).toBe("テスト＝霊力パイロット");
      expect(pilot.sex).toBe("女性");
      expect(pilot.features).toHaveLength(4);
      // 霊力Lv50
      expect(pilot.features[0].feature.name).toBe("霊力");
      expect(pilot.features[0].feature.level).toBe(50);
      // 霊力成長Lv5
      expect(pilot.features[1].feature.name).toBe("霊力成長");
      expect(pilot.features[1].feature.level).toBe(5);
      // 同調率Lv80
      expect(pilot.features[2].feature.name).toBe("同調率");
      expect(pilot.features[2].feature.level).toBe(80);
      // 同調率成長Lv3
      expect(pilot.features[3].feature.name).toBe("同調率成長");
      expect(pilot.features[3].feature.level).toBe(3);
    });
  });

  // ==========================================================================
  // 瀕死系特殊能力 (パターン30)
  // ==========================================================================
  describe("瀕死系特殊能力", () => {
    it("パターン30: 瀕死系特殊能力", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[29];
      expect(pilot.name).toBe("テスト＝瀕死パイロット");
      expect(pilot.features).toHaveLength(5);
      // 底力Lv9
      expect(pilot.features[0].feature.name).toBe("底力");
      expect(pilot.features[0].feature.level).toBe(9);
      // 超底力
      expect(pilot.features[1].feature.name).toBe("超底力");
      expect(pilot.features[1].feature.level).toBeUndefined();
      // 覚悟
      expect(pilot.features[2].feature.name).toBe("覚悟");
      // 不屈
      expect(pilot.features[3].feature.name).toBe("不屈");
      // 起死回生Lv1
      expect(pilot.features[4].feature.name).toBe("起死回生");
      expect(pilot.features[4].feature.level).toBe(1);
    });
  });

  // ==========================================================================
  // 援護系特殊能力 (パターン31)
  // ==========================================================================
  describe("援護系特殊能力", () => {
    it("パターン31: 援護系特殊能力", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[30];
      expect(pilot.name).toBe("テスト＝援護パイロット");
      expect(pilot.features).toHaveLength(7);
      // 援護攻撃Lv1-3
      expect(pilot.features[0].feature.name).toBe("援護攻撃");
      expect(pilot.features[0].feature.level).toBe(1);
      expect(pilot.features[2].feature.name).toBe("援護攻撃");
      expect(pilot.features[2].feature.level).toBe(3);
      expect(pilot.features[2].requiredLevel).toBe(40);
      // 援護防御Lv1-2
      expect(pilot.features[3].feature.name).toBe("援護防御");
      expect(pilot.features[3].feature.level).toBe(1);
      expect(pilot.features[4].feature.name).toBe("援護防御");
      expect(pilot.features[4].feature.level).toBe(2);
      expect(pilot.features[4].requiredLevel).toBe(25);
      // 援護Lv2
      expect(pilot.features[5].feature.name).toBe("援護");
      expect(pilot.features[5].feature.level).toBe(2);
      // 統率Lv3
      expect(pilot.features[6].feature.name).toBe("統率");
      expect(pilot.features[6].feature.level).toBe(3);
    });
  });

  // ==========================================================================
  // サポート系特殊能力 (パターン32-33)
  // ==========================================================================
  describe("サポート系特殊能力", () => {
    it("パターン32: サポート系特殊能力", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[31];
      expect(pilot.name).toBe("テスト＝サポート系パイロット");
      expect(pilot.features).toHaveLength(8);
      // サポートLv2
      expect(pilot.features[0].feature.name).toBe("サポート");
      expect(pilot.features[0].feature.level).toBe(2);
      // 格闘サポートLv1
      expect(pilot.features[1].feature.name).toBe("格闘サポート");
      expect(pilot.features[1].feature.level).toBe(1);
      // 射撃サポートLv2
      expect(pilot.features[2].feature.name).toBe("射撃サポート");
      expect(pilot.features[2].feature.level).toBe(2);
      // 魔力サポートLv1
      expect(pilot.features[3].feature.name).toBe("魔力サポート");
      expect(pilot.features[3].feature.level).toBe(1);
      // 命中サポートLv1
      expect(pilot.features[4].feature.name).toBe("命中サポート");
      expect(pilot.features[4].feature.level).toBe(1);
      // 回避サポートLv1
      expect(pilot.features[5].feature.name).toBe("回避サポート");
      expect(pilot.features[5].feature.level).toBe(1);
      // 技量サポートLv2
      expect(pilot.features[6].feature.name).toBe("技量サポート");
      expect(pilot.features[6].feature.level).toBe(2);
      // 反応サポートLv1
      expect(pilot.features[7].feature.name).toBe("反応サポート");
      expect(pilot.features[7].feature.level).toBe(1);
    });

    it("パターン33: 指揮・階級・広域サポート", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[32];
      expect(pilot.name).toBe("テスト＝指揮官パイロット");
      expect(pilot.features).toHaveLength(3);
      // 指揮Lv3
      expect(pilot.features[0].feature.name).toBe("指揮");
      expect(pilot.features[0].feature.level).toBe(3);
      // 階級=将校
      expect(pilot.features[1].feature.name).toBe("階級");
      expect(pilot.features[1].feature.displayName).toBe("将校");
      // 広域サポートLv2
      expect(pilot.features[2].feature.name).toBe("広域サポート");
      expect(pilot.features[2].feature.level).toBe(2);
    });
  });

  // ==========================================================================
  // 成長系特殊能力 (パターン34-36)
  // ==========================================================================
  describe("成長系特殊能力", () => {
    it("パターン34: 能力UP系", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[33];
      expect(pilot.name).toBe("テスト＝能力UPパイロット");
      expect(pilot.features).toHaveLength(8);
      // 素質
      expect(pilot.features[0].feature.name).toBe("素質");
      // 格闘ＵＰLv10
      expect(pilot.features[1].feature.name).toBe("格闘ＵＰ");
      expect(pilot.features[1].feature.level).toBe(10);
      // 射撃ＵＰLv5
      expect(pilot.features[2].feature.name).toBe("射撃ＵＰ");
      expect(pilot.features[2].feature.level).toBe(5);
      // 命中ＵＰLv8
      expect(pilot.features[3].feature.name).toBe("命中ＵＰ");
      expect(pilot.features[3].feature.level).toBe(8);
      // 回避ＵＰLv5
      expect(pilot.features[4].feature.name).toBe("回避ＵＰ");
      expect(pilot.features[4].feature.level).toBe(5);
      // 技量ＵＰLv3
      expect(pilot.features[5].feature.name).toBe("技量ＵＰ");
      expect(pilot.features[5].feature.level).toBe(3);
      // 反応ＵＰLv5
      expect(pilot.features[6].feature.name).toBe("反応ＵＰ");
      expect(pilot.features[6].feature.level).toBe(5);
      // ＳＰＵＰLv10
      expect(pilot.features[7].feature.name).toBe("ＳＰＵＰ");
      expect(pilot.features[7].feature.level).toBe(10);
    });

    it("パターン35: 能力DOWN系・遅成長", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[34];
      expect(pilot.name).toBe("テスト＝能力DOWNパイロット");
      expect(pilot.features).toHaveLength(9);
      // 遅成長
      expect(pilot.features[0].feature.name).toBe("遅成長");
      // ＳＰ高成長
      expect(pilot.features[1].feature.name).toBe("ＳＰ高成長");
      // 格闘ＤＯＷＮLv5
      expect(pilot.features[2].feature.name).toBe("格闘ＤＯＷＮ");
      expect(pilot.features[2].feature.level).toBe(5);
      // 射撃ＤＯＷＮLv3
      expect(pilot.features[3].feature.name).toBe("射撃ＤＯＷＮ");
      expect(pilot.features[3].feature.level).toBe(3);
      // 命中ＤＯＷＮLv2
      expect(pilot.features[4].feature.name).toBe("命中ＤＯＷＮ");
      expect(pilot.features[4].feature.level).toBe(2);
      // 回避ＤＯＷＮLv2
      expect(pilot.features[5].feature.name).toBe("回避ＤＯＷＮ");
      expect(pilot.features[5].feature.level).toBe(2);
      // 技量ＤＯＷＮLv1
      expect(pilot.features[6].feature.name).toBe("技量ＤＯＷＮ");
      expect(pilot.features[6].feature.level).toBe(1);
      // 反応ＤＯＷＮLv1
      expect(pilot.features[7].feature.name).toBe("反応ＤＯＷＮ");
      expect(pilot.features[7].feature.level).toBe(1);
      // ＳＰＤＯＷＮLv5
      expect(pilot.features[8].feature.name).toBe("ＳＰＤＯＷＮ");
      expect(pilot.features[8].feature.level).toBe(5);
    });

    it("パターン36: 追加レベル", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[35];
      expect(pilot.name).toBe("テスト＝追加レベルパイロット");
      expect(pilot.features).toHaveLength(2);
      // 追加レベルLv20
      expect(pilot.features[0].feature.name).toBe("追加レベル");
      expect(pilot.features[0].feature.level).toBe(20);
      // ＳＰ低成長
      expect(pilot.features[1].feature.name).toBe("ＳＰ低成長");
    });
  });

  // ==========================================================================
  // SP系特殊能力 (パターン37-38)
  // ==========================================================================
  describe("SP系特殊能力", () => {
    it("パターン37: SP系特殊能力", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[36];
      expect(pilot.name).toBe("テスト＝SP系パイロット");
      expect(pilot.features).toHaveLength(5);
      // 集中力
      expect(pilot.features[0].feature.name).toBe("集中力");
      // ＳＰ回復Lv1-2
      expect(pilot.features[1].feature.name).toBe("ＳＰ回復");
      expect(pilot.features[1].feature.level).toBe(1);
      expect(pilot.features[2].feature.name).toBe("ＳＰ回復");
      expect(pilot.features[2].feature.level).toBe(2);
      expect(pilot.features[2].requiredLevel).toBe(30);
      // 精神統一
      expect(pilot.features[3].feature.name).toBe("精神統一");
      // ＳＰ消費減少=節約
      expect(pilot.features[4].feature.name).toBe("ＳＰ消費減少");
      expect(pilot.features[4].feature.displayName).toBe("節約");
    });

    it("パターン38: スペシャルパワー自動発動", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[37];
      expect(pilot.name).toBe("テスト＝自動発動パイロット");
      expect(pilot.features).toHaveLength(2);
      // スペシャルパワー自動発動=加速
      expect(pilot.features[0].feature.name).toBe("スペシャルパワー自動発動");
      expect(pilot.features[0].feature.displayName).toBe("加速");
      // スペシャルパワー自動発動=集中
      expect(pilot.features[1].feature.name).toBe("スペシャルパワー自動発動");
      expect(pilot.features[1].feature.displayName).toBe("集中");
    });
  });

  // ==========================================================================
  // 気力系特殊能力 (パターン39)
  // ==========================================================================
  describe("気力系特殊能力", () => {
    it("パターン39: 気力系特殊能力", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[38];
      expect(pilot.name).toBe("テスト＝気力パイロット");
      expect(pilot.features).toHaveLength(7);
      // 闘争本能Lv2
      expect(pilot.features[0].feature.name).toBe("闘争本能");
      expect(pilot.features[0].feature.level).toBe(2);
      // 損傷時気力増加Lv2
      expect(pilot.features[1].feature.name).toBe("損傷時気力増加");
      expect(pilot.features[1].feature.level).toBe(2);
      // 命中時気力増加Lv1
      expect(pilot.features[2].feature.name).toBe("命中時気力増加");
      expect(pilot.features[2].feature.level).toBe(1);
      // 失敗時気力増加Lv1
      expect(pilot.features[3].feature.name).toBe("失敗時気力増加");
      expect(pilot.features[3].feature.level).toBe(1);
      // 回避時気力増加Lv1
      expect(pilot.features[4].feature.name).toBe("回避時気力増加");
      expect(pilot.features[4].feature.level).toBe(1);
      // 気力上限Lv170
      expect(pilot.features[5].feature.name).toBe("気力上限");
      expect(pilot.features[5].feature.level).toBe(170);
      // 気力下限Lv110
      expect(pilot.features[6].feature.name).toBe("気力下限");
      expect(pilot.features[6].feature.level).toBe(110);
    });
  });

  // ==========================================================================
  // その他特殊能力 (パターン40-41)
  // ==========================================================================
  describe("その他特殊能力", () => {
    it("パターン40: その他特殊能力（資金・術・技・魔力所有）", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[39];
      expect(pilot.name).toBe("テスト＝その他パイロット１");
      expect(pilot.features).toHaveLength(5);
      // 資金獲得Lv3
      expect(pilot.features[0].feature.name).toBe("資金獲得");
      expect(pilot.features[0].feature.level).toBe(3);
      // 術Lv3
      expect(pilot.features[1].feature.name).toBe("術");
      expect(pilot.features[1].feature.level).toBe(3);
      // 技Lv2
      expect(pilot.features[2].feature.name).toBe("技");
      expect(pilot.features[2].feature.level).toBe(2);
      // 魔力所有
      expect(pilot.features[3].feature.name).toBe("魔力所有");
      // 英雄
      expect(pilot.features[4].feature.name).toBe("英雄");
    });

    it("パターン41: その他特殊能力（再生・２回行動・戦術等）", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[40];
      expect(pilot.name).toBe("テスト＝その他パイロット２");
      expect(pilot.features).toHaveLength(7);
      // 再生Lv2
      expect(pilot.features[0].feature.name).toBe("再生");
      expect(pilot.features[0].feature.level).toBe(2);
      // ２回行動
      expect(pilot.features[1].feature.name).toBe("２回行動");
      // 戦術Lv3
      expect(pilot.features[2].feature.name).toBe("戦術");
      expect(pilot.features[2].feature.level).toBe(3);
      // メッセージ=特殊台詞
      expect(pilot.features[3].feature.name).toBe("メッセージ");
      expect(pilot.features[3].feature.displayName).toBe("特殊台詞");
      // 修理Lv1
      expect(pilot.features[4].feature.name).toBe("修理");
      expect(pilot.features[4].feature.level).toBe(1);
      // 補給Lv1
      expect(pilot.features[5].feature.name).toBe("補給");
      expect(pilot.features[5].feature.level).toBe(1);
      // チーム=テストチーム
      expect(pilot.features[6].feature.name).toBe("チーム");
      expect(pilot.features[6].feature.displayName).toBe("テストチーム");
    });
  });
});
