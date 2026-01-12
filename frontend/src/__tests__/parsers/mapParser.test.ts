import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { parseMapFile } from "../../parsers/mapParser";
import { terrainRepository } from "../../repositories/TerrainRepository";

describe("Map Parser", () => {
  beforeAll(() => {
    const terrainFilePath = join(__dirname, "fixtures", "sample_terrain.txt");
    terrainRepository.load([terrainFilePath]);
  });

  afterAll(() => {
    terrainRepository.clear();
  });
  // ==========================================================================
  // 新形式マップ（基本）
  // ==========================================================================
  describe("新形式マップ（基本）", () => {
    const sampleMapText = readFileSync(
      join(__dirname, "fixtures", "sample_map_new_format.map"),
      "utf-8"
    );

    it("新形式マップを正しくパースできる", () => {
      const result = parseMapFile(sampleMapText, "sample_map_new_format.map");

      expect(result.success).toBe(true);
      if (!result.success) return;

      // マップサイズ
      expect(result.data.width).toBe(3);
      expect(result.data.height).toBe(3);

      // セル数
      expect(result.data.cells).toHaveLength(9);

      // ファイル名
      expect(result.data.mapFileName).toBe("sample_map_new_format.map");
    });

    it("新形式マップのセル座標とデータが正しい", () => {
      const result = parseMapFile(sampleMapText, "sample_map_new_format.map");

      expect(result.success).toBe(true);
      if (!result.success) return;

      // 最初のセル (x=1, y=1)
      const cell11 = result.data.cells.find((c) => c.x === 1 && c.y === 1);
      expect(cell11).toBeDefined();
      expect(cell11!.terrain.id).toBe(0);
      expect(cell11!.terrain.name).toBe("平地");
      expect(cell11!.bitmapNo).toBe(0);

      // (x=1, y=3)
      const cell13 = result.data.cells.find((c) => c.x === 1 && c.y === 3);
      expect(cell13).toBeDefined();
      expect(cell13!.terrain.id).toBe(0);
      expect(cell13!.terrain.name).toBe("平地");
      expect(cell13!.bitmapNo).toBe(2);

      // (x=2, y=1)
      const cell21 = result.data.cells.find((c) => c.x === 2 && c.y === 1);
      expect(cell21).toBeDefined();
      expect(cell21!.terrain.id).toBe(11);
      expect(cell21!.terrain.name).toBe("林");
      expect(cell21!.bitmapNo).toBe(0);

      // (x=3, y=3)
      const cell33 = result.data.cells.find((c) => c.x === 3 && c.y === 3);
      expect(cell33).toBeDefined();
      expect(cell33!.terrain.id).toBe(17);
      expect(cell33!.terrain.name).toBe("海");
      expect(cell33!.bitmapNo).toBe(2);
    });

    it("レイヤーがない場合、レイヤー関連フィールドがnull", () => {
      const result = parseMapFile(sampleMapText, "sample_map_new_format.map");

      expect(result.success).toBe(true);
      if (!result.success) return;

      for (const cell of result.data.cells) {
        expect(cell.layerTerrainID).toBeNull();
        expect(cell.layerBitmapNo).toBeNull();
        expect(cell.boxType).toBe(0); // UNDER
      }
    });
  });

  // ==========================================================================
  // 新形式マップ（レイヤーあり）
  // ==========================================================================
  describe("新形式マップ（レイヤーあり）", () => {
    const sampleMapText = readFileSync(
      join(__dirname, "fixtures", "sample_map_with_layer.map"),
      "utf-8"
    );

    it("レイヤーデータを正しくパースできる", () => {
      const result = parseMapFile(sampleMapText, "sample_map_with_layer.map");

      expect(result.success).toBe(true);
      if (!result.success) return;

      // マップサイズ
      expect(result.data.width).toBe(2);
      expect(result.data.height).toBe(2);

      // セル数
      expect(result.data.cells).toHaveLength(4);
    });

    it("レイヤーが設定されているセルのboxTypeがUPPER(1)になる", () => {
      const result = parseMapFile(sampleMapText, "sample_map_with_layer.map");

      expect(result.success).toBe(true);
      if (!result.success) return;

      // (x=1, y=2) にはレイヤーがある (32,5)
      const cell12 = result.data.cells.find((c) => c.x === 1 && c.y === 2);
      expect(cell12).toBeDefined();
      expect(cell12!.layerTerrainID).toBe(32);
      expect(cell12!.layerBitmapNo).toBe(5);
      expect(cell12!.boxType).toBe(1); // UPPER

      // 他のセルにはレイヤーがない (-1,-1)
      const cell11 = result.data.cells.find((c) => c.x === 1 && c.y === 1);
      expect(cell11).toBeDefined();
      expect(cell11!.layerTerrainID).toBeNull();
      expect(cell11!.layerBitmapNo).toBeNull();
      expect(cell11!.boxType).toBe(0); // UNDER
    });
  });

  // ==========================================================================
  // 新形式マップ（バージョン番号）
  // ==========================================================================
  describe("新形式マップ（バージョン番号）", () => {
    const sampleMapText = readFileSync(
      join(__dirname, "fixtures", "sample_map_version_number.map"),
      "utf-8"
    );

    it("バージョン番号形式の予約行を正しく処理できる", () => {
      const result = parseMapFile(
        sampleMapText,
        "sample_map_version_number.map"
      );

      expect(result.success).toBe(true);
      if (!result.success) return;

      // マップサイズ
      expect(result.data.width).toBe(2);
      expect(result.data.height).toBe(2);

      // セル数
      expect(result.data.cells).toHaveLength(4);

      // 最初のセル (x=1, y=1)
      const cell11 = result.data.cells.find((c) => c.x === 1 && c.y === 1);
      expect(cell11).toBeDefined();
      expect(cell11!.terrain.id).toBe(5);
      expect(cell11!.bitmapNo).toBe(0);
    });
  });

  // ==========================================================================
  // 旧形式マップ
  // ==========================================================================
  describe("旧形式マップ", () => {
    const sampleMapText = readFileSync(
      join(__dirname, "fixtures", "sample_map_legacy_format.map"),
      "utf-8"
    );

    it("旧形式マップを正しくパースできる", () => {
      const result = parseMapFile(
        sampleMapText,
        "sample_map_legacy_format.map"
      );

      expect(result.success).toBe(true);
      if (!result.success) return;

      // 旧形式は固定20x20
      expect(result.data.width).toBe(20);
      expect(result.data.height).toBe(20);

      // セル数
      expect(result.data.cells).toHaveLength(400);
    });

    it("旧形式マップのセル座標とデータが正しい", () => {
      const result = parseMapFile(
        sampleMapText,
        "sample_map_legacy_format.map"
      );

      expect(result.success).toBe(true);
      if (!result.success) return;

      // 最初のセル (x=1, y=1)
      const cell11 = result.data.cells.find((c) => c.x === 1 && c.y === 1);
      expect(cell11).toBeDefined();
      expect(cell11!.terrain.id).toBe(0);
      expect(cell11!.terrain.name).toBe("平地");
      expect(cell11!.bitmapNo).toBe(0);

      // (x=1, y=20)
      const cell1_20 = result.data.cells.find((c) => c.x === 1 && c.y === 20);
      expect(cell1_20).toBeDefined();
      expect(cell1_20!.terrain.id).toBe(0);
      expect(cell1_20!.terrain.name).toBe("平地");
      expect(cell1_20!.bitmapNo).toBe(19);

      // (x=20, y=20)
      const cell20_20 = result.data.cells.find((c) => c.x === 20 && c.y === 20);
      expect(cell20_20).toBeDefined();
      expect(cell20_20!.terrain.id).toBe(19);
      expect(cell20_20!.terrain.name).toBe("川");
      expect(cell20_20!.bitmapNo).toBe(19);
    });
  });

  // ==========================================================================
  // エラーケース
  // ==========================================================================
  describe("エラーケース", () => {
    it("空のファイルでエラーを返す", () => {
      const result = parseMapFile("", "empty.map");

      expect(result.success).toBe(false);
      if (result.success) return;

      expect(result.error.message).toContain("空です");
    });

    it("マップサイズが不正な場合エラーを返す", () => {
      const invalidMap = `"MapData"
"Reserved"
abc,def
`;
      const result = parseMapFile(invalidMap, "invalid_size.map");

      expect(result.success).toBe(false);
      if (result.success) return;

      expect(result.error.message).toContain("マップサイズ");
    });

    it("地形データが不足している場合エラーを返す", () => {
      const incompleteMap = `"MapData"
"Reserved"
3,3
0,0
0,1
`;
      const result = parseMapFile(incompleteMap, "incomplete.map");

      expect(result.success).toBe(false);
      if (result.success) return;

      expect(result.error.message).toContain("不足");
    });

    it("地形データが不正な形式の場合エラーを返す", () => {
      const invalidTerrainMap = `"MapData"
"Reserved"
2,2
invalid_data
0,1
0,2
0,3
`;
      const result = parseMapFile(invalidTerrainMap, "invalid_terrain.map");

      expect(result.success).toBe(false);
      if (result.success) return;

      expect(result.error.message).toContain("地形データ");
    });
  });
});
