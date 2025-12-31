/**
 * Unit Parser Tests
 */

import { parseUnitFile } from '../../parsers/unitParser';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Unit Parser', () => {
  const fixturesPath = join(__dirname, 'fixtures');
  const sampleUnitText = readFileSync(
    join(fixturesPath, 'sample_unit.txt'),
    'utf-8'
  );

  describe('parseUnitFile', () => {
    it('should successfully parse valid unit data', () => {
      const result = parseUnitFile(sampleUnitText);

      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should parse Test Unit 1 with kana and new format abilities', () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        fail(`Parse failed: ${result.error.message}`);
      }

      const unit1 = result.data.find((u) => u.Name === 'テストユニット１');
      expect(unit1).toBeDefined();
      if (!unit1) return;

      expect(unit1.Nickname).toBe('テストユニット１');
      expect(unit1.KanaName).toBe('てすとゆにっと');
      expect(unit1.UnitClass).toBe('ロボット');
      expect(unit1.PilotCapacity).toBe(1);
      expect(unit1.NumItemSlots).toBe(2);
      expect(unit1.MovementType).toBe('陸');
      expect(unit1.Speed).toBe(4);
      expect(unit1.Size).toBe('M');
      expect(unit1.Cost).toBe(3500);
      expect(unit1.ExpValue).toBe(90);
      expect(unit1.HP).toBe(3400);
      expect(unit1.EN).toBe(110);
      expect(unit1.Armor).toBe(1200);
      expect(unit1.Mobility).toBe(85);
      expect(unit1.Adaptation).toBe('AABA');
      expect(unit1.Bitmap).toBe('test_unit1.bmp');

      // Weapons
      expect(unit1.Weapons.length).toBe(3);
      expect(unit1.Weapons[0].Name).toBe('ビームライフル');
      expect(unit1.Weapons[0].AttackPower).toBe(1600);
      expect(unit1.Weapons[0].Traits).toBe('Ｂ');

      expect(unit1.Weapons[2].Name).toBe('ミサイル');
      expect(unit1.Weapons[2].Ammo).toBe(6);
      expect(unit1.Weapons[2].Traits).toBe('Ｍ投L1Ｐ実');

      // Abilities
      expect(unit1.Abilities.length).toBe(2);
      expect(unit1.Abilities[0].Name).toBe('修理装置');
      expect(unit1.Abilities[1].Name).toBe('補給装置');
    });

    it('should parse human unit with parentheses in class', () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        fail(`Parse failed: ${result.error.message}`);
      }

      const humanUnit = result.data.find((u) => u.Name === '人間ユニット');
      expect(humanUnit).toBeDefined();
      if (!humanUnit) return;

      expect(humanUnit.Nickname).toBe('戦士');
      expect(humanUnit.KanaName).toBe('戦士'); // No kana specified, should default to nickname
      expect(humanUnit.UnitClass).toBe('(戦士)');
      expect(humanUnit.Size).toBe('SS');

      expect(humanUnit.Weapons.length).toBe(2);
      expect(humanUnit.Weapons[0].Name).toBe('剣');
      expect(humanUnit.Weapons[1].Name).toBe('弓');
      expect(humanUnit.Weapons[1].Ammo).toBe(12);
    });

    it('should parse unit with no abilities', () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        fail(`Parse failed: ${result.error.message}`);
      }

      const simpleUnit = result.data.find((u) => u.Name === 'シンプルユニット');
      expect(simpleUnit).toBeDefined();
      if (!simpleUnit) return;

      expect(simpleUnit.Features.length).toBe(0);
      expect(simpleUnit.Weapons.length).toBe(1);
      expect(simpleUnit.Abilities.length).toBe(0);
    });

    it('should parse minimal unit with no weapons and no abilities', () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        fail(`Parse failed: ${result.error.message}`);
      }

      const minimalUnit = result.data.find((u) => u.Name === '最小ユニット');
      expect(minimalUnit).toBeDefined();
      if (!minimalUnit) return;

      expect(minimalUnit.Weapons.length).toBe(0);
      expect(minimalUnit.Abilities.length).toBe(0);
    });

    it('should parse unit with multiple movement types', () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        fail(`Parse failed: ${result.error.message}`);
      }

      const multiUnit = result.data.find((u) => u.Name === '複合ユニット');
      expect(multiUnit).toBeDefined();
      if (!multiUnit) return;

      expect(multiUnit.MovementType).toBe('空陸水');
    });

    it('should handle line continuation with underscore', () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        fail(`Parse failed: ${result.error.message}`);
      }

      const longUnit = result.data.find((u) => u.Name === '長名称ユニット');
      expect(longUnit).toBeDefined();
      if (!longUnit) return;

      // Weapon with multiline traits
      const longRangeWeapon = longUnit.Weapons.find(
        (w) => w.Name === '超長射程ビーム砲'
      );
      expect(longRangeWeapon).toBeDefined();
      if (!longRangeWeapon) return;

      expect(longRangeWeapon.Traits).toBe('ＢＰＨ有');
    });

    it('should parse all test units successfully', () => {
      const result = parseUnitFile(sampleUnitText);

      if (!result.success) {
        fail(`Parse failed: ${result.error.message}`);
      }

      // Expect 8 units in the fixture
      expect(result.data.length).toBe(8);

      const unitNames = result.data.map((u) => u.Name);
      expect(unitNames).toContain('テストユニット１');
      expect(unitNames).toContain('人間ユニット');
      expect(unitNames).toContain('シンプルユニット');
      expect(unitNames).toContain('最小ユニット');
      expect(unitNames).toContain('複合ユニット');
      expect(unitNames).toContain('長名称ユニット');
      expect(unitNames).toContain('解説ユニット');
      expect(unitNames).toContain('改行なし');
    });
  });
});
