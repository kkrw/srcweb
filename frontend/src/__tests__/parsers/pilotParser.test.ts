import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PERSONALITY } from "../../parsers/constants";
import { parsePilotFile } from "../../parsers/pilotParser";

describe("Pilot Parser", () => {
  const samplePilotText = readFileSync(
    join(__dirname, "fixtures", "sample_pilot.txt"),
    "utf-8"
  );

  describe("parsePilotFile - 正常パース", () => {
    it("should successfully parse all 61 pilot data entries", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");

      if (!result.success) {
        console.error("Parse error:", result.error);
      }
      expect(result.success).toBe(true);
      if (!result.success) return;

      // 61パターン分のパイロットデータ（パターン49-59は元のナンバリング、60-61は追加）
      expect(result.data).toHaveLength(61);
    });
  });

  // ==========================================================================
  // 基本パターン (パターン1-3)
  // ==========================================================================
  describe("基本パターン", () => {
    it("パターン1: 基本的なパイロットデータ（フル指定）", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[0];
      // 基本情報
      expect(pilot.name).toBe("テスト＝パイロット１");
      expect(pilot.nickname).toBe("パイロット１");
      expect(pilot.kanaName).toBe("ぱいろっと１");
      expect(pilot.sex).toBe("男性");
      // ユニットタイプ（複数指定）
      expect(pilot.availableUnitClasses).toEqual([
        "ロボット(新世代)",
        "ロボット",
        "ロボット(外伝)",
      ]);
      // 地形適応 BACS = B(4), A(5), C(3), S(6)
      expect(pilot.adaptation.air).toBe(4);
      expect(pilot.adaptation.ground).toBe(5);
      expect(pilot.adaptation.water).toBe(3);
      expect(pilot.adaptation.space).toBe(6);
      // ステータス
      expect(pilot.expValue).toBe(200);
      expect(pilot.meleeAtk).toBe(150);
      expect(pilot.rangedAtk).toBe(140);
      expect(pilot.accuracy).toBe(160);
      expect(pilot.evasion).toBe(170);
      expect(pilot.technique).toBe(140);
      expect(pilot.agility).toBe(160);
      expect(pilot.personality).toBe(PERSONALITY.NORMAL);
      expect(pilot.sp).toBe(50);
      // メディア
      expect(pilot.bgmFiles).toHaveLength(1);
      expect(pilot.bgmFiles[0]).toBe("src_test_data.mid");
      expect(pilot.faceGraphicFile).toBe("src_test_pilot_1.bmp");
      expect(pilot.isBitmapMissing).toBe(false);
      // 特殊能力（新形式）
      expect(pilot.features).toHaveLength(4);
      expect(pilot.features[0].feature.name).toBe("切り払い");
      expect(pilot.features[0].feature.level).toBe(2);
      expect(pilot.features[0].requiredLevel).toBe(1);
      expect(pilot.features[1].feature.name).toBe("シールド防御");
      expect(pilot.features[1].feature.level).toBe(2);
      expect(pilot.features[1].requiredLevel).toBe(1);
      expect(pilot.features[2].feature.name).toBe("シールド防御");
      expect(pilot.features[2].feature.level).toBe(3);
      expect(pilot.features[2].requiredLevel).toBe(10);
      expect(pilot.features[3].feature.name).toBe("底力");
      expect(pilot.features[3].feature.level).toBe(5);
      expect(pilot.features[3].requiredLevel).toBe(1);
      // スペシャルパワー
      expect(pilot.specialPowers).toHaveLength(4);
      expect(pilot.specialPowers[0].name).toBe("集中");
      expect(pilot.specialPowers[0].requiredLevel).toBe(1);
      expect(pilot.specialPowers[0].spCost).toBeUndefined();
      expect(pilot.specialPowers[1].name).toBe("必中");
      expect(pilot.specialPowers[1].requiredLevel).toBe(10);
      expect(pilot.specialPowers[2].name).toBe("加速");
      expect(pilot.specialPowers[2].requiredLevel).toBe(15);
      expect(pilot.specialPowers[3].name).toBe("熱血");
      expect(pilot.specialPowers[3].requiredLevel).toBe(20);
      // 拡張データなし
      expect(pilot.unitFeatures).toHaveLength(0);
      expect(pilot.weapons).toHaveLength(0);
      expect(pilot.abilities).toHaveLength(0);
    });

    it("パターン2: ザコパイロット（特殊能力なし・SPなし）", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[1];
      expect(pilot.name).toBe("テスト＝パイロット２(ザコ)");
      expect(pilot.nickname).toBe("パイロット２");
      expect(pilot.kanaName).toBe("ぱいろっと２"); // 愛称から自動変換
      expect(pilot.sex).toBe("女性");
      expect(pilot.availableUnitClasses).toHaveLength(0); // "-"は空配列
      // 地形適応 AAAA = A(5), A(5), A(5), A(5)
      expect(pilot.adaptation.air).toBe(5);
      expect(pilot.adaptation.ground).toBe(5);
      expect(pilot.adaptation.water).toBe(5);
      expect(pilot.adaptation.space).toBe(5);
      expect(pilot.expValue).toBe(100);
      expect(pilot.meleeAtk).toBe(100);
      expect(pilot.rangedAtk).toBe(100);
      expect(pilot.accuracy).toBe(120);
      expect(pilot.evasion).toBe(150);
      expect(pilot.technique).toBe(110);
      expect(pilot.agility).toBe(130);
      expect(pilot.personality).toBe(PERSONALITY.WEAK);
      // 特殊能力なし
      expect(pilot.features).toHaveLength(0);
      // SPなし
      expect(pilot.sp).toBe(0);
      expect(pilot.specialPowers).toHaveLength(0);
      // メディアなし
      expect(pilot.faceGraphicFile).toBe("-.bmp");
      expect(pilot.bgmFiles).toHaveLength(1);
      expect(pilot.bgmFiles[0]).toBe("-.mid");
    });

    it("パターン3: 汎用パイロット（旧形式特殊能力）", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[2];
      expect(pilot.name).toBe("テスト＝パイロット３(汎用)");
      expect(pilot.nickname).toBe("パイロット３");
      expect(pilot.kanaName).toBe("ぱいろっと３");
      expect(pilot.sex).toBe("-"); // 性別省略で読み仮名が性別扱いにならなかった
      // 地形適応 -EDC = -(0), E(1), D(2), C(3)
      expect(pilot.adaptation.air).toBe(0);
      expect(pilot.adaptation.ground).toBe(1);
      expect(pilot.adaptation.water).toBe(2);
      expect(pilot.adaptation.space).toBe(3);
      expect(pilot.expValue).toBe(500);
      expect(pilot.personality).toBe(PERSONALITY.SUPER_STRONG);
      // 旧形式特殊能力
      expect(pilot.features).toHaveLength(4);
      expect(pilot.features[0].feature.name).toBe("切り払い");
      expect(pilot.features[0].feature.level).toBe(4);
      expect(pilot.features[1].feature.name).toBe("シールド防御");
      expect(pilot.features[1].feature.level).toBe(3);
      expect(pilot.features[2].feature.name).toBe("底力");
      expect(pilot.features[2].feature.level).toBeUndefined(); // レベル省略
      expect(pilot.features[3].feature.name).toBe("２回行動");
      // スペシャルパワー
      expect(pilot.specialPowers).toHaveLength(5);
      expect(pilot.specialPowers[0].name).toBe("気合");
      expect(pilot.specialPowers[4].name).toBe("魂");
      expect(pilot.specialPowers[4].requiredLevel).toBe(25);
      // 全角文字のファイル名
      expect(pilot.faceGraphicFile).toBe("全角文字の顔画像.bmp");
      expect(pilot.bgmFiles).toHaveLength(1);
      expect(pilot.bgmFiles[0]).toBe("全角文字のＢＧＭ.mid");
    });
  });

  // ==========================================================================
  // 省略パターン (パターン4-8)
  // ==========================================================================
  describe("省略パターン", () => {
    it("パターン4: 読み仮名省略（フィールド自体を省略）", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[3];
      expect(pilot.name).toBe("テスト＝読み仮名省略パイロット");
      expect(pilot.nickname).toBe("あいう");
      expect(pilot.kanaName).toBe("あいう"); // 愛称から自動設定
      expect(pilot.sex).toBe("男性");
      expect(pilot.availableUnitClasses).toEqual(["ロボット"]);
    });

    it("パターン5: 読み仮名空文字指定", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[4];
      expect(pilot.name).toBe("テスト＝読み仮名空文字パイロット");
      expect(pilot.nickname).toBe("えおか");
      expect(pilot.kanaName).toBe(""); // 空文字が設定される
      expect(pilot.sex).toBe("男性");
    });

    it("パターン6: 性別省略（旧バージョン互換）", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[5];
      expect(pilot.name).toBe("テスト＝性別省略パイロット");
      expect(pilot.nickname).toBe("たろう");
      expect(pilot.kanaName).toBe("たろう");
      expect(pilot.sex).toBe("-"); // 省略時はデフォルト
    });

    it("パターン7: 読み仮名と性別の両方省略（4フィールド）", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[6];
      expect(pilot.name).toBe("テスト＝両方省略パイロット");
      expect(pilot.nickname).toBe("じろう");
      expect(pilot.kanaName).toBe("じろう"); // 愛称から自動設定
      expect(pilot.sex).toBe("-"); // デフォルト
      expect(pilot.availableUnitClasses).toEqual(["ロボット"]);
    });

    it("パターン8: 性別が-（性別なし）", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[7];
      expect(pilot.name).toBe("テスト＝性別なしパイロット");
      expect(pilot.nickname).toBe("機械兵");
      expect(pilot.kanaName).toBe("きかいへい");
      expect(pilot.sex).toBe("-");
      expect(pilot.personality).toBe(PERSONALITY.MACHINE);
      // 地形適応 AAAB
      expect(pilot.adaptation.air).toBe(5);
      expect(pilot.adaptation.ground).toBe(5);
      expect(pilot.adaptation.water).toBe(5);
      expect(pilot.adaptation.space).toBe(4);
    });
  });

  // ==========================================================================
  // 式置換・変数パターン (パターン9-11)
  // ==========================================================================
  describe("式置換・変数パターン", () => {
    it("パターン9: 愛称に式置換", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[8];
      expect(pilot.name).toBe("テスト＝主人公パイロット");
      expect(pilot.nickname).toBe("$(主人公愛称)");
      expect(pilot.kanaName).toBe("$(主人公読み仮名)");
      expect(pilot.sex).toBe("男性");
    });

    it("パターン10: 主人公愛称", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[9];
      expect(pilot.name).toBe("テスト＝主人公愛称パイロット");
      expect(pilot.nickname).toBe("主人公");
      expect(pilot.kanaName).toBe("主人公");
    });

    it("パターン11: ヒロイン愛称", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[10];
      expect(pilot.name).toBe("テスト＝ヒロインパイロット");
      expect(pilot.nickname).toBe("ヒロイン");
      expect(pilot.kanaName).toBe("ヒロイン");
      expect(pilot.sex).toBe("女性");
    });
  });

  // ==========================================================================
  // サポートパイロット関連 (パターン12-16)
  // ==========================================================================
  describe("サポートパイロット関連", () => {
    it("パターン12: サポートパイロット", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[11];
      expect(pilot.name).toBe("テスト＝サポートパイロット１");
      expect(pilot.availableUnitClasses).toEqual(["ロボット(サポート)"]);
      expect(pilot.sex).toBe("女性");
    });

    it("パターン13: 通常・サポート兼用パイロット", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[12];
      expect(pilot.name).toBe("テスト＝兼用パイロット");
      expect(pilot.availableUnitClasses).toEqual([
        "ロボット",
        "ロボット(サポート)",
      ]);
    });

    it("パターン14: パイロット名専属サポート", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[13];
      expect(pilot.name).toBe("テスト＝専属サポート１");
      expect(pilot.availableUnitClasses).toEqual([
        "ロボット(テストリーダー専属サポート)",
      ]);
    });

    it("パターン15: 性別専属サポート", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[14];
      expect(pilot.name).toBe("テスト＝男性専属サポート");
      expect(pilot.availableUnitClasses).toEqual([
        "ロボット(男性専属サポート)",
      ]);
    });

    it("パターン16: 特殊能力専属サポート", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[15];
      expect(pilot.name).toBe("テスト＝能力専属サポート");
      expect(pilot.availableUnitClasses).toEqual([
        "ロボット(超能力専属サポート)",
      ]);
    });
  });

  // ==========================================================================
  // SP消費量カスタマイズ・複数MIDI (パターン17-18)
  // ==========================================================================
  describe("SP消費量カスタマイズ・複数MIDI", () => {
    it("パターン17: SP消費量カスタマイズ", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[16];
      expect(pilot.name).toBe("テスト＝SP消費量カスタムパイロット");
      expect(pilot.personality).toBe(PERSONALITY.STRONG);
      expect(pilot.sp).toBe(80);
      // カスタムSP消費量
      expect(pilot.specialPowers).toHaveLength(4);
      expect(pilot.specialPowers[0].name).toBe("気合");
      expect(pilot.specialPowers[0].spCost).toBe(30);
      expect(pilot.specialPowers[0].requiredLevel).toBe(1);
      expect(pilot.specialPowers[1].name).toBe("熱血");
      expect(pilot.specialPowers[1].spCost).toBe(35);
      expect(pilot.specialPowers[1].requiredLevel).toBe(5);
      expect(pilot.specialPowers[2].name).toBe("魂");
      expect(pilot.specialPowers[2].spCost).toBe(50);
      expect(pilot.specialPowers[2].requiredLevel).toBe(15);
      expect(pilot.specialPowers[3].name).toBe("ド根性");
      expect(pilot.specialPowers[3].spCost).toBe(25);
      expect(pilot.specialPowers[3].requiredLevel).toBe(20);
    });

    it("パターン18: 複数MIDIファイル指定", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[17];
      expect(pilot.name).toBe("テスト＝複数BGMパイロット");
      expect(pilot.bgmFiles).toHaveLength(3);
      expect(pilot.bgmFiles[0]).toBe("theme1.mid");
      expect(pilot.bgmFiles[1]).toBe("theme2.mid");
      expect(pilot.bgmFiles[2]).toBe("default.mid");
    });
  });

  // ==========================================================================
  // 地形適応パターン (パターン42-44)
  // ==========================================================================
  describe("地形適応パターン", () => {
    it("パターン42: 地形適応 全S", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[41];
      expect(pilot.name).toBe("テスト＝全S適応パイロット");
      // SSSS = S(6), S(6), S(6), S(6)
      expect(pilot.adaptation.air).toBe(6);
      expect(pilot.adaptation.ground).toBe(6);
      expect(pilot.adaptation.water).toBe(6);
      expect(pilot.adaptation.space).toBe(6);
    });

    it("パターン43: 地形適応 混合パターン", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[42];
      expect(pilot.name).toBe("テスト＝混合適応パイロット");
      // SABD = S(6), A(5), B(4), D(2)
      expect(pilot.adaptation.air).toBe(6);
      expect(pilot.adaptation.ground).toBe(5);
      expect(pilot.adaptation.water).toBe(4);
      expect(pilot.adaptation.space).toBe(2);
    });

    it("パターン44: 地形適応 -含む", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[43];
      expect(pilot.name).toBe("テスト＝地形制限パイロット");
      // -S-C = -(0), S(6), -(0), C(3)
      expect(pilot.adaptation.air).toBe(0);
      expect(pilot.adaptation.ground).toBe(6);
      expect(pilot.adaptation.water).toBe(0);
      expect(pilot.adaptation.space).toBe(3);
    });
  });

  // ==========================================================================
  // 性格パターン (パターン45-47)
  // ==========================================================================
  describe("性格パターン", () => {
    it("パターン45: 性格 機械", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[44];
      expect(pilot.name).toBe("テスト＝機械パイロット");
      expect(pilot.sex).toBe("-");
      expect(pilot.personality).toBe(PERSONALITY.MACHINE);
      expect(pilot.sp).toBe(0);
      expect(pilot.specialPowers).toHaveLength(0);
    });

    it("パターン46: 性格 弱気", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[45];
      expect(pilot.name).toBe("テスト＝弱気パイロット");
      expect(pilot.personality).toBe(PERSONALITY.WEAK);
    });

    it("パターン47: 性格 強気", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[46];
      expect(pilot.name).toBe("テスト＝強気パイロット");
      expect(pilot.personality).toBe(PERSONALITY.STRONG);
    });
  });

  // ==========================================================================
  // 行継続パターン (パターン48, 60-61)
  // ==========================================================================
  describe("行継続パターン", () => {
    it("パターン48: 行継続（_）", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[47];
      expect(pilot.name).toBe("テスト＝行継続パイロット");
      // 切り払いLv1-7（行継続で分割）
      expect(pilot.features).toHaveLength(10);
      expect(pilot.features[0].feature.name).toBe("切り払い");
      expect(pilot.features[0].feature.level).toBe(1);
      expect(pilot.features[6].feature.name).toBe("切り払い");
      expect(pilot.features[6].feature.level).toBe(7);
      expect(pilot.features[6].requiredLevel).toBe(60);
      // 底力Lv1-3
      expect(pilot.features[7].feature.name).toBe("底力");
      expect(pilot.features[7].feature.level).toBe(1);
      expect(pilot.features[9].feature.name).toBe("底力");
      expect(pilot.features[9].feature.level).toBe(3);
      expect(pilot.features[9].requiredLevel).toBe(30);
      // スペシャルパワー（行継続）
      expect(pilot.specialPowers).toHaveLength(6);
      expect(pilot.specialPowers[0].name).toBe("加速");
      expect(pilot.specialPowers[0].requiredLevel).toBe(1);
      expect(pilot.specialPowers[3].name).toBe("熱血");
      expect(pilot.specialPowers[3].requiredLevel).toBe(15);
      expect(pilot.specialPowers[4].name).toBe("気合");
      expect(pilot.specialPowers[4].requiredLevel).toBe(20);
      expect(pilot.specialPowers[5].name).toBe("魂");
      expect(pilot.specialPowers[5].requiredLevel).toBe(30);
    });

    it("パターン60: 行継続＋警告発生（継続行で不正な値）- 警告行番号確認", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[48];
      expect(pilot.name).toBe("テスト＝行継続警告パイロット");

      // 警告が発生していることを確認
      expect(result.warnings).toBeDefined();
      expect(result.warnings!.length).toBeGreaterThan(0);

      // 継続行の行番号が正しいことを確認（行582で不正な値）
      const warning582 = result.warnings!.find((w) => w.includes("行582"));
      expect(warning582).toBeDefined();

      // 継続行の行番号が正しいことを確認（行586で不正なレベル）
      const warning586 = result.warnings!.find((w) => w.includes("行586"));
      expect(warning586).toBeDefined();
    });

    it("パターン61: 複数行継続＋警告発生（複数継続行での行番号確認）", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[49];
      expect(pilot.name).toBe("テスト＝複数行継続警告パイロット");

      // 警告が発生していることを確認
      expect(result.warnings).toBeDefined();

      // 継続行の行番号が正しいことを確認（行596で不正値）
      const warning596 = result.warnings!.find((w) => w.includes("行596"));
      expect(warning596).toBeDefined();

      // 継続行の行番号が正しいことを確認（行602で不正値）
      const warning602 = result.warnings!.find((w) => w.includes("行602"));
      expect(warning602).toBeDefined();
    });
  });
});
