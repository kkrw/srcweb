/**
 * Map Data Parser
 *
 * Parses .map files in SRC format
 *
 * Map file format:
 * - New format (has "MapData" header):
 *   Line 1: "MapData"
 *   Line 2: Reserved (version info, ignored)
 *   Line 3: width,height
 *   Lines 4+: terrainType,bitmapNo pairs (width * height entries)
 *   Optional: "Layer" section with layer data
 *
 * - Legacy format (no header):
 *   Fixed 20x20 size
 *   terrainType,bitmapNo pairs directly
 */

import type { MapCell, MapData } from "../models";
import { createMapCell, createMapData } from "../models";
import type { Float, Integer } from "../models/BrandedTypes";
import { ERROR_MESSAGES } from "./messages";
import { type ParseResult, ParseError } from "./ParseResult";

/** Default map size for legacy format */
const LEGACY_MAP_SIZE = 20;

/** Value indicating no layer is present */
const NO_LAYER_VALUE = -1;

/** Box type constants matching VB5 implementation */
const BOX_TYPE = {
  /** Unit is on lower layer */
  UNDER: 0,
  /** Unit is on upper layer */
  UPPER: 1,
} as const;

/**
 * Parses a map data file
 * @param text - File content as string (Shift-JIS decoded to UTF-8)
 * @param filePath - File path for error messages (e.g., "Map/stage01.map")
 */
export function parseMapFile(
  text: string,
  filePath: string = "unknown"
): ParseResult<MapData> {
  try {
    const lines = text.split(/\r?\n/);
    const warnings: string[] = [];

    // Filter out empty lines at the end, but preserve internal structure
    while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
      lines.pop();
    }

    if (lines.length === 0) {
      return {
        success: false,
        error: new ParseError(ERROR_MESSAGES.MAP_FILE_EMPTY, 1, ""),
      };
    }

    let lineIndex = 0;
    let width: number;
    let height: number;
    let isNewFormat = false;

    // Check for new format header
    const firstLine = unquote(lines[0].trim());
    if (firstLine === "MapData") {
      isNewFormat = true;
      lineIndex++; // Skip "MapData"

      // Skip reserved line (version info)
      if (lineIndex >= lines.length) {
        return {
          success: false,
          error: new ParseError(
            ERROR_MESSAGES.MAP_MISSING_SIZE,
            lineIndex + 1,
            ""
          ),
        };
      }
      lineIndex++; // Skip reserved line

      // Read map size
      if (lineIndex >= lines.length) {
        return {
          success: false,
          error: new ParseError(
            ERROR_MESSAGES.MAP_MISSING_SIZE,
            lineIndex + 1,
            ""
          ),
        };
      }

      const sizeResult = parseSizeLine(lines[lineIndex], lineIndex + 1);
      if (!sizeResult.success) {
        return { success: false, error: sizeResult.error };
      }
      width = sizeResult.data.width;
      height = sizeResult.data.height;
      lineIndex++;
    } else {
      // Legacy format: fixed 20x20 size
      width = LEGACY_MAP_SIZE;
      height = LEGACY_MAP_SIZE;
    }

    // Validate map size
    if (width < 1 || height < 1) {
      return {
        success: false,
        error: new ParseError(
          `${ERROR_MESSAGES.MAP_SIZE_OUT_OF_RANGE}: ${width}x${height}`,
          isNewFormat ? 3 : 1,
          ""
        ),
      };
    }

    // Parse terrain data
    const cells: MapCell[] = [];
    const expectedCells = width * height;

    // VB5 reads data in order: for x = 1 to width, for y = 1 to height
    for (let x = 1; x <= width; x++) {
      for (let y = 1; y <= height; y++) {
        if (lineIndex >= lines.length) {
          return {
            success: false,
            error: new ParseError(
              `${ERROR_MESSAGES.MAP_INSUFFICIENT_DATA} 期待: ${expectedCells}セル、実際: ${cells.length}セル`,
              lineIndex + 1,
              ""
            ),
          };
        }

        const cellResult = parseTerrainLine(lines[lineIndex], lineIndex + 1);
        if (!cellResult.success) {
          return { success: false, error: cellResult.error };
        }

        cells.push(
          createMapCell({
            x,
            y,
            terrain: {
              id: cellResult.data.terrainType as Integer,
              name: "",
              graphicFileNamePrefix: "",
              type: "陸",
              cost: 1 as Float,
              features: [],
            },
            bitmapNo: cellResult.data.bitmapNo,
            layerTerrainID: null,
            layerBitmapNo: null,
            boxType: BOX_TYPE.UNDER,
          })
        );

        lineIndex++;
      }
    }

    // Check for Layer section
    if (lineIndex < lines.length) {
      const layerHeader = unquote(lines[lineIndex].trim());
      if (layerHeader === "Layer") {
        lineIndex++; // Skip "Layer" header

        // Parse layer data
        let cellIndex = 0;
        for (let x = 1; x <= width; x++) {
          for (let y = 1; y <= height; y++) {
            if (lineIndex >= lines.length) {
              // Layer data can be incomplete, just warn
              warnings.push(
                `[${filePath}] レイヤーデータが不足しています (行${
                  lineIndex + 1
                })`
              );
              break;
            }

            const layerResult = parseTerrainLine(
              lines[lineIndex],
              lineIndex + 1
            );
            if (!layerResult.success) {
              // Layer parsing error is non-fatal, just warn
              warnings.push(
                `[${filePath}] レイヤーデータのパースに失敗 (行${
                  lineIndex + 1
                }): ${layerResult.error.message}`
              );
              lineIndex++;
              cellIndex++;
              continue;
            }

            const cell = cells[cellIndex];
            const layerTerrainType = layerResult.data.terrainType;
            const layerBitmapNo = layerResult.data.bitmapNo;

            if (layerTerrainType !== NO_LAYER_VALUE) {
              cell.layerTerrainID = layerTerrainType;
              cell.layerBitmapNo = layerBitmapNo;
              cell.boxType = BOX_TYPE.UPPER;
            }

            lineIndex++;
            cellIndex++;
          }
        }
      }
    }

    const mapData = createMapData({
      mapFileName: filePath,
      width,
      height,
      cells,
    });

    return {
      success: true,
      data: mapData,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

/**
 * Removes surrounding double quotes from a string
 */
function unquote(str: string): string {
  if (str.startsWith('"') && str.endsWith('"') && str.length >= 2) {
    return str.slice(1, -1);
  }
  return str;
}

/**
 * Parses a size line (width,height)
 */
function parseSizeLine(
  line: string,
  lineNumber: number
): ParseResult<{ width: number; height: number }> {
  const parts = line.split(",").map((s) => s.trim());

  if (parts.length < 2) {
    return {
      success: false,
      error: new ParseError(
        `${ERROR_MESSAGES.MAP_INVALID_SIZE}: ${line}`,
        lineNumber,
        line
      ),
    };
  }

  const width = parseInt(parts[0], 10);
  const height = parseInt(parts[1], 10);

  if (isNaN(width) || isNaN(height)) {
    return {
      success: false,
      error: new ParseError(
        `${ERROR_MESSAGES.MAP_INVALID_SIZE_VALUE}: ${line}`,
        lineNumber,
        line
      ),
    };
  }

  return { success: true, data: { width, height } };
}

/**
 * Parses a terrain data line (terrainType,bitmapNo)
 */
function parseTerrainLine(
  line: string,
  lineNumber: number
): ParseResult<{ terrainType: number; bitmapNo: number }> {
  const trimmedLine = line.trim();
  if (trimmedLine === "") {
    return {
      success: false,
      error: new ParseError(
        ERROR_MESSAGES.MAP_EMPTY_TERRAIN_LINE,
        lineNumber,
        line
      ),
    };
  }

  const parts = trimmedLine.split(",").map((s) => s.trim());

  if (parts.length < 2) {
    return {
      success: false,
      error: new ParseError(
        `${ERROR_MESSAGES.MAP_INVALID_TERRAIN_FORMAT}: ${line}`,
        lineNumber,
        line
      ),
    };
  }

  const terrainType = parseInt(parts[0], 10);
  const bitmapNo = parseInt(parts[1], 10);

  if (isNaN(terrainType) || isNaN(bitmapNo)) {
    return {
      success: false,
      error: new ParseError(
        `${ERROR_MESSAGES.MAP_INVALID_TERRAIN_VALUE}: ${line}`,
        lineNumber,
        line
      ),
    };
  }

  return { success: true, data: { terrainType, bitmapNo } };
}
