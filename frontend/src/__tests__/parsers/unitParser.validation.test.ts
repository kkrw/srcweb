import { readFileSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import { parseUnitFile } from "../../parsers/unitParser";
import { ParseError } from "../../parsers/utils";

const fixturesDir = join(__dirname, "fixtures");

describe("Unit Parser - Validation Tests", () => {
  describe("Fatal Errors", () => {
    // Test1
    it("Test1: should fail on unit name with half-width space and provide detailed error", () => {
      const text = readFileSync(
        join(fixturesDir, "invalid_unit_errors", "01_name_with_space.txt"),
        "utf-8"
      );
      const result = parseUnitFile(text, "01_name_with_space.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain("半角スペース");
        expect(parseError.lineNumber).toBeGreaterThan(0);
        expect(parseError.lineContent).toContain("Invalid Name");
      }
    });

    // Test2
    it("Test2: should fail on unit name with full-width parentheses and provide detailed error", () => {
      const text = readFileSync(
        join(
          fixturesDir,
          "invalid_unit_errors",
          "02_name_with_fullwidth_paren.txt"
        ),
        "utf-8"
      );
      const result = parseUnitFile(text, "02_name_with_fullwidth_paren.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain("全角括弧");
        expect(parseError.lineNumber).toBeGreaterThan(0);
        expect(parseError.lineContent).toContain("（");
      }
    });

    // Test3
    it("Test3: should fail on unit name with double quote and provide detailed error", () => {
      const text = readFileSync(
        join(fixturesDir, "invalid_unit_errors", "03_name_with_quote.txt"),
        "utf-8"
      );
      const result = parseUnitFile(text, "03_name_with_quote.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toMatch(/".*使用/);
        expect(parseError.lineNumber).toBeGreaterThan(0);
        expect(parseError.lineContent).toContain('"');
      }
    });

    // Test4
    it("Test4: should fail on insufficient commas in params line and provide detailed error", () => {
      const text = readFileSync(
        join(fixturesDir, "invalid_unit_errors", "04_insufficient_commas.txt"),
        "utf-8"
      );
      const result = parseUnitFile(text, "04_insufficient_commas.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toMatch(/抜け/);
        expect(parseError.lineNumber).toBeGreaterThan(0);
      }
    });

    // Test5
    it("Test5: should fail on too many commas in params line and provide detailed error", () => {
      const text = readFileSync(
        join(fixturesDir, "invalid_unit_errors", "05_too_many_commas.txt"),
        "utf-8"
      );
      const result = parseUnitFile(text, "05_too_many_commas.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toMatch(/余分/);
        expect(parseError.lineNumber).toBeGreaterThan(0);
      }
    });

    // Test6
    it("Test6: should fail on missing movement parameters and provide detailed error", () => {
      const text = readFileSync(
        join(
          fixturesDir,
          "invalid_unit_errors",
          "06_missing_movement_params.txt"
        ),
        "utf-8"
      );
      const result = parseUnitFile(text, "06_missing_movement_params.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toMatch(/抜け/);
        expect(parseError.lineNumber).toBeGreaterThan(0);
      }
    });

    // Test7
    it("Test7: should fail on missing stats parameters and provide detailed error", () => {
      const text = readFileSync(
        join(fixturesDir, "invalid_unit_errors", "07_missing_stats_params.txt"),
        "utf-8"
      );
      const result = parseUnitFile(text, "07_missing_stats_params.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toMatch(/抜け/);
        expect(parseError.lineNumber).toBeGreaterThan(0);
      }
    });

    // Test8
    it("Test8: should fail on missing ability section and provide detailed error", () => {
      const text = readFileSync(
        join(
          fixturesDir,
          "invalid_unit_errors",
          "08_missing_ability_section.txt"
        ),
        "utf-8"
      );
      const result = parseUnitFile(text, "08_missing_ability_section.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toMatch(/特殊能力/);
        expect(parseError.lineNumber).toBeGreaterThan(0);
      }
    });

    // Test9
    it("Test9: should fail on missing weapon parameters and provide detailed error", () => {
      const text = readFileSync(
        join(
          fixturesDir,
          "invalid_unit_errors",
          "09_missing_weapon_params.txt"
        ),
        "utf-8"
      );
      const result = parseUnitFile(text, "09_missing_weapon_params.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toMatch(/抜け/);
        expect(parseError.lineNumber).toBeGreaterThan(0);
      }
    });

    // Test10
    it("Test10: should fail on missing ability parameters and provide detailed error", () => {
      const text = readFileSync(
        join(
          fixturesDir,
          "invalid_unit_errors",
          "10_missing_ability_params.txt"
        ),
        "utf-8"
      );
      const result = parseUnitFile(text, "10_missing_ability_params.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toMatch(/抜け/);
        expect(parseError.lineNumber).toBeGreaterThan(0);
      }
    });
  });

  describe("Warnings (Non-Fatal Errors)", () => {
    it("should parse with warnings for invalid values", () => {
      const text = readFileSync(
        join(fixturesDir, "invalid_unit_warnings.txt"),
        "utf-8"
      );
      const result = parseUnitFile(text, "invalid_unit_warnings.txt");

      expect(result.success).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings!.length).toBeGreaterThan(0);

      if (result.success) {
        // All units should be parsed despite warnings
        expect(result.data.length).toBeGreaterThan(30);

        // Verify warnings contain file path
        result.warnings!.forEach((warning) => {
          expect(warning).toContain("invalid_unit_warnings.txt");
        });
      }
    });

    it("should apply default values for invalid numeric unit class", () => {
      const text = readFileSync(
        join(fixturesDir, "invalid_unit_warnings.txt"),
        "utf-8"
      );
      const result = parseUnitFile(text, "invalid_unit_warnings.txt");

      if (result.success) {
        const unit = result.data.find((u) => u.Name === "数値クラス");
        expect(unit).toBeDefined();
        if (unit) {
          expect(unit.UnitClass).toBe("汎用"); // Default value
        }

        // Verify specific warning exists
        const classWarning = result.warnings?.find((w) =>
          w.includes("数値クラス")
        );
        expect(classWarning).toBeDefined();
        expect(classWarning).toContain("ユニットクラス");
      }
    });

    it("should apply default values for invalid size", () => {
      const text = readFileSync(
        join(fixturesDir, "invalid_unit_warnings.txt"),
        "utf-8"
      );
      const result = parseUnitFile(text, "invalid_unit_warnings.txt");

      if (result.success) {
        const unit = result.data.find((u) => u.Name === "無効サイズ");
        expect(unit).toBeDefined();
        if (unit) {
          expect(unit.Size).toBe("M"); // Default value
        }

        // Verify specific warning exists
        const sizeWarning = result.warnings?.find((w) =>
          w.includes("無効サイズ")
        );
        expect(sizeWarning).toBeDefined();
        expect(sizeWarning).toContain("サイズ");
      }
    });

    it("should handle invalid pilot capacity with warning", () => {
      const text = readFileSync(
        join(fixturesDir, "invalid_unit_warnings.txt"),
        "utf-8"
      );
      const result = parseUnitFile(text, "invalid_unit_warnings.txt");

      if (result.success) {
        const unit = result.data.find((u) => u.Name === "非数値パイロット");
        expect(unit).toBeDefined();
        if (unit) {
          expect(unit.PilotCapacity).toBe(1); // Default value
        }

        const warning = result.warnings?.find((w) =>
          w.includes("非数値パイロット")
        );
        expect(warning).toBeDefined();
        expect(warning).toContain("パイロット数");
      }
    });
  });

  describe("Boundary Value Tests", () => {
    const boundaryText = readFileSync(
      join(fixturesDir, "boundary_unit.txt"),
      "utf-8"
    );

    it("should accept minimum values", () => {
      const result = parseUnitFile(boundaryText, "boundary_unit.txt");

      expect(result.success).toBe(true);
      if (result.success) {
        const unit = result.data.find((u) => u.Name === "最小値");
        expect(unit).toBeDefined();
        if (unit) {
          expect(unit.Speed).toBe(0);
          expect(unit.HP).toBe(0);
          expect(unit.EN).toBe(0);
          expect(unit.Armor).toBe(0);
          expect(unit.Mobility).toBe(0);

          if (unit.Weapons.length > 0) {
            const weapon = unit.Weapons[0];
            expect(weapon.AttackPower).toBe(0);
            expect(weapon.MinRange).toBe(1);
            expect(weapon.MaxRange).toBe(1);
            expect(weapon.AccuracyMod).toBe(-999);
            expect(weapon.CriticalMod).toBe(-999);
          }

          if (unit.Abilities.length > 0) {
            const ability = unit.Abilities[0];
            expect(ability.MaxRange).toBe(0);
            expect(ability.Stock).toBe(0);
            expect(ability.ENCost).toBe(0);
            expect(ability.RequiredMorale).toBe(0);
          }
        }
      }
    });

    it("should accept maximum values", () => {
      const result = parseUnitFile(boundaryText, "boundary_unit.txt");

      expect(result.success).toBe(true);
      if (result.success) {
        const unit = result.data.find((u) => u.Name === "最大値");
        expect(unit).toBeDefined();
        if (unit) {
          expect(unit.PilotCapacity).toBe(99);
          expect(unit.NumItemSlots).toBe(99);
          expect(unit.Speed).toBe(99);
          expect(unit.HP).toBe(9999999);
          expect(unit.EN).toBe(9999);
          expect(unit.Armor).toBe(99999);
          expect(unit.Mobility).toBe(9999);

          if (unit.Weapons.length > 0) {
            const weapon = unit.Weapons[0];
            expect(weapon.AttackPower).toBe(99999);
            expect(weapon.MaxRange).toBe(99);
            expect(weapon.AccuracyMod).toBe(999);
            expect(weapon.Ammo).toBe(99);
            expect(weapon.ENCost).toBe(999);
            expect(weapon.RequiredMorale).toBe(1000);
            expect(weapon.CriticalMod).toBe(999);
          }

          if (unit.Abilities.length > 0) {
            const ability = unit.Abilities[0];
            expect(ability.MaxRange).toBe(99);
            expect(ability.Stock).toBe(99);
            expect(ability.ENCost).toBe(999);
            expect(ability.RequiredMorale).toBe(1000);
          }
        }
      }
    });

    it("should clamp over-maximum values", () => {
      const result = parseUnitFile(boundaryText, "boundary_unit.txt");

      expect(result.success).toBe(true);
      if (result.success) {
        const unit = result.data.find((u) => u.Name === "超過最大値");
        expect(unit).toBeDefined();
        if (unit) {
          expect(unit.PilotCapacity).toBe(99);
          expect(unit.NumItemSlots).toBe(99);
          expect(unit.Speed).toBe(99);
          expect(unit.HP).toBe(9999999);
          expect(unit.EN).toBe(9999);
          expect(unit.Armor).toBe(99999);
          expect(unit.Mobility).toBe(9999);

          if (unit.Weapons.length > 0) {
            const weapon = unit.Weapons[0];
            expect(weapon.AttackPower).toBe(99999);
            expect(weapon.MaxRange).toBe(99);
            expect(weapon.Ammo).toBe(99);
            expect(weapon.ENCost).toBe(999);
            expect(weapon.RequiredMorale).toBe(1000);
          }

          if (unit.Abilities.length > 0) {
            const ability = unit.Abilities[0];
            expect(ability.MaxRange).toBe(99);
            expect(ability.Stock).toBe(99);
            expect(ability.ENCost).toBe(999);
            expect(ability.RequiredMorale).toBe(1000);
          }
        }
      }
    });

    it("should handle negative values in allowed fields", () => {
      const result = parseUnitFile(boundaryText, "boundary_unit.txt");

      expect(result.success).toBe(true);
      if (result.success) {
        const unit = result.data.find((u) => u.Name === "負数許可");
        expect(unit).toBeDefined();
        if (unit && unit.Weapons.length > 0) {
          expect(unit.Weapons[0].AccuracyMod).toBe(-500);
          expect(unit.Weapons[0].CriticalMod).toBe(-500);
        }
      }
    });

    it("should accept all valid sizes", () => {
      const result = parseUnitFile(boundaryText, "boundary_unit.txt");

      expect(result.success).toBe(true);
      if (result.success) {
        const sizes = ["SS", "S", "M", "L", "LL", "XL"];
        const units = result.data.filter((u) =>
          [
            "最小値",
            "最大値",
            "未満最小値範囲",
            "負数許可",
            "全サイズ",
            "超過最大値",
          ].includes(u.Name)
        );
        const foundSizes = units.map((u) => u.Size);
        sizes.forEach((size) => {
          expect(foundSizes).toContain(size);
        });
      }
    });

    it("should accept all adaptation ranks", () => {
      const result = parseUnitFile(boundaryText, "boundary_unit.txt");

      expect(result.success).toBe(true);
      if (result.success) {
        const unit = result.data.find((u) => u.Name === "全地形適応");
        expect(unit).toBeDefined();
        if (unit) {
          expect(unit.Adaptation).toMatch(/[-EDCBAS]/);
          if (unit.Weapons.length > 0) {
            unit.Weapons.forEach((weapon) => {
              expect(weapon.Adaptation).toMatch(/[-EDCBAS]/);
            });
          }
        }
      }
    });

    it("should round decimal values for all integer fields using Math.round", () => {
      const result = parseUnitFile(boundaryText, "boundary_unit.txt");

      expect(result.success).toBe(true);
      if (result.success) {
        const unit = result.data.find((u) => u.Name === "実数値");
        expect(unit).toBeDefined();
        if (unit) {
          // Unit integer fields
          expect(unit.Speed).toBe(5); // 4.5 → 5
          expect(unit.HP).toBe(2001); // 2000.5 → 2001
          expect(unit.EN).toBe(101); // 100.7 → 101
          expect(unit.Armor).toBe(800); // 800.3 → 800
          expect(unit.Mobility).toBe(81); // 80.9 → 81
          expect(unit.Cost).toBe(2001); // 2000.5 → 2001
          expect(unit.ExpValue).toBe(51); // 50.5 → 51

          // Weapon integer fields
          if (unit.Weapons.length > 0) {
            const weapon = unit.Weapons[0];
            expect(weapon.Name).toBe("実数武器");
            expect(weapon.AttackPower).toBe(1000); // 1000.4 → 1000
            expect(weapon.MinRange).toBe(2); // 1.5 → 2
            expect(weapon.MaxRange).toBe(2); // 1.5 → 2
            expect(weapon.AccuracyMod).toBe(5); // +5 (no decimal)
            expect(weapon.Ammo).toBe(11); // 10.6 → 11
            expect(weapon.ENCost).toBe(30); // 30.2 → 30
            expect(weapon.RequiredMorale).toBe(111); // 110.5 → 111
            expect(weapon.CriticalMod).toBe(11); // +10.5 → 11
            // "気L1.4" is stored in Traits (not RequiredSkill, as it's not in parentheses)
            expect(weapon.Traits).toBe("気L1.4");
            expect(weapon.RequiredSkill).toBe("");
          }

          // Ability integer fields
          if (unit.Abilities.length > 0) {
            const ability = unit.Abilities[0];
            expect(ability.Name).toBe("実数アビリティ");
            expect(ability.MaxRange).toBe(6); // 5.8 → 6
            expect(ability.Stock).toBe(10); // 10.3 → 10
            expect(ability.ENCost).toBe(51); // 50.7 → 51
            expect(ability.RequiredMorale).toBe(120); // 120.1 → 120
            // "気L1.4" is stored in Traits (not RequiredSkill)
            expect(ability.Traits).toBe("気L1.4");
            expect(ability.RequiredSkill).toBe("");
          }
        }
      }
    });

    it("should generate specific warnings for each integer field with decimal values", () => {
      const result = parseUnitFile(boundaryText, "boundary_unit.txt");

      expect(result.success).toBe(true);
      expect(result.warnings).toBeDefined();

      // Unit field warnings (now using actual file line numbers with new implementation)
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数値: 移動力に実数値が指定されたため、整数に変換されました（4.5 → 5）。 (行83)")
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数値: 修理費に実数値が指定されたため、整数に変換されました（2000.5 → 2001）。 (行83)")
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数値: 経験値に実数値が指定されたため、整数に変換されました（50.5 → 51）。 (行83)")
      );

      // Unit stats warnings
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数値: HPに実数値が指定されたため、整数に変換されました（2000.5 → 2001）。 (行87)")
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数値: ENに実数値が指定されたため、整数に変換されました（100.7 → 101）。 (行87)")
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数値: 装甲に実数値が指定されたため、整数に変換されました（800.3 → 800）。 (行87)")
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数値: 運動性に実数値が指定されたため、整数に変換されました（80.9 → 81）。 (行87)")
      );

      // Weapon field warnings
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数武器の攻撃力に実数値が指定されたため、整数に変換されました（1000.4 → 1000）。 (行89)")
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数武器の最小射程に実数値が指定されたため、整数に変換されました（1.5 → 2）。 (行89)")
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数武器の最大射程に実数値が指定されたため、整数に変換されました（1.5 → 2）。 (行89)")
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数武器の弾数に実数値が指定されたため、整数に変換されました（10.6 → 11）。 (行89)")
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数武器の消費ENに実数値が指定されたため、整数に変換されました（30.2 → 30）。 (行89)")
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数武器の必要気力に実数値が指定されたため、整数に変換されました（110.5 → 111）。 (行89)")
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数武器のクリティカル率に実数値が指定されたため、整数に変換されました（+10.5 → 11）。 (行89)")
      );

      // Ability field warnings
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数アビリティの射程に実数値が指定されたため、整数に変換されました（5.8 → 6）。 (行91)")
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数アビリティの回数に実数値が指定されたため、整数に変換されました（10.3 → 10）。 (行91)")
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数アビリティの消費ENに実数値が指定されたため、整数に変換されました（50.7 → 51）。 (行91)")
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining("実数アビリティの必要気力に実数値が指定されたため、整数に変換されました（120.1 → 120）。 (行91)")
      );
    });

    it("should keep decimal values for float fields (Feature.Level, AbilityEffect.EffectLevel) WITHOUT warnings", () => {
      const result = parseUnitFile(boundaryText, "boundary_unit.txt");

      expect(result.success).toBe(true);

      const unit = result.data.find((u) => u.Name === "実数値");
      expect(unit).toBeDefined();

      if (unit) {
        // Feature.Level should keep decimals
        const shieldFeature = unit.Features.find((f) => f.Name === "シールド");
        expect(shieldFeature).toBeDefined();
        if (shieldFeature) {
          expect(shieldFeature.Level).toBe(3.7); // シールドLv3.7
        }

        const hpRecoveryFeature = unit.Features.find((f) =>
          f.Name.includes("ＨＰ回復")
        );
        expect(hpRecoveryFeature).toBeDefined();
        if (hpRecoveryFeature) {
          expect(hpRecoveryFeature.Level).toBe(2.3); // ＨＰ回復Lv2.3
        }

        // AbilityEffect.EffectLevel should keep decimals
        if (unit.Abilities.length > 0) {
          const ability = unit.Abilities[0];
          expect(ability.Effects).toBeDefined();
          expect(ability.Effects.length).toBeGreaterThan(0);

          const healEffect = ability.Effects.find((e) => e.EffectType === "回復");
          if (healEffect) {
            expect(healEffect.EffectLevel).toBe(2.8); // 回復Lv2.8
          }
        }

        // "気L1.4" level in Traits is stored as-is as a string, not parsed as number
        const weapon = unit.Weapons[0];
        expect(weapon.Traits).toBe("気L1.4");

        const ability = unit.Abilities[0];
        expect(ability.Traits).toBe("気L1.4");

        // NO warnings should be generated for Feature.Level or AbilityEffect.EffectLevel
        const floatFieldWarnings = result.warnings?.filter(
          (w) =>
            (w.includes("シールド") || w.includes("ＨＰ回復") || w.includes("回復Lv")) &&
            w.includes("実数値が指定されたため")
        );
        expect(floatFieldWarnings?.length || 0).toBe(0);
      }
    });

    it("should round .5 values upward using Math.round (not banker's rounding)", () => {
      const result = parseUnitFile(boundaryText, "boundary_unit.txt");

      expect(result.success).toBe(true);
      if (result.success) {
        const unit = result.data.find((u) => u.Name === "実数丸め");
        expect(unit).toBeDefined();
        if (unit) {
          // Test that .5 rounds UP (Math.round behavior), not to even (banker's rounding)
          // Speed: 4.5 → 5 (rounds up)
          expect(unit.Speed).toBe(5);
          // HP: 2999.5 → 3000 (rounds up)
          expect(unit.HP).toBe(3000);
          // EN: 99.5 → 100 (rounds up)
          expect(unit.EN).toBe(100);
          // Armor: 999.5 → 1000 (rounds up)
          expect(unit.Armor).toBe(1000);
          // Mobility: 99.5 → 100 (rounds up)
          expect(unit.Mobility).toBe(100);
          // Cost: 2000.5 → 2001 (rounds up)
          expect(unit.Cost).toBe(2001);
          // ExpValue: 50.5 → 51 (rounds up)
          expect(unit.ExpValue).toBe(51);

          // Weapon fields
          if (unit.Weapons.length > 0) {
            const weapon = unit.Weapons[0];
            expect(weapon.Name).toBe("丸め武器");
            // AttackPower: 1999.5 → 2000 (rounds up)
            expect(weapon.AttackPower).toBe(2000);
            // MinRange: 1.5 → 2 (rounds up)
            expect(weapon.MinRange).toBe(2);
            // MaxRange: 1.5 → 2 (rounds up)
            expect(weapon.MaxRange).toBe(2);
            // AccuracyMod: 0.5 → 1 (rounds up)
            expect(weapon.AccuracyMod).toBe(1);
            // Ammo: 9.5 → 10 (rounds up)
            expect(weapon.Ammo).toBe(10);
            // ENCost: 99.5 → 100 (rounds up)
            expect(weapon.ENCost).toBe(100);
            // RequiredMorale: 100.5 → 101 (rounds up)
            expect(weapon.RequiredMorale).toBe(101);
            // CriticalMod: 0.5 → 1 (rounds up)
            expect(weapon.CriticalMod).toBe(1);
          }

          // Ability fields
          if (unit.Abilities.length > 0) {
            const ability = unit.Abilities[0];
            expect(ability.Name).toBe("丸めアビリティ");
            // MaxRange: 9.5 → 10 (rounds up)
            expect(ability.MaxRange).toBe(10);
            // Stock: 9.5 → 10 (rounds up)
            expect(ability.Stock).toBe(10);
            // ENCost: 99.5 → 100 (rounds up)
            expect(ability.ENCost).toBe(100);
            // RequiredMorale: 100.5 → 101 (rounds up)
            expect(ability.RequiredMorale).toBe(101);
          }

          // Feature.Level should keep .5 as float
          const barrierFeature = unit.Features.find((f) => f.Name === "バリア");
          if (barrierFeature) {
            expect(barrierFeature.Level).toBe(4.5);
          }

          const enRecoveryFeature = unit.Features.find((f) =>
            f.Name.includes("ＥＮ回復")
          );
          if (enRecoveryFeature) {
            expect(enRecoveryFeature.Level).toBe(3.5);
          }

          // AbilityEffect.EffectLevel should keep .5 as float
          if (unit.Abilities.length > 0) {
            const ability = unit.Abilities[0];
            const addEffect = ability.Effects.find((e) => e.EffectType === "付加");
            if (addEffect) {
              expect(addEffect.EffectLevel).toBe(1.5);
            }
            const healEffect = ability.Effects.find((e) => e.EffectType === "回復");
            if (healEffect) {
              expect(healEffect.EffectLevel).toBe(1.5);
            }
          }
        }
      }
    });

    it("should handle negative decimal values correctly", () => {
      const result = parseUnitFile(boundaryText, "boundary_unit.txt");

      expect(result.success).toBe(true);
      if (result.success) {
        const unit = result.data.find((u) => u.Name === "負実数");
        expect(unit).toBeDefined();
        if (unit) {
          // Weapon with negative decimals
          if (unit.Weapons.length > 0) {
            const weapon = unit.Weapons[0];
            expect(weapon.Name).toBe("負実数武器");
            // AccuracyMod: -15.7 → Math.round(-15.7) = -16
            expect(weapon.AccuracyMod).toBe(-16);
            // CriticalMod: -20.3 → Math.round(-20.3) = -20
            expect(weapon.CriticalMod).toBe(-20);
          }

          // Feature.Level can be negative decimal
          const hpRecoveryFeature = unit.Features.find((f) =>
            f.Name.includes("ＨＰ回復")
          );
          if (hpRecoveryFeature) {
            expect(hpRecoveryFeature.Level).toBe(-2.7);
          }

          const enRecoveryFeature = unit.Features.find((f) =>
            f.Name.includes("ＥＮ回復")
          );
          if (enRecoveryFeature) {
            expect(enRecoveryFeature.Level).toBe(-1.3);
          }

          // AbilityEffect.EffectLevel can be negative decimal
          if (unit.Abilities.length > 0) {
            const ability = unit.Abilities[0];
            const addEffect = ability.Effects.find((e) => e.EffectType === "付加");
            if (addEffect) {
              expect(addEffect.EffectLevel).toBe(-1.2);
            }
          }
        }

        // Verify warnings for negative integer field decimals
        expect(result.warnings).toContainEqual(
          expect.stringContaining("負実数武器の命中率に実数値が指定されたため、整数に変換されました（-15.7 → -16）。 (行115)")
        );
        expect(result.warnings).toContainEqual(
          expect.stringContaining("負実数武器のクリティカル率に実数値が指定されたため、整数に変換されました（-20.3 → -20）。 (行115)")
        );

        // NO warnings for Feature.Level or AbilityEffect.EffectLevel with negative decimals
        const negativeFloatWarnings = result.warnings?.filter(
          (w) =>
            (w.includes("ＨＰ回復") || w.includes("ＥＮ回復") || w.includes("付加")) &&
            w.includes("実数値が指定されたため")
        );
        expect(negativeFloatWarnings?.length || 0).toBe(0);
      }
    });

    it("should handle very large feature levels", () => {
      const result = parseUnitFile(boundaryText, "boundary_unit.txt");

      expect(result.success).toBe(true);
      if (result.success) {
        const unit = result.data.find((u) => u.Name === "超大レベル");
        expect(unit).toBeDefined();
        if (unit && unit.Features.length > 0) {
          const shieldFeature = unit.Features.find((f) =>
            f.Name.includes("シールド")
          );
          if (shieldFeature) {
            expect(shieldFeature.Level).toBe(9999);
          }
          const hpFeature = unit.Features.find((f) =>
            f.Name.includes("ＨＰ回復")
          );
          if (hpFeature) {
            expect(hpFeature.Level).toBe(10000);
          }
        }
      }
    });
  });
});
