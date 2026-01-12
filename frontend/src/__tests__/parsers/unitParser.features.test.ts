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
  const sampleUnitText = decodeShiftJIS(
    readFileSync(join(fixturesPath, "sample_unit.txt"))
  );

  describe("parseUnitFile", () => {
    // Test9
    it("Test9: should parse multiple features in one line", () => {
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
    it("Test11: should parse hidden feature and space-separated options", () => {
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

    // Test13
    it("Test13: should parse required skills and conditions for features", () => {
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
