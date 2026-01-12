import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { FEATURES } from "../../models/features/definitions";
import { parseUnitFile } from "../../parsers/unitParser";
import { decodeShiftJIS } from "../../parsers/utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("Unit Parser", () => {
  const fixturesPath = join(__dirname, "fixtures");
  const sampleUnitText = decodeShiftJIS(
    readFileSync(join(fixturesPath, "sample_unit.txt"))
  );

  describe("parseUnitFile", () => {
    // Test7
    it("Test7: should parse features with description (解説) definition", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.name === "解説ユニット");
      expect(unit).toBeDefined();
      if (!unit) return;

      // Unit basic properties
      expect(unit.nickname).toBe("解説テスト");
      expect(unit.unitClass).toBe("説明機");

      // Should have 1 feature: custom ability (description definition consumed)
      expect(unit.features.length).toBe(1);

      // Custom ability with alias (カスタム能力 is not defined in FEATURES)
      expect(unit.features[0].spec).toBe(FEATURES.DummyForUnit);
      expect(unit.features[0].name).toBe("カスタム能力");
      expect(unit.features[0].level).toBe(3);
      expect(unit.features[0].displayName).toBe("特殊スキル");
      expect(unit.features[0].description).toBe(
        "特別な訓練により習得した独自の戦闘技術"
      );
      expect(unit.features[0].rawParameters).toBeUndefined();

      // Weapon
      expect(unit.weapons.length).toBe(1);
      const weapon = unit.weapons[0];
      expect(weapon.name).toBe("標準武器");
      expect(weapon.attackPower).toBe(1200);
      expect(weapon.minRange).toBe(1);
      expect(weapon.maxRange).toBe(2);
      expect(weapon.enCost).toBe(25);
    });

    // Test8
    it("Test8: should handle line continuation with underscore in feature (Test 8)", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.name === "改行テスト");
      expect(unit).toBeDefined();
      if (!unit) return;

      expect(unit.features.length).toBe(1);
      const feature = unit.features[0];
      // 超回避 is defined in FEATURES
      expect(feature.spec.name).toBe("超回避");
      expect(feature.level).toBe(5);
      expect(feature.displayName).toBe("残像");
      expect(feature.description).toBe(
        "気力140以上で発動し、敵の命中率を大幅に下げる高速回避能力"
      );
      expect(feature.rawParameters).toHaveLength(2);
      expect(feature.rawParameters![0]).toBe("10");
      expect(feature.rawParameters![1]).toBe("140");
    });

    // Test12
    it("Test12: should parse dummy features with various formats including quoted comma", () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      const unit = result.data.find((u) => u.name === "ダミー能力");
      expect(unit).toBeDefined();
      if (!unit) return;

      expect(unit.features).toHaveLength(4);

      // カスタム能力 with alias
      const customFeature = unit.features[0];
      if (customFeature) {
        expect(customFeature.spec).toBe(FEATURES.DummyForUnit);
        expect(customFeature.name).toBe("カスタム能力");
        expect(customFeature.displayName).toBe("特殊スキル");
        expect(customFeature.level).toBe(3);
        expect(customFeature.rawParameters).toBeUndefined();
        expect(customFeature.description).toBe(
          "特別な訓練により習得した独自の戦闘技術"
        );
      }

      // Dummy ability 1: Basic format
      const dummy1 = unit.features[1];
      if (dummy1) {
        expect(dummy1.spec).toBe(FEATURES.DummyForUnit);
        expect(dummy1.name).toBe("守護聖霊");
        expect(dummy1.displayName).toBe("風の聖霊シルフ");
        expect(dummy1.description).toBe("風の属性を持つ攻撃に対して耐性を持つ");
        expect(dummy1.rawParameters).toBeUndefined();
      }

      // Dummy ability 2: With quoted comma (exact match test)
      // Quoted string should be a single element
      const dummy2 = unit.features[2];
      if (dummy2) {
        expect(dummy2.spec).toBe(FEATURES.DummyForUnit);
        expect(dummy2.name).toBe("守護聖霊2");
        expect(dummy2.displayName).toBe("水の聖霊ウンディーネ");
        expect(dummy2.description).toBe(
          "水の属性を持つ攻撃に対して耐性を持ち、火系攻撃に弱い"
        );
        expect(dummy2.rawParameters).toBeUndefined();
      }

      // Dummy ability 3: With comma in description (exact match test)
      // Quoted string with commas should be preserved as a single element
      const dummy3 = unit.features[3];
      if (dummy3) {
        expect(dummy3.spec).toBe(FEATURES.DummyForUnit);
        expect(dummy3.name).toBe("守護聖霊3");
        expect(dummy3.displayName).toBe("大地の聖霊ノーム");
        expect(dummy3.description).toBe(
          "大地, 土, 岩の属性に強く, 風系攻撃に弱い"
        );
        expect(dummy3.rawParameters).toBeUndefined();
      }
    });
  });
});
