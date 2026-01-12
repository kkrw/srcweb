import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  AndCondition,
  AtomCondition,
  OrCondition,
} from "../../models/Condition";
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
    // 取り込みが成功すること
    it("should successfully parse valid unit data", () => {
      const result = parseUnitFile(sampleUnitText);

      expect(result.success).toBe(true);
      if (!result.success) {
        throw new Error(`Parse failed: ${result.error.message}`);
      }

      // Test7
      it("Test7: should parse special ability with description (解説) definition", () => {
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

      // Test9
      it("Test9: should parse multiple abilities in one line", () => {
        const result = parseUnitFile(sampleUnitText);

        if (!result.success) {
          throw new Error(`Parse failed: ${result.error.message}`);
        }

        const unit = result.data.find((u) => u.name === "複数能力１行");
        expect(unit).toBeDefined();
        if (!unit) return;

        expect(unit.features).toHaveLength(2);
        const feat1 = unit.features[0];
        expect(feat1.spec.name).toBe("霊力変換器");
        expect(feat1.displayName).toBeUndefined();
        expect(feat1.level).toBe(100);
        expect(feat1.description).toBeUndefined();
        expect(feat1.rawParameters).toBeUndefined();
        expect(feat1.requiredCondition).toBeInstanceOf(AndCondition);
        expect(
          (feat1.requiredCondition as AndCondition)["conditions"]
        ).toHaveLength(0);
        expect(feat1.requiredSkill).toHaveLength(0);
        expect(feat1.showLevel).toBe(true);
        expect(feat1.visible).toBe(true);

        const feat2 = unit.features[1];
        expect(feat2.spec.name).toBe("ＨＰ回復");
        expect(feat2.displayName).toBeUndefined();
        expect(feat2.level).toBe(2);
        expect(feat2.description).toBeUndefined();
        expect(feat2.rawParameters).toBeUndefined();
        expect(feat2.requiredCondition).toBeInstanceOf(AndCondition);
        expect(
          (feat2.requiredCondition as AndCondition)["conditions"]
        ).toHaveLength(0);
        expect(feat2.requiredSkill).toHaveLength(0);
        expect(feat2.showLevel).toBe(true);
        expect(feat2.visible).toBe(true);
      });

      // Test10
      it("Test10: should parse negative and zero level abilities", () => {
        const result = parseUnitFile(sampleUnitText);

        if (!result.success) {
          throw new Error(`Parse failed: ${result.error.message}`);
        }

        const unit = result.data.find((u) => u.name === "レベル指定");
        expect(unit).toBeDefined();
        if (!unit) return;

        expect(unit.features.length).toBe(2);
        const feature1 = unit.features[0];
        if (feature1) {
          expect(feature1.spec.name).toBe("ＨＰ回復");
          expect(feature1.level).toBe(-1);
        }
        const feature2 = unit.features[1];
        if (feature2) {
          expect(feature2.spec.name).toBe("ＥＮ回復");
          expect(feature2.level).toBe(0);
        }
      });

      // Test11
      it("Test11: should parse hidden ability and space-separated options", () => {
        const result = parseUnitFile(sampleUnitText);

        if (!result.success) {
          throw new Error(`Parse failed: ${result.error.message}`);
        }

        const unit = result.data.find((u) => u.name === "非表示・オプション");
        expect(unit).toBeDefined();
        if (!unit) return;

        expect(unit.features.length).toBe(2);
        const hiddenFeature = unit.features[0];
        if (hiddenFeature) {
          expect(hiddenFeature.spec.name).toBe("ホバー移動");
          expect(hiddenFeature.displayName).toBeUndefined();
          expect(hiddenFeature.visible).toBe(false);
          expect(hiddenFeature.rawParameters).toBeUndefined();
        }
        const barrierFeature = unit.features[1];
        if (barrierFeature) {
          expect(barrierFeature.spec.name).toBe("バリア");
          expect(barrierFeature.level).toBe(1);
          expect(barrierFeature.displayName).toBe("念動バリア");
          expect(barrierFeature.rawParameters).toHaveLength(2);
          expect(barrierFeature.rawParameters![0]).toBe("全");
          expect(barrierFeature.rawParameters![1]).toBe("10");
        }
      });

      // Test12
      it("Test12: should parse dummy abilities with various formats including quoted comma", () => {
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
          expect(dummy1.description).toBe(
            "風の属性を持つ攻撃に対して耐性を持つ"
          );
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

      // Test13
      it("Test13: should parse required skills and conditions for abilities", () => {
        const result = parseUnitFile(sampleUnitText);

        if (!result.success) {
          throw new Error(`Parse failed: ${result.error.message}`);
        }

        const unit = result.data.find((u) => u.name === "必要技能テスト");
        expect(unit).toBeDefined();
        if (!unit) return;

        expect(unit.features.length).toBe(3);

        // Required skill only: バリアLv2=念動バリア 全 10 (念力Lv3)
        const barrierFeature = unit.features[0];
        if (barrierFeature) {
          expect(barrierFeature.spec.name).toBe("バリア");
          expect(barrierFeature.requiredSkill).toHaveLength(1);
          expect(barrierFeature.requiredSkill![0].skillName).toBe("念力");
          expect(barrierFeature.requiredSkill![0].level).toBe(3);
          expect(barrierFeature.requiredCondition).toBeInstanceOf(AndCondition);
          expect(
            (barrierFeature.requiredCondition as AndCondition)["conditions"]
          ).toHaveLength(0);
        }

        // Required condition only: ステルス=狩人 <@森 or @林>
        const stealthFeature = unit.features[1];
        if (stealthFeature) {
          expect(stealthFeature.spec.name).toBe("ステルス");
          expect(stealthFeature.requiredSkill).toHaveLength(0);
          // @森 or @林 -> OrCondition with [Atom(@森), Atom(@林)]
          expect(stealthFeature.requiredCondition).toBeInstanceOf(OrCondition);
          const conds = (stealthFeature.requiredCondition as OrCondition)[
            "conditions"
          ];
          expect(conds).toHaveLength(2);
          expect((conds[0] as AtomCondition).text).toBe("@森");
          expect((conds[1] as AtomCondition).text).toBe("@林");
        }

        // Both: ＺＯＣ=砂地獄 <地上> (土遁の術Lv4)
        const zocFeature = unit.features[2];
        if (zocFeature) {
          // "地上" -> AtomCondition
          expect(zocFeature.spec.name).toBe("ＺＯＣ");
          expect(zocFeature.requiredCondition).toBeInstanceOf(AtomCondition);
          expect((zocFeature.requiredCondition as AtomCondition).text).toBe(
            "地上"
          );

          expect(zocFeature.requiredSkill).toHaveLength(1);
          expect(zocFeature.requiredSkill![0].skillName).toBe("土遁の術");
          expect(zocFeature.requiredSkill![0].level).toBe(4);
        }
      });
    });
  });
});
