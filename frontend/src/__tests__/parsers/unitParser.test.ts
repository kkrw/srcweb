/**
 * Unit Parser Tests
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  AndCondition,
  AtomCondition,
  OrCondition,
} from "../../models/interpreter/Condition";
import { parseUnitFile } from "../../parsers/unitParser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("Unit Parser", () => {
  const fixturesPath = join(__dirname, "fixtures");
  const sampleUnitText = readFileSync(
    join(fixturesPath, "sample_unit.txt"),
    "utf-8"
  );

  describe("parseUnitFile", () => {
    // 取り込みが成功すること
    it("should successfully parse valid unit data", () => {
      const result = parseUnitFile(sampleUnitText);

      expect(result.success).toBe(true);
      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBe(16);

      const unitNames = result.data.map((u) => u.Name);
      expect(unitNames).toContain("テストユニット１");
      expect(unitNames).toContain("人間ユニット");
      expect(unitNames).toContain("シンプルユニット");
      expect(unitNames).toContain("最小ユニット");
      expect(unitNames).toContain("複合ユニット");
      expect(unitNames).toContain("長名称ユニット");
      expect(unitNames).toContain("解説ユニット");
      expect(unitNames).toContain("改行テスト");
      expect(unitNames).toContain("複数能力１行");
      expect(unitNames).toContain("レベル指定");
      expect(unitNames).toContain("非表示・オプション");
      expect(unitNames).toContain("ダミー能力");
      expect(unitNames).toContain("必要技能テスト");
      expect(unitNames).toContain("武器条件テスト");
      expect(unitNames).toContain("アビリティ条件テスト");
      expect(unitNames).toContain("複雑条件");
    });

    // Test1
    it("Test1: should parse Test Unit 1 with kana and new format abilities", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit1 = result.data.find((u) => u.Name === "テストユニット１");
      expect(unit1).toBeDefined();
      if (!unit1) return;

      // Unit properties
      expect(unit1.Nickname).toBe("テストユニット１");
      expect(unit1.KanaName).toBe("てすとゆにっと");
      expect(unit1.UnitClass).toBe("ロボット");
      expect(unit1.PilotCapacity).toBe(1);
      expect(unit1.NumItemSlots).toBe(2);
      expect(unit1.MovementType).toBe("陸");
      expect(unit1.Speed).toBe(4);
      expect(unit1.Size).toBe("M");
      expect(unit1.Cost).toBe(3500);
      expect(unit1.ExpValue).toBe(90);
      expect(unit1.HP).toBe(3400);
      expect(unit1.EN).toBe(110);
      expect(unit1.Armor).toBe(1200);
      expect(unit1.Mobility).toBe(85);
      expect(unit1.Adaptation.toString()).toBe("AABA");
      expect(unit1.Bitmap).toBe("test_unit1.bmp");

      // Features - test all properties
      expect(unit1.Features.length).toBe(2);

      const feature1 = unit1.Features[0];
      expect(feature1.Name).toBe("シールド");
      expect(feature1.Level).toBe(3);
      expect(feature1.Parameters).toContain("強化シールド");
      expect(feature1.RequiredCondition).toBeInstanceOf(AndCondition); // empty condition default to AndCondition([])
      expect(
        (feature1.RequiredCondition as AndCondition)["conditions"]
      ).toHaveLength(0);
      expect(feature1.RequiredSkill).toHaveLength(0);

      const feature2 = unit1.Features[1];
      expect(feature2.Name).toBe("分身");
      expect(feature2.Level).toBe(2);
      expect(feature2.RequiredCondition).toBeInstanceOf(AndCondition);
      expect(
        (feature2.RequiredCondition as AndCondition)["conditions"]
      ).toHaveLength(0);
      expect(feature2.RequiredSkill).toHaveLength(0);

      // Weapons - test all properties
      expect(unit1.Weapons.length).toBe(3);

      // Weapon 1: ビームライフル
      const weapon1 = unit1.Weapons[0];
      expect(weapon1.Name).toBe("ビームライフル");
      expect(weapon1.AttackPower).toBe(1600);
      expect(weapon1.MinRange).toBe(2);
      expect(weapon1.MaxRange).toBe(4);
      expect(weapon1.AccuracyMod).toBe(-10);
      expect(weapon1.Ammo).toBe(0); // "-" means 0
      expect(weapon1.ENCost).toBe(30);
      expect(weapon1.RequiredMorale).toBe(0); // "-" means 0
      expect(weapon1.Adaptation.air).toBe(5); // A
      expect(weapon1.Adaptation.ground).toBe(5); // A
      expect(weapon1.Adaptation.water).toBe(0); // -
      expect(weapon1.Adaptation.space).toBe(5); // A
      expect(weapon1.CriticalMod).toBe(10);
      expect(weapon1.Traits).toHaveLength(1);
      expect(weapon1.Traits[0].code).toBe("Ｂ");
      expect(weapon1.RequiredCondition).toBeInstanceOf(AndCondition);
      expect(
        (weapon1.RequiredCondition as AndCondition)["conditions"]
      ).toHaveLength(0);
      expect(weapon1.RequiredSkill).toHaveLength(0);

      // Weapon 2: ビームサーベル
      const weapon2 = unit1.Weapons[1];
      expect(weapon2.Name).toBe("ビームサーベル");
      expect(weapon2.AttackPower).toBe(1350);
      expect(weapon2.MinRange).toBe(1);
      expect(weapon2.MaxRange).toBe(1);
      expect(weapon2.AccuracyMod).toBe(19);
      expect(weapon2.Ammo).toBe(0);
      expect(weapon2.ENCost).toBe(0);
      expect(weapon2.RequiredMorale).toBe(105);
      expect(weapon2.Adaptation.air).toBe(5); // A
      expect(weapon2.Adaptation.ground).toBe(5); // A
      expect(weapon2.Adaptation.water).toBe(5); // A
      expect(weapon2.Adaptation.space).toBe(5); // A
      expect(weapon2.CriticalMod).toBe(5);
      expect(weapon2.Traits).toHaveLength(1);
      expect(weapon2.Traits[0].code).toBe("武");
      expect(weapon2.RequiredCondition).toBeInstanceOf(AndCondition);
      expect(
        (weapon2.RequiredCondition as AndCondition)["conditions"]
      ).toHaveLength(0);
      expect(weapon2.RequiredSkill).toHaveLength(0);

      // Weapon 3: ミサイル
      const weapon3 = unit1.Weapons[2];
      expect(weapon3.Name).toBe("ミサイル");
      expect(weapon3.AttackPower).toBe(1400);
      expect(weapon3.MinRange).toBe(1);
      expect(weapon3.MaxRange).toBe(3);
      expect(weapon3.AccuracyMod).toBe(5);
      expect(weapon3.Ammo).toBe(6);
      expect(weapon3.ENCost).toBe(20);
      expect(weapon3.RequiredMorale).toBe(0);
      expect(weapon3.Adaptation.air).toBe(5);
      expect(weapon3.Adaptation.ground).toBe(5);
      expect(weapon3.Adaptation.water).toBe(5);
      expect(weapon3.Adaptation.space).toBe(5);
      expect(weapon3.CriticalMod).toBe(-10);
      // Traits: Ｍ投L1 Ｐ 実
      expect(weapon3.Traits).toHaveLength(3);
      expect(weapon3.Traits[0].code).toBe("Ｍ投L1");
      expect(weapon3.Traits[1].code).toBe("Ｐ");
      expect(weapon3.Traits[2].code).toBe("実");

      expect(weapon3.RequiredCondition).toBeInstanceOf(AndCondition);
      expect(
        (weapon3.RequiredCondition as AndCondition)["conditions"]
      ).toHaveLength(0);
      expect(weapon3.RequiredSkill).toHaveLength(0);

      // Abilities - test all properties
      expect(unit1.Abilities.length).toBe(2);

      // Ability 1: 修理装置
      const ability1 = unit1.Abilities[0];
      expect(ability1.Name).toBe("修理装置");
      expect(ability1.MinRange).toBe(0);
      expect(ability1.MaxRange).toBe(1);
      expect(ability1.Stock).toBe(5);
      expect(ability1.ENCost).toBe(0);
      expect(ability1.RequiredMorale).toBe(0);
      expect(ability1.Traits).toHaveLength(0);
      expect(ability1.RequiredCondition).toBeInstanceOf(AndCondition);
      expect(
        (ability1.RequiredCondition as AndCondition)["conditions"]
      ).toHaveLength(0);
      expect(ability1.RequiredSkill).toHaveLength(0);
      expect(ability1.Effects.length).toBeGreaterThan(0);
      expect(ability1.Effects[0].EffectType).toBe("回復");
      expect(ability1.Effects[0].EffectLevel).toBe(3);

      // Ability 2: 補給装置
      const ability2 = unit1.Abilities[1];
      expect(ability2.Name).toBe("補給装置");
      expect(ability2.MinRange).toBe(0);
      expect(ability2.MaxRange).toBe(1);
      expect(ability2.Stock).toBe(3);
      expect(ability2.ENCost).toBe(0);
      expect(ability2.RequiredMorale).toBe(105);
      expect(ability2.Traits).toHaveLength(0);
      expect(ability2.RequiredCondition).toBeInstanceOf(AndCondition);
      expect(
        (ability2.RequiredCondition as AndCondition)["conditions"]
      ).toHaveLength(0);
      expect(ability2.RequiredSkill).toHaveLength(0);
      expect(ability2.Effects.length).toBeGreaterThan(0);
      expect(ability2.Effects[0].EffectType).toBe("補給");
    });

    // Test2
    it("Test2: should parse human unit with parentheses in class", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const humanUnit = result.data.find((u) => u.Name === "人間ユニット");
      expect(humanUnit).toBeDefined();
      if (!humanUnit) return;

      expect(humanUnit.Nickname).toBe("戦士");
      expect(humanUnit.KanaName).toBe("戦士"); // No kana specified, should default to nickname
      expect(humanUnit.UnitClass).toBe("(戦士)");
      expect(humanUnit.Size).toBe("SS");

      expect(humanUnit.Weapons.length).toBe(2);
      expect(humanUnit.Weapons[0].Name).toBe("剣");
      expect(humanUnit.Weapons[1].Name).toBe("弓");
      expect(humanUnit.Weapons[1].Ammo).toBe(12);
    });

    // Test3
    it("Test3: should parse unit with no features", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const simpleUnit = result.data.find((u) => u.Name === "シンプルユニット");
      expect(simpleUnit).toBeDefined();
      if (!simpleUnit) return;

      expect(simpleUnit.Features.length).toBe(0);
      expect(simpleUnit.Weapons.length).toBe(1);
      expect(simpleUnit.Abilities.length).toBe(0);
    });

    // Test4
    it("Test4: should parse minimal unit with no weapons and no abilities", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const minimalUnit = result.data.find((u) => u.Name === "最小ユニット");
      expect(minimalUnit).toBeDefined();
      if (!minimalUnit) return;

      expect(minimalUnit.Weapons.length).toBe(0);
      expect(minimalUnit.Abilities.length).toBe(0);
    });

    // Test5
    it("Test5: should parse unit with multiple movement types", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const multiUnit = result.data.find((u) => u.Name === "複合ユニット");
      expect(multiUnit).toBeDefined();
      if (!multiUnit) return;

      expect(multiUnit.MovementType).toBe("空陸水");
    });

    // Test6
    it("Test6: should handle line continuation with underscore (Test 6 - weapons)", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const longUnit = result.data.find((u) => u.Name === "長名称ユニット");
      expect(longUnit).toBeDefined();
      if (!longUnit) return;

      // Weapon with multiline traits
      const longRangeWeapon = longUnit.Weapons.find(
        (w) => w.Name === "超長射程ビーム砲"
      );
      expect(longRangeWeapon).toBeDefined();
      if (!longRangeWeapon) return;

      expect(longRangeWeapon.Traits).toHaveLength(4);
      expect(longRangeWeapon.Traits[0].code).toBe("Ｂ");
      expect(longRangeWeapon.Traits[1].code).toBe("Ｐ");
      expect(longRangeWeapon.Traits[2].code).toBe("Ｈ");
      expect(longRangeWeapon.Traits[3].code).toBe("有");
    });

    // Test7
    it("Test7: should parse special ability with description (解説) definition", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.Name === "解説ユニット");
      expect(unit).toBeDefined();
      if (!unit) return;

      // Unit basic properties
      expect(unit.Nickname).toBe("解説テスト");
      expect(unit.UnitClass).toBe("説明機");

      // Should have 2 features: custom ability and its description definition
      expect(unit.Features.length).toBe(2);

      // Custom ability with alias
      const customFeature = unit.Features.find(
        (f) => f.Name === "カスタム能力" || f.Parameters.includes("特殊スキル")
      );
      expect(customFeature).toBeDefined();
      if (customFeature) {
        expect(customFeature.Level).toBe(3);
        expect(customFeature.Parameters).toContain("特殊スキル");
      }

      // Description definition: 特殊スキル=解説 特別な訓練により習得した独自の戦闘技術
      const descDefinition = unit.Features.find(
        (f) => f.Name === "特殊スキル" && f.Parameters.includes("解説")
      );
      expect(descDefinition).toBeDefined();
      if (descDefinition) {
        expect(descDefinition.Parameters).toContain("解説");
        expect(descDefinition.Parameters).toContain(
          "特別な訓練により習得した独自の戦闘技術"
        );
      }

      // Weapon
      expect(unit.Weapons.length).toBe(1);
      const weapon = unit.Weapons[0];
      expect(weapon.Name).toBe("標準武器");
      expect(weapon.AttackPower).toBe(1200);
      expect(weapon.MinRange).toBe(1);
      expect(weapon.MaxRange).toBe(2);
      expect(weapon.ENCost).toBe(25);
    });

    // Test8
    it("Test8: should handle line continuation with underscore in feature (Test 8)", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.Name === "改行テスト");
      expect(unit).toBeDefined();
      if (!unit) return;

      expect(unit.Features.length).toBe(1);
      const feature = unit.Features[0];
      expect(feature.Name).toBe("超回避");
      expect(feature.Level).toBe(5);
      // The parameters should contain the continuation of the line
      expect(feature.Parameters).toContain("残像");
      expect(feature.Parameters).toContain("気力140以上で発動");
    });

    // Test9
    it("Test9: should parse multiple abilities in one line", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.Name === "複数能力１行");
      expect(unit).toBeDefined();
      if (!unit) return;

      expect(unit.Features.length).toBe(2);
      const feature1 = unit.Features.find((f) => f.Name === "霊力変換器");
      const feature2 = unit.Features.find((f) => f.Name === "ＨＰ回復");
      expect(feature1).toBeDefined();
      expect(feature2).toBeDefined();
      if (feature1) expect(feature1.Level).toBe(100);
      if (feature2) expect(feature2.Level).toBe(2);
    });

    // Test10
    it("Test10: should parse negative and zero level abilities", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.Name === "レベル指定");
      expect(unit).toBeDefined();
      if (!unit) return;

      expect(unit.Features.length).toBe(2);
      const feature1 = unit.Features.find((f) => f.Name === "ＨＰ回復");
      const feature2 = unit.Features.find((f) => f.Name === "ＥＮ回復");
      expect(feature1).toBeDefined();
      expect(feature2).toBeDefined();
      if (feature1) expect(feature1.Level).toBe(-1);
      if (feature2) expect(feature2.Level).toBe(0);
    });

    // Test11
    it("Test11: should parse hidden ability and space-separated options", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.Name === "非表示・オプション");
      expect(unit).toBeDefined();
      if (!unit) return;

      expect(unit.Features.length).toBe(2);
      const hiddenFeature = unit.Features.find((f) => f.Name === "ホバー移動");
      const barrierFeature = unit.Features.find((f) => f.Name === "バリア");
      expect(hiddenFeature).toBeDefined();
      expect(barrierFeature).toBeDefined();
      if (hiddenFeature) expect(hiddenFeature.Parameters).toContain("非表示");
      if (barrierFeature) {
        expect(barrierFeature.Level).toBe(1);
        expect(barrierFeature.Parameters).toContain("念動バリア");
        expect(barrierFeature.Parameters).toContain("全");
        expect(barrierFeature.Parameters).toContain("10");
      }
    });

    // Test12
    it("Test12: should parse dummy abilities with various formats including quoted comma", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.Name === "ダミー能力");
      expect(unit).toBeDefined();
      if (!unit) return;

      expect(unit.Features.length).toBe(5);

      // カスタム能力 with alias
      const customFeature = unit.Features.find((f) =>
        f.Parameters.includes("特殊スキル")
      );
      expect(customFeature).toBeDefined();

      // Dummy ability 1: Basic format
      const dummy1 = unit.Features.find((f) =>
        f.Parameters.includes("風の聖霊シルフ")
      );
      expect(dummy1).toBeDefined();
      if (dummy1) {
        expect(dummy1.Parameters).toContain(
          "風の属性を持つ攻撃に対して耐性を持つ"
        );
      }

      // Dummy ability 2: With quoted comma (exact match test)
      const dummy2 = unit.Features.find((f) =>
        f.Parameters.includes("水の聖霊ウンディーネ")
      );
      expect(dummy2).toBeDefined();
      if (dummy2) {
        expect(dummy2.Parameters).toBe(
          "水の聖霊ウンディーネ 水の属性を持つ攻撃に対して耐性を持ち、火系攻撃に弱い"
        );
      }

      // Dummy ability 3: With comma in description (exact match test)
      const dummy3 = unit.Features.find((f) =>
        f.Parameters.includes("大地の聖霊ノーム")
      );
      expect(dummy3).toBeDefined();
      if (dummy3) {
        expect(dummy3.Parameters).toBe(
          "大地の聖霊ノーム 大地, 土, 岩の属性に強く, 風系攻撃に弱い"
        );
      }

      // Description override
      const descOverride = unit.Features.find(
        (f) => f.Name === "特殊スキル" && f.Parameters.includes("解説")
      );
      expect(descOverride).toBeDefined();
      if (descOverride) {
        expect(descOverride.Parameters).toContain(
          "特別な訓練により習得した独自の戦闘技術"
        );
      }
    });

    // Test13
    it("Test13: should parse required skills and conditions for abilities", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.Name === "必要技能テスト");
      expect(unit).toBeDefined();
      if (!unit) return;

      expect(unit.Features.length).toBe(3);

      // Required skill only: バリアLv2=念動バリア 全 10 (念力Lv3)
      const barrierFeature = unit.Features.find((f) => f.Name === "バリア");
      expect(barrierFeature).toBeDefined();
      if (barrierFeature) {
        expect(barrierFeature.RequiredSkill).toHaveLength(1);
        expect(barrierFeature.RequiredSkill[0].skillName).toBe("念力");
        expect(barrierFeature.RequiredSkill[0].level).toBe(3);
        expect(barrierFeature.RequiredCondition).toBeInstanceOf(AndCondition);
        expect(
          (barrierFeature.RequiredCondition as AndCondition)["conditions"]
        ).toHaveLength(0);
      }

      // Required condition only: ステルス=狩人 <@森 or @林>
      const stealthFeature = unit.Features.find((f) => f.Name === "ステルス");
      expect(stealthFeature).toBeDefined();
      if (stealthFeature) {
        expect(stealthFeature.RequiredSkill).toHaveLength(0);
        // @森 or @林 -> OrCondition with [Atom(@森), Atom(@林)]
        expect(stealthFeature.RequiredCondition).toBeInstanceOf(OrCondition);
        const conds = (stealthFeature.RequiredCondition as OrCondition)[
          "conditions"
        ];
        expect(conds).toHaveLength(2);
        expect((conds[0] as AtomCondition).text).toBe("@森");
        expect((conds[1] as AtomCondition).text).toBe("@林");
      }

      // Both: ＺＯＣ=砂地獄 <地上> (土遁の術Lv4)
      const zocFeature = unit.Features.find((f) => f.Name === "ＺＯＣ");
      expect(zocFeature).toBeDefined();
      if (zocFeature) {
        // "地上" -> AtomCondition
        expect(zocFeature.RequiredCondition).toBeInstanceOf(AtomCondition);
        expect((zocFeature.RequiredCondition as AtomCondition).text).toBe(
          "地上"
        );

        expect(zocFeature.RequiredSkill).toHaveLength(1);
        expect(zocFeature.RequiredSkill[0].skillName).toBe("土遁の術");
        expect(zocFeature.RequiredSkill[0].level).toBe(4);
      }
    });

    // Test14
    it("Test14: should parse required skills and conditions for weapons", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.Name === "武器条件テスト");
      expect(unit).toBeDefined();
      if (!unit) return;

      expect(unit.Weapons.length).toBe(3);

      // Required skill only: 念動斬り
      const weapon1 = unit.Weapons.find((w) => w.Name === "念動斬り");
      expect(weapon1).toBeDefined();
      if (weapon1) {
        expect(weapon1.RequiredSkill).toHaveLength(1);
        expect(weapon1.RequiredSkill[0].skillName).toBe("念力");
        expect(weapon1.RequiredSkill[0].level).toBe(3);
        expect(weapon1.RequiredCondition).toBeInstanceOf(AndCondition);
        expect(
          (weapon1.RequiredCondition as AndCondition)["conditions"]
        ).toHaveLength(0);
      }

      // Required condition only: ドリルアタック
      const weapon2 = unit.Weapons.find((w) => w.Name === "ドリルアタック");
      expect(weapon2).toBeDefined();
      if (weapon2) {
        expect(weapon2.RequiredSkill).toHaveLength(0);
        expect(weapon2.RequiredCondition).toBeInstanceOf(AtomCondition);
        expect((weapon2.RequiredCondition as AtomCondition).text).toBe(
          "母艦3マス以内"
        );
      }

      // Both: 森林剣
      const weapon3 = unit.Weapons.find((w) => w.Name === "森林剣");
      expect(weapon3).toBeDefined();
      if (weapon3) {
        expect(weapon3.RequiredCondition).toBeInstanceOf(OrCondition);
        const conds = (weapon3.RequiredCondition as OrCondition)["conditions"];
        expect(conds).toHaveLength(2);
        expect((conds[0] as AtomCondition).text).toBe("@森");
        expect((conds[1] as AtomCondition).text).toBe("@林");

        expect(weapon3.RequiredSkill).toHaveLength(1);
        expect(weapon3.RequiredSkill[0].skillName).toBe("剣技");
        expect(weapon3.RequiredSkill[0].level).toBe(2);
      }
    });

    // Test15
    it("Test15: should parse required skills and conditions for unit abilities", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.Name === "アビリティ条件テスト");
      expect(unit).toBeDefined();
      if (!unit) return;

      expect(unit.Abilities.length).toBe(3);

      // Required skill only: 癒しの光
      const ability1 = unit.Abilities.find((a) => a.Name === "癒しの光");
      expect(ability1).toBeDefined();
      if (ability1) {
        expect(ability1.RequiredSkill).toHaveLength(1);
        expect(ability1.RequiredSkill[0].skillName).toBe("術");
        expect(ability1.RequiredSkill[0].level).toBe(3);
        expect(ability1.RequiredCondition).toBeInstanceOf(AndCondition);
        expect(
          (ability1.RequiredCondition as AndCondition)["conditions"]
        ).toHaveLength(0);
      }

      // Required condition only: 森林浴
      const ability2 = unit.Abilities.find((a) => a.Name === "森林浴");
      expect(ability2).toBeDefined();
      if (ability2) {
        expect(ability2.RequiredSkill).toHaveLength(0);
        expect(ability2.RequiredCondition).toBeInstanceOf(OrCondition);
        const conds = (ability2.RequiredCondition as OrCondition)["conditions"];
        expect(conds).toHaveLength(2);
        expect((conds[0] as AtomCondition).text).toBe("@森");
        expect((conds[1] as AtomCondition).text).toBe("@林");
      }

      // Both: 森のカーニバル
      const ability3 = unit.Abilities.find((a) => a.Name === "森のカーニバル");
      expect(ability3).toBeDefined();
      if (ability3) {
        expect(ability3.RequiredCondition).toBeInstanceOf(OrCondition);
        const conds = (ability3.RequiredCondition as OrCondition)["conditions"];
        expect(conds).toHaveLength(2);
        expect((conds[0] as AtomCondition).text).toBe("@森");
        expect((conds[1] as AtomCondition).text).toBe("@林");

        expect(ability3.RequiredSkill).toHaveLength(1);
        expect(ability3.RequiredSkill[0].skillName).toBe("術");
        expect(ability3.RequiredSkill[0].level).toBe(4);
      }
    });

    // Test16
    it("Test16: should parse complex condition expressions", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.Name === "複雑条件");
      expect(unit).toBeDefined();
      if (!unit) return;

      expect(unit.Features.length).toBe(2);

      // 地形適応 with multiple terrain names
      const terrainFeature = unit.Features.find((f) => f.Name === "地形適応");
      expect(terrainFeature).toBeDefined();
      if (terrainFeature) {
        expect(terrainFeature.Parameters).toContain("森林戦仕様");
      }

      // 追加移動力 with complex condition: <@森 or @林 地上>
      const movementFeature = unit.Features.find(
        (f) => f.Name === "追加移動力"
      );
      expect(movementFeature).toBeDefined();
      if (movementFeature) {
        // @森 or @林 地上 -> And(Or(@森, @林), 地上)
        expect(movementFeature.RequiredCondition).toBeInstanceOf(AndCondition);
        const conds = (movementFeature.RequiredCondition as AndCondition)[
          "conditions"
        ];
        expect(conds).toHaveLength(2);

        expect(conds[0]).toBeInstanceOf(OrCondition);
        const orConds = (conds[0] as OrCondition)["conditions"];
        expect(orConds).toHaveLength(2);
        expect((orConds[0] as AtomCondition).text).toBe("@森");
        expect((orConds[1] as AtomCondition).text).toBe("@林");

        expect(conds[1]).toBeInstanceOf(AtomCondition);
        expect((conds[1] as AtomCondition).text).toBe("地上");
      }

      // Weapon with complex condition
      expect(unit.Weapons.length).toBe(1);
      const weapon = unit.Weapons[0];
      expect(weapon.Name).toBe("森林砲");

      expect(weapon.RequiredCondition).toBeInstanceOf(AndCondition);
      const wConds = (weapon.RequiredCondition as AndCondition)["conditions"];
      expect(wConds).toHaveLength(2);

      expect(wConds[0]).toBeInstanceOf(OrCondition);
      const wOrConds = (wConds[0] as OrCondition)["conditions"];
      expect(wOrConds).toHaveLength(2);
      expect((wOrConds[0] as AtomCondition).text).toBe("@森");
      expect((wOrConds[1] as AtomCondition).text).toBe("@林");

      expect(wConds[1]).toBeInstanceOf(AtomCondition);
      expect((wConds[1] as AtomCondition).text).toBe("地上");
    });
  });
});
