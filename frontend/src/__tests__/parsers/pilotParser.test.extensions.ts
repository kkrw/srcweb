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

  // ==========================================================================
  // 拡張データパターン (パターン49-52)
  // ==========================================================================
  describe("拡張データパターン（===以降）", () => {
    it("パターン49: ユニット特殊能力付加のみ", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[50];
      expect(pilot.name).toBe("テスト＝特殊能力付加パイロット");
      // ユニット特殊能力
      expect(pilot.unitFeatures).toHaveLength(2);
      expect(pilot.unitFeatures[0].name).toBe("テレポート");
      expect(pilot.unitFeatures[0].level).toBe(3);
      expect(pilot.unitFeatures[0].displayName).toBe("空間転移");
      expect(pilot.unitFeatures[1].name).toBe("バリア");
      expect(pilot.unitFeatures[1].level).toBe(1000);
      expect(pilot.unitFeatures[1].displayName).toBe("念力バリア");
      // 武器・アビリティなし
      expect(pilot.weapons).toHaveLength(0);
      expect(pilot.abilities).toHaveLength(0);
    });

    it("パターン50: 武器付加のみ", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[51];
      expect(pilot.name).toBe("テスト＝武器付加パイロット");
      // ユニット特殊能力なし
      expect(pilot.unitFeatures).toHaveLength(0);
      // 武器
      expect(pilot.weapons).toHaveLength(2);
      expect(pilot.weapons[0].name).toBe("念力衝撃波");
      expect(pilot.weapons[0].attackPower).toBe(1800);
      expect(pilot.weapons[0].minRange).toBe(1);
      expect(pilot.weapons[0].maxRange).toBe(4);
      expect(pilot.weapons[0].accuracyMod).toBe(20);
      expect(pilot.weapons[0].ammo).toBeUndefined();
      expect(pilot.weapons[0].enCost).toBe(30);
      expect(pilot.weapons[0].requiredMorale).toBe(110);
      expect(pilot.weapons[0].criticalMod).toBe(10);
      expect(pilot.weapons[1].name).toBe("念力シールド");
      expect(pilot.weapons[1].attackPower).toBe(0);
      // アビリティなし
      expect(pilot.abilities).toHaveLength(0);
    });

    it("パターン51: アビリティ付加のみ", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[52];
      expect(pilot.name).toBe("テスト＝アビリティ付加パイロット");
      expect(pilot.sex).toBe("女性");
      // ユニット特殊能力・武器なし
      expect(pilot.unitFeatures).toHaveLength(0);
      expect(pilot.weapons).toHaveLength(0);
      // アビリティ
      expect(pilot.abilities).toHaveLength(2);
      expect(pilot.abilities[0].name).toBe("霧の守り");
      expect(pilot.abilities[0].effects).toHaveLength(1);
      expect(pilot.abilities[0].effects[0]).toBe(
        '付加Lv3="アーマーLv3=霧の守り 火"'
      );
      expect(pilot.abilities[0].minRange).toBe(0);
      expect(pilot.abilities[0].stock).toBeUndefined();
      expect(pilot.abilities[0].enCost).toBe(10);
      expect(pilot.abilities[1].name).toBe("浄化の光");
      expect(pilot.abilities[1].effects).toBe("回復Lv30");
      expect(pilot.abilities[1].stock).toBe(3);
      expect(pilot.abilities[1].enCost).toBe(20);
    });

    it("パターン52: 全拡張データ（特殊能力・武器・アビリティ）", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[53];
      expect(pilot.name).toBe("テスト＝全拡張パイロット");
      // パイロット特殊能力
      expect(pilot.features).toHaveLength(3);
      expect(pilot.features[0].feature.name).toBe("念力");
      expect(pilot.features[0].feature.level).toBe(4);
      expect(pilot.features[1].feature.name).toBe("オーラ");
      expect(pilot.features[1].feature.level).toBe(3);
      expect(pilot.features[2].feature.name).toBe("霊力");
      expect(pilot.features[2].feature.level).toBe(60);
      // ユニット特殊能力
      expect(pilot.unitFeatures).toHaveLength(2);
      expect(pilot.unitFeatures[0].name).toBe("テレポート");
      expect(pilot.unitFeatures[0].level).toBe(5);
      expect(pilot.unitFeatures[0].displayName).toBe("瞬間移動");
      expect(pilot.unitFeatures[1].name).toBe("バリア");
      expect(pilot.unitFeatures[1].level).toBe(2000);
      expect(pilot.unitFeatures[1].displayName).toBe("絶対防御");
      // 武器
      expect(pilot.weapons).toHaveLength(2);
      expect(pilot.weapons[0].name).toBe("念動剣");
      expect(pilot.weapons[0].attackPower).toBe(2200);
      expect(pilot.weapons[0].minRange).toBe(1);
      expect(pilot.weapons[0].maxRange).toBe(1);
      expect(pilot.weapons[0].accuracyMod).toBe(30);
      expect(pilot.weapons[0].enCost).toBe(20);
      expect(pilot.weapons[0].requiredMorale).toBe(120);
      expect(pilot.weapons[0].criticalMod).toBe(15);
      expect(pilot.weapons[1].name).toBe("念動波");
      expect(pilot.weapons[1].attackPower).toBe(2000);
      expect(pilot.weapons[1].minRange).toBe(2);
      expect(pilot.weapons[1].maxRange).toBe(5);
      // アビリティ
      expect(pilot.abilities).toHaveLength(2);
      expect(pilot.abilities[0].name).toBe("念動バリア");
      expect(pilot.abilities[0].effects).toHaveLength(1);
      expect(pilot.abilities[0].effects[0]).toBe(
        '付加Lv5="バリアLv500=念動バリア"'
      );
      expect(pilot.abilities[0].stock).toBe(3);
      expect(pilot.abilities[0].enCost).toBe(15);
      expect(pilot.abilities[0].requiredMorale).toBe(105);
      expect(pilot.abilities[1].name).toBe("精神回復");
      expect(pilot.abilities[1].effects).toBe("回復SPLv30");
      expect(pilot.abilities[1].stock).toBe(1);
    });
  });

  // ==========================================================================
  // 複合パターン (パターン53)
  // ==========================================================================
  describe("複合パターン", () => {
    it("パターン53: 多数の特殊能力（複合パターン）", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[54];
      expect(pilot.name).toBe("テスト＝複合パイロット");
      expect(pilot.availableUnitClasses).toEqual(["ロボット", "戦闘機"]);
      // 地形適応 SABA
      expect(pilot.adaptation.air).toBe(6);
      expect(pilot.adaptation.ground).toBe(5);
      expect(pilot.adaptation.water).toBe(4);
      expect(pilot.adaptation.space).toBe(5);
      // 複数の特殊能力
      expect(pilot.features).toHaveLength(12);
      // 切り払いLv3-5
      expect(pilot.features[0].feature.name).toBe("切り払い");
      expect(pilot.features[0].feature.level).toBe(3);
      expect(pilot.features[2].feature.name).toBe("切り払い");
      expect(pilot.features[2].feature.level).toBe(5);
      expect(pilot.features[2].requiredLevel).toBe(50);
      // 迎撃Lv2-3
      expect(pilot.features[3].feature.name).toBe("迎撃");
      expect(pilot.features[3].feature.level).toBe(2);
      // 複数のスペシャルパワー
      expect(pilot.specialPowers).toHaveLength(8);
      expect(pilot.specialPowers[0].name).toBe("加速");
      expect(pilot.specialPowers[0].requiredLevel).toBe(1);
      expect(pilot.specialPowers[7].name).toBe("覚醒");
      expect(pilot.specialPowers[7].requiredLevel).toBe(45);
    });
  });

  // ==========================================================================
  // エッジケース (パターン54-59)
  // ==========================================================================
  describe("エッジケース", () => {
    it("パターン54: 最大値テスト", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[55];
      expect(pilot.name).toBe("テスト＝最大値パイロット");
      expect(pilot.expValue).toBe(9999);
      expect(pilot.meleeAtk).toBe(9999);
      expect(pilot.rangedAtk).toBe(9999);
      expect(pilot.accuracy).toBe(9999);
      expect(pilot.evasion).toBe(9999);
      expect(pilot.technique).toBe(9999);
      expect(pilot.agility).toBe(9999);
      expect(pilot.sp).toBe(9999);
      // 地形適応 SSSS
      expect(pilot.adaptation.air).toBe(6);
      expect(pilot.adaptation.ground).toBe(6);
      expect(pilot.adaptation.water).toBe(6);
      expect(pilot.adaptation.space).toBe(6);
      // 特殊能力Lv9
      expect(pilot.features[0].feature.name).toBe("底力");
      expect(pilot.features[0].feature.level).toBe(9);
      expect(pilot.features[1].feature.name).toBe("切り払い");
      expect(pilot.features[1].feature.level).toBe(9);
    });

    it("パターン55: 最小値テスト", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[56];
      expect(pilot.name).toBe("テスト＝最小値パイロット");
      expect(pilot.expValue).toBe(1);
      expect(pilot.meleeAtk).toBe(1);
      expect(pilot.rangedAtk).toBe(1);
      expect(pilot.accuracy).toBe(1);
      expect(pilot.evasion).toBe(1);
      expect(pilot.technique).toBe(1);
      expect(pilot.agility).toBe(1);
      expect(pilot.sp).toBe(1);
      // 地形適応 DDDD
      expect(pilot.adaptation.air).toBe(2);
      expect(pilot.adaptation.ground).toBe(2);
      expect(pilot.adaptation.water).toBe(2);
      expect(pilot.adaptation.space).toBe(2);
      expect(pilot.personality).toBe(PERSONALITY.WEAK);
    });

    it("パターン56: 単一ユニットタイプ", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[57];
      expect(pilot.name).toBe("テスト＝単一タイプパイロット");
      expect(pilot.availableUnitClasses).toEqual(["ロボット"]);
    });

    it("パターン57: 多数ユニットタイプ", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[58];
      expect(pilot.name).toBe("テスト＝多数タイプパイロット");
      expect(pilot.availableUnitClasses).toEqual([
        "ロボット",
        "戦闘機",
        "戦車",
        "艦船",
        "人間",
      ]);
    });

    it("パターン58: 特殊能力1つのみ", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[59];
      expect(pilot.name).toBe("テスト＝単一能力パイロット");
      expect(pilot.features).toHaveLength(1);
      expect(pilot.features[0].feature.name).toBe("底力");
      expect(pilot.features[0].feature.level).toBeUndefined();
    });

    it("パターン59: SP1つのみ", () => {
      const result = parsePilotFile(samplePilotText, "sample_pilot.txt");
      expect(result.success).toBe(true);
      if (!result.success) return;

      const pilot = result.data[60];
      expect(pilot.name).toBe("テスト＝単一SPパイロット");
      expect(pilot.sp).toBe(30);
      expect(pilot.specialPowers).toHaveLength(1);
      expect(pilot.specialPowers[0].name).toBe("加速");
      expect(pilot.specialPowers[0].requiredLevel).toBe(1);
    });
  });
});
