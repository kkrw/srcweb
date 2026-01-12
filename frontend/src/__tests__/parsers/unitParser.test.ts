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
} from "../../models/Condition";
import { parseUnitFile } from "../../parsers/unitParser";
import { decodeShiftJIS } from "../../parsers/utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("Unit Parser", () => {
  const fixturesPath = join(__dirname, "fixtures");
  const sampleUnitBuffer = readFileSync(
    join(fixturesPath, "sample_unit.txt")
  );
  const sampleUnitText = decodeShiftJIS(sampleUnitBuffer);

  // ==========================================================================
  // 初期パースと基本検証
  // ==========================================================================
  describe("parseUnitFile - 初期パースと基本検証", () => {
    // 取り込みが成功すること
    it("should successfully parse valid unit data", () => {
      const result = parseUnitFile(sampleUnitText);

      expect(result.success).toBe(true);
      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBe(16);

      const unitNames = result.data.map((u) => u.name);
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
  });

  // ==========================================================================
  // 基本データと詳細パース (テスト1, 2)
  // ==========================================================================
  describe("基本データと詳細パース", () => {
    // Test1
    it("Test1: should parse Test Unit 1 with kana and new format abilities", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit1 = result.data.find((u) => u.name === "テストユニット１");
      expect(unit1).toBeDefined();
      if (!unit1) return;

      // Unit properties
      expect(unit1.nickname).toBe("テストユニット１");
      expect(unit1.kanaName).toBe("てすとゆにっと");
      expect(unit1.unitClass).toBe("ロボット");
      expect(unit1.pilotCapacity).toBe(1);
      expect(unit1.numItemSlots).toBe(2);
      expect(unit1.movementType).toBe("陸");
      expect(unit1.speed).toBe(4);
      expect(unit1.size).toBe("M");
      expect(unit1.cost).toBe(3500);
      expect(unit1.expValue).toBe(90);
      expect(unit1.hp).toBe(3400);
      expect(unit1.en).toBe(110);
      expect(unit1.armor).toBe(1200);
      expect(unit1.mobility).toBe(85);
      expect(unit1.adaptation.toString()).toBe("AABA");
      expect(unit1.bitmap).toBe("test_unit1.bmp");

      // Features - test all properties
      expect(unit1.features.length).toBe(2);

      // シールド is defined in FEATURES, so spec.name should be set
      const feature1 = unit1.features[0];
      expect(feature1.spec.name).toBe("シールド");
      expect(feature1.level).toBe(3);
      expect(feature1.displayName).toContain("強化シールド");
      expect(feature1.description).toBeUndefined();
      expect(feature1.rawParameters).toBeUndefined();
      expect(feature1.requiredCondition).toBeInstanceOf(AndCondition); // empty condition default to AndCondition([])
      expect(
        (feature1.requiredCondition as AndCondition)["conditions"]
      ).toHaveLength(0);
      expect(feature1.requiredSkill).toHaveLength(0);
      expect(feature1.showLevel).toBe(true);
      expect(feature1.visible).toBe(true);

      // 分身 is not defined in FEATURES, so displayName should be set
      const feature2 = unit1.features[1];
      expect(feature2.spec.name).toBe("分身");
      expect(feature2.level).toBe(2);
      expect(feature2.displayName).toBeUndefined();
      expect(feature2.description).toBeUndefined();
      expect(feature2.rawParameters).toBeUndefined();
      expect(feature2.requiredCondition).toBeInstanceOf(AndCondition);
      expect(
        (feature2.requiredCondition as AndCondition)["conditions"]
      ).toHaveLength(0);
      expect(feature2.requiredSkill).toHaveLength(0);
      expect(feature2.showLevel).toBe(true);
      expect(feature2.visible).toBe(true);

      // Weapons - test all properties
      expect(unit1.weapons.length).toBe(3);

      // Weapon 1: ビームライフル
      const weapon1 = unit1.weapons[0];
      expect(weapon1.name).toBe("ビームライフル");
      expect(weapon1.attackPower).toBe(1600);
      expect(weapon1.minRange).toBe(2);
      expect(weapon1.maxRange).toBe(4);
      expect(weapon1.accuracyMod).toBe(-10);
      expect(weapon1.ammo).toBe(0); // "-" means 0
      expect(weapon1.enCost).toBe(30);
      expect(weapon1.requiredMorale).toBe(0); // "-" means 0
      expect(weapon1.adaptation.air).toBe(5); // A
      expect(weapon1.adaptation.ground).toBe(5); // A
      expect(weapon1.adaptation.water).toBe(0); // -
      expect(weapon1.adaptation.space).toBe(5); // A
      expect(weapon1.criticalMod).toBe(10);
      expect(weapon1.traits).toHaveLength(1);
      expect(weapon1.traits[0].code).toBe("Ｂ");
      expect(weapon1.requiredCondition).toBeInstanceOf(AndCondition);
      expect(
        (weapon1.requiredCondition as AndCondition)["conditions"]
      ).toHaveLength(0);
      expect(weapon1.requiredSkill).toHaveLength(0);

      // Weapon 2: ビームサーベル
      const weapon2 = unit1.weapons[1];
      expect(weapon2.name).toBe("ビームサーベル");
      expect(weapon2.attackPower).toBe(1350);
      expect(weapon2.minRange).toBe(1);
      expect(weapon2.maxRange).toBe(1);
      expect(weapon2.accuracyMod).toBe(19);
      expect(weapon2.ammo).toBe(0);
      expect(weapon2.enCost).toBe(0);
      expect(weapon2.requiredMorale).toBe(105);
      expect(weapon2.adaptation.air).toBe(5); // A
      expect(weapon2.adaptation.ground).toBe(5); // A
      expect(weapon2.adaptation.water).toBe(5); // A
      expect(weapon2.adaptation.space).toBe(5); // A
      expect(weapon2.criticalMod).toBe(5);
      expect(weapon2.traits).toHaveLength(1);
      expect(weapon2.traits[0].code).toBe("武");
      expect(weapon2.requiredCondition).toBeInstanceOf(AndCondition);
      expect(
        (weapon2.requiredCondition as AndCondition)["conditions"]
      ).toHaveLength(0);
      expect(weapon2.requiredSkill).toHaveLength(0);

      // Weapon 3: ミサイル
      const weapon3 = unit1.weapons[2];
      expect(weapon3.name).toBe("ミサイル");
      expect(weapon3.attackPower).toBe(1400);
      expect(weapon3.minRange).toBe(1);
      expect(weapon3.maxRange).toBe(3);
      expect(weapon3.accuracyMod).toBe(5);
      expect(weapon3.ammo).toBe(6);
      expect(weapon3.enCost).toBe(20);
      expect(weapon3.requiredMorale).toBe(0);
      expect(weapon3.adaptation.air).toBe(5);
      expect(weapon3.adaptation.ground).toBe(5);
      expect(weapon3.adaptation.water).toBe(5);
      expect(weapon3.adaptation.space).toBe(5);
      expect(weapon3.criticalMod).toBe(-10);
      // Traits: Ｍ投L1 Ｐ 実
      expect(weapon3.traits).toHaveLength(3);
      expect(weapon3.traits[0].code).toBe("Ｍ投L1");
      expect(weapon3.traits[1].code).toBe("Ｐ");
      expect(weapon3.traits[2].code).toBe("実");

      expect(weapon3.requiredCondition).toBeInstanceOf(AndCondition);
      expect(
        (weapon3.requiredCondition as AndCondition)["conditions"]
      ).toHaveLength(0);
      expect(weapon3.requiredSkill).toHaveLength(0);

      // Abilities - test all properties
      expect(unit1.abilities.length).toBe(2);

      // Ability 1: 修理装置
      const ability1 = unit1.abilities[0];
      expect(ability1.name).toBe("修理装置");
      expect(ability1.minRange).toBe(0);
      expect(ability1.maxRange).toBe(1);
      expect(ability1.stock).toBe(5);
      expect(ability1.enCost).toBe(0);
      expect(ability1.requiredMorale).toBe(0);
      expect(ability1.traits).toHaveLength(0);
      expect(ability1.requiredCondition).toBeInstanceOf(AndCondition);
      expect(
        (ability1.requiredCondition as AndCondition)["conditions"]
      ).toHaveLength(0);
      expect(ability1.requiredSkill).toHaveLength(0);
      expect(ability1.effects.length).toBeGreaterThan(0);
      expect(ability1.effects[0].effectType).toBe("回復");
      expect(ability1.effects[0].effectLevel).toBe(3);

      // Ability 2: 補給装置
      const ability2 = unit1.abilities[1];
      expect(ability2.name).toBe("補給装置");
      expect(ability2.minRange).toBe(0);
      expect(ability2.maxRange).toBe(1);
      expect(ability2.stock).toBe(3);
      expect(ability2.enCost).toBe(0);
      expect(ability2.requiredMorale).toBe(105);
      expect(ability2.traits).toHaveLength(0);
      expect(ability2.requiredCondition).toBeInstanceOf(AndCondition);
      expect(
        (ability2.requiredCondition as AndCondition)["conditions"]
      ).toHaveLength(0);
      expect(ability2.requiredSkill).toHaveLength(0);
      expect(ability2.effects.length).toBeGreaterThan(0);
      expect(ability2.effects[0].effectType).toBe("補給");
    });

    // Test2
    it("Test2: should parse human unit with parentheses in class", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const humanUnit = result.data.find((u) => u.name === "人間ユニット");
      expect(humanUnit).toBeDefined();
      if (!humanUnit) return;

      expect(humanUnit.nickname).toBe("戦士");
      expect(humanUnit.kanaName).toBe("戦士"); // No kana specified, should default to nickname
      expect(humanUnit.unitClass).toBe("(戦士)");
      expect(humanUnit.size).toBe("SS");

      expect(humanUnit.weapons.length).toBe(2);
      expect(humanUnit.weapons[0].name).toBe("剣");
      expect(humanUnit.weapons[1].name).toBe("弓");
      expect(humanUnit.weapons[1].ammo).toBe(12);
    });
  });

  // ==========================================================================
  // 省略・最小パターン (テスト3, 4)
  // ==========================================================================
  describe("省略・最小パターン", () => {
    // Test3
    it("Test3: should parse unit with no features", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const simpleUnit = result.data.find((u) => u.name === "シンプルユニット");
      expect(simpleUnit).toBeDefined();
      if (!simpleUnit) return;

      expect(simpleUnit.features.length).toBe(0);
      expect(simpleUnit.weapons.length).toBe(1);
      expect(simpleUnit.abilities.length).toBe(0);
    });

    // Test4
    it("Test4: should parse minimal unit with no weapons and no abilities", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const minimalUnit = result.data.find((u) => u.name === "最小ユニット");
      expect(minimalUnit).toBeDefined();
      if (!minimalUnit) return;

      expect(minimalUnit.weapons.length).toBe(0);
      expect(minimalUnit.abilities.length).toBe(0);
    });
  });

  // ==========================================================================
  // 複合・特殊データパターン (テスト5)
  // ==========================================================================
  describe("複合・特殊データパターン", () => {
    // Test5
    it("Test5: should parse unit with multiple movement types", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const multiUnit = result.data.find((u) => u.name === "複合ユニット");
      expect(multiUnit).toBeDefined();
      if (!multiUnit) return;

      expect(multiUnit.movementType).toBe("空陸水");
    });
  });

  // ==========================================================================
  // 行継続パターン (テスト6)
  // ==========================================================================
  describe("行継続パターン", () => {
    // Test6
    it("Test6: should handle line continuation with underscore (Test 6 - weapons)", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const longUnit = result.data.find((u) => u.name === "長名称ユニット");
      expect(longUnit).toBeDefined();
      if (!longUnit) return;

      // Weapon with multiline traits
      const longRangeWeapon = longUnit.weapons.find(
        (w) => w.name === "超長射程ビーム砲"
      );
      expect(longRangeWeapon).toBeDefined();
      if (!longRangeWeapon) return;

      expect(longRangeWeapon.traits).toHaveLength(4);
      expect(longRangeWeapon.traits[0].code).toBe("Ｂ");
      expect(longRangeWeapon.traits[1].code).toBe("Ｐ");
      expect(longRangeWeapon.traits[2].code).toBe("Ｈ");
      expect(longRangeWeapon.traits[3].code).toBe("有");
    });
  });

  // ==========================================================================
  // 武器・アビリティの条件とスキル要件 (テスト14, 15)
  // ==========================================================================
  describe("武器・アビリティの条件とスキル要件", () => {
    // Test14
    it("Test14: should parse required skills and conditions for weapons", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.name === "武器条件テスト");
      expect(unit).toBeDefined();
      if (!unit) return;

      expect(unit.weapons.length).toBe(3);

      // Required skill only: 念動斬り
      const weapon1 = unit.weapons.find((w) => w.name === "念動斬り");
      expect(weapon1).toBeDefined();
      if (weapon1) {
        expect(weapon1.requiredSkill).toHaveLength(1);
        expect(weapon1.requiredSkill[0].skillName).toBe("念力");
        expect(weapon1.requiredSkill[0].level).toBe(3);
        expect(weapon1.requiredCondition).toBeInstanceOf(AndCondition);
        expect(
          (weapon1.requiredCondition as AndCondition)["conditions"]
        ).toHaveLength(0);
      }

      // Required condition only: ドリルアタック
      const weapon2 = unit.weapons.find((w) => w.name === "ドリルアタック");
      expect(weapon2).toBeDefined();
      if (weapon2) {
        expect(weapon2.requiredSkill).toHaveLength(0);
        expect(weapon2.requiredCondition).toBeInstanceOf(AtomCondition);
        expect((weapon2.requiredCondition as AtomCondition).text).toBe(
          "母艦3マス以内"
        );
      }

      // Both: 森林剣
      const weapon3 = unit.weapons.find((w) => w.name === "森林剣");
      expect(weapon3).toBeDefined();
      if (weapon3) {
        expect(weapon3.requiredCondition).toBeInstanceOf(OrCondition);
        const conds = (weapon3.requiredCondition as OrCondition)["conditions"];
        expect(conds).toHaveLength(2);
        expect((conds[0] as AtomCondition).text).toBe("@森");
        expect((conds[1] as AtomCondition).text).toBe("@林");

        expect(weapon3.requiredSkill).toHaveLength(1);
        expect(weapon3.requiredSkill[0].skillName).toBe("剣技");
        expect(weapon3.requiredSkill[0].level).toBe(2);
      }
    });

    // Test15
    it("Test15: should parse required skills and conditions for unit abilities", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.name === "アビリティ条件テスト");
      expect(unit).toBeDefined();
      if (!unit) return;

      expect(unit.abilities.length).toBe(3);

      // Required skill only: 癒しの光
      const ability1 = unit.abilities.find((a) => a.name === "癒しの光");
      expect(ability1).toBeDefined();
      if (ability1) {
        expect(ability1.requiredSkill).toHaveLength(1);
        expect(ability1.requiredSkill[0].skillName).toBe("術");
        expect(ability1.requiredSkill[0].level).toBe(3);
        expect(ability1.requiredCondition).toBeInstanceOf(AndCondition);
        expect(
          (ability1.requiredCondition as AndCondition)["conditions"]
        ).toHaveLength(0);
      }

      // Required condition only: 森林浴
      const ability2 = unit.abilities.find((a) => a.name === "森林浴");
      expect(ability2).toBeDefined();
      if (ability2) {
        expect(ability2.requiredSkill).toHaveLength(0);
        expect(ability2.requiredCondition).toBeInstanceOf(OrCondition);
        const conds = (ability2.requiredCondition as OrCondition)["conditions"];
        expect(conds).toHaveLength(2);
        expect((conds[0] as AtomCondition).text).toBe("@森");
        expect((conds[1] as AtomCondition).text).toBe("@林");
      }

      // Both: 森のカーニバル
      const ability3 = unit.abilities.find((a) => a.name === "森のカーニバル");
      expect(ability3).toBeDefined();
      if (ability3) {
        expect(ability3.requiredCondition).toBeInstanceOf(OrCondition);
        const conds = (ability3.requiredCondition as OrCondition)["conditions"];
        expect(conds).toHaveLength(2);
        expect((conds[0] as AtomCondition).text).toBe("@森");
        expect((conds[1] as AtomCondition).text).toBe("@林");

        expect(ability3.requiredSkill).toHaveLength(1);
        expect(ability3.requiredSkill[0].skillName).toBe("術");
        expect(ability3.requiredSkill[0].level).toBe(4);
      }
    });
  });

  // ==========================================================================
  // 複雑な条件式パターン (テスト16)
  // ==========================================================================
  describe("複雑な条件式パターン", () => {
    // Test16
    it("Test16: should parse complex condition expressions", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.name === "複雑条件");
      expect(unit).toBeDefined();
      if (!unit) return;

      expect(unit.features.length).toBe(2);

      // 地形適応 with multiple terrain names (not defined in FEATURES)
      const terrainFeature = unit.features[0];
      if (terrainFeature) {
        expect(terrainFeature.spec.name).toBe("地形適応");
        expect(terrainFeature.level).toBeUndefined();
        expect(terrainFeature.displayName).toBe("森林戦仕様");
        expect(terrainFeature.rawParameters).toHaveLength(2);
        expect(terrainFeature.rawParameters![0]).toBe("森");
        expect(terrainFeature.rawParameters![1]).toBe("林");
      }

      // 追加移動力 with complex condition: <@森 or @林 地上>
      const movementFeature = unit.features[1];
      if (movementFeature) {
        expect(movementFeature.spec.name).toBe("追加移動力");
        expect(movementFeature.level).toBe(2);
        // @森 or @林 地上 -> And(Or(@森, @林), 地上)
        expect(movementFeature.requiredCondition).toBeInstanceOf(AndCondition);
        const conds = (movementFeature.requiredCondition as AndCondition)[
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
      expect(unit.weapons.length).toBe(1);
      const weapon = unit.weapons[0];
      expect(weapon.name).toBe("森林砲");

      expect(weapon.requiredCondition).toBeInstanceOf(AndCondition);
      const wConds = (weapon.requiredCondition as AndCondition)["conditions"];
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
