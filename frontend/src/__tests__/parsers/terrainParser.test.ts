import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { parseTerrainFile } from '../../parsers/terrainParser';
import type { Terrain } from '../../models/map/types';
import { decodeShiftJIS } from '../../parsers/utils';

describe('terrainParser', () => {
  let terrains: Terrain[];
  let parseResultWarnings: string[] | undefined;
  const filePath = path.join(__dirname, 'fixtures', 'sample_terrain.txt');

  beforeAll(() => {
    const fileBuffer = fs.readFileSync(filePath);
    const fileContent = decodeShiftJIS(fileBuffer);
    const parseResult = parseTerrainFile(fileContent, filePath);

    if (!parseResult.success) {
      throw parseResult.error;
    }
    terrains = parseResult.data;
    parseResultWarnings = parseResult.warnings;
  });

  it('should parse all terrains and have no warnings', () => {
    expect(terrains).toHaveLength(97); // 91 standard terrains + 4 separators + 2 user-defined = 97
    expect(parseResultWarnings).toBeUndefined(); // Assuming no warnings for this sample
  });

  describe('Standard Terrains', () => {
    it('should parse a basic terrain with no special effects (ID 0)', () => {
      const plain = terrains.find(t => t.id === 0);
      expect(plain).toBeDefined();
      if (!plain) return;
      expect(plain.name).toBe('平地');
      expect(plain.type).toBe('陸');
      expect(plain.cost).toBe(1);
      expect(plain.defenseBonusRate).toBeUndefined();
      expect(plain.evasionBonusRate).toBeUndefined();
      expect(plain.features).toHaveLength(0);
    });

    it('should parse terrain with defense and evasion bonuses (ID 17)', () => {
      const sea = terrains.find(t => t.id === 17);
      expect(sea).toBeDefined();
      if (!sea) return;
      expect(sea.name).toBe('海');
      expect(sea.type).toBe('水');
      expect(sea.cost).toBe(2);
      expect(sea.defenseBonusRate).toBe(5);
      expect(sea.evasionBonusRate).toBe(5);
    });

    it('should parse terrain with a collision feature (ID 81)', () => {
      const bigTree = terrains.find(t => t.id === 81);
      expect(bigTree).toBeDefined();
      if (!bigTree) return;
      expect(bigTree.name).toBe('大樹');
      expect(bigTree.features).toHaveLength(1);
      expect(bigTree.features[0].spec.name).toBe('衝突');
    });

    it('should parse terrain with multiple features like status effect and effect range (ID 82)', () => {
      const poisonSwamp = terrains.find(t => t.id === 82);
      expect(poisonSwamp).toBeDefined();
      if (!poisonSwamp) return;
      expect(poisonSwamp.name).toBe('毒沼');
      expect(poisonSwamp.features).toHaveLength(2);
      expect(poisonSwamp.features[0].spec.name).toBe('状態付加');
      expect(poisonSwamp.features[0].level).toBe(3);
      expect(poisonSwamp.features[0].parameters).toEqual(['毒']);
      expect(poisonSwamp.features[1].spec.name).toBe('効果範囲');
      expect(poisonSwamp.features[1].parameters).toEqual(['水中']);
    });
  });

  describe('User-defined Terrains', () => {
    it('should parse terrain with various features (ID 1000) correctly', () => {
      const testTerrain = terrains.find(t => t.id === 1000);
      expect(testTerrain).toBeDefined();
      if (!testTerrain) return;
      expect(testTerrain.name).toBe('色んな効果のある地形');
      expect(testTerrain.cost).toBe(0.5);
      expect(testTerrain.defenseBonusRate).toBe(15);
      expect(testTerrain.evasionBonusRate).toBe(15);
      expect(testTerrain.features).toHaveLength(14);
      
      // ＨＰ回復Lv1
      expect(testTerrain.features[0].spec.name).toBe('ＨＰ回復');
      expect(testTerrain.features[0].level).toBe(1);
      // ＥＮ回復Lv1
      expect(testTerrain.features[1].spec.name).toBe('ＥＮ回復');
      expect(testTerrain.features[1].level).toBe(1);
      // ＨＰ減少Lv0.5
      expect(testTerrain.features[2].spec.name).toBe('ＨＰ減少');
      expect(testTerrain.features[2].level).toBe(0.5);
      // ＥＮ減少Lv0.5
      expect(testTerrain.features[3].spec.name).toBe('ＥＮ減少');
      expect(testTerrain.features[3].level).toBe(0.5);
      // ＨＰ増加Lv1.5
      expect(testTerrain.features[4].spec.name).toBe('ＨＰ増加');
      expect(testTerrain.features[4].level).toBe(1.5);
      // ＥＮ増加Lv1.5
      expect(testTerrain.features[5].spec.name).toBe('ＥＮ増加');
      expect(testTerrain.features[5].level).toBe(1.5);
      // ＨＰ低下Lv0.5
      expect(testTerrain.features[6].spec.name).toBe('ＨＰ低下');
      expect(testTerrain.features[6].level).toBe(0.5);
      // ＥＮ低下Lv0.5
      expect(testTerrain.features[7].spec.name).toBe('ＥＮ低下');
      expect(testTerrain.features[7].level).toBe(0.5);
      // 状態付加Lv1=毒
      expect(testTerrain.features[8].spec.name).toBe('状態付加');
      expect(testTerrain.features[8].level).toBe(1);
      expect(testTerrain.features[8].parameters).toEqual(['毒']);
      // 状態付加=暗闇
      expect(testTerrain.features[9].spec.name).toBe('状態付加');
      expect(testTerrain.features[9].level).toBe(0); // Level is not specified, defaults to 0
      expect(testTerrain.features[9].parameters).toEqual(['暗闇']);
      // 衝突
      expect(testTerrain.features[10].spec.name).toBe('衝突');
      // 摩擦Lv1
      expect(testTerrain.features[11].spec.name).toBe('摩擦');
      expect(testTerrain.features[11].level).toBe(1);
      // 移動停止
      expect(testTerrain.features[12].spec.name).toBe('移動停止');
      // 効果範囲=空
      expect(testTerrain.features[13].spec.name).toBe('効果範囲');
      expect(testTerrain.features[13].parameters).toEqual(['空']);
    });

    it('should correctly handle hideInEditor flag (ID 1001)', () => {
      const hiddenTerrain = terrains.find(t => t.id === 1001);
      expect(hiddenTerrain).toBeDefined();
      if (!hiddenTerrain) return;
      expect(hiddenTerrain.name).toBe('エディターに表示されない地形');
      expect(hiddenTerrain.hideInEditor).toBe(true);
    });
  });
});
