import * as fs from "fs";
import type { Terrain } from "../models/map/types";
import { parseTerrainFile } from "../parsers/terrainParser";
import { decodeShiftJIS } from "../parsers/utils";

/**
 * Manages loading and accessing terrain data.
 * This repository ensures that terrain data is loaded only once.
 */
export class TerrainRepository {
  private terrains: Terrain[] = [];
  private terrainsById: Map<number, Terrain> = new Map();
  private isLoaded = false;

    /**

     * Loads terrain data from the specified file paths.

     * This method clears any existing data and reloads everything from the provided files.

     * If a terrain ID is duplicated across files, the one from the later file in the array will overwrite the earlier one.

     * @param filePaths - An array of paths to the terrain data files.

     */

    public load(filePaths: string[]): void {

      // Clear existing data before loading new data.

      this.clear();

  

      try {

        for (const filePath of filePaths) {

          const fileBuffer = fs.readFileSync(filePath);

          const fileContent = decodeShiftJIS(fileBuffer);

          const parseResult = parseTerrainFile(fileContent, filePath);

  

          if (!parseResult.success) {

            // If any file fails to parse, we stop and throw an error.

            throw new Error(`Failed to parse terrain file "${filePath}": ${parseResult.error.message}`);

          }

  

          // Merge the newly parsed terrains

          for (const terrain of parseResult.data) {

            // If ID exists, it will be overwritten.

            this.terrainsById.set(terrain.id, terrain);

          }

        }

  

        // Rebuild the terrains array from the map to ensure consistency

        this.terrains = Array.from(this.terrainsById.values());

        

        // Sort by ID for consistent order

        this.terrains.sort((a, b) => a.id - b.id);

  

        this.isLoaded = true;

      } catch (error) {

        console.error("Error loading terrain data:", error);

        // If an error occurs, ensure the repository is in a clean state.

        this.clear();

        throw error;

      }

    }

  /**
   * Gets a terrain by its ID.
   * @param id - The ID of the terrain to retrieve.
   * @returns The Terrain object, or undefined if not found.
   */
  public getById(id: number): Terrain | undefined {
    if (!this.isLoaded) {
      // This might happen if load() is not called, which is a developer error.
      // In a real app, you might want to throw an error or ensure load() is called at startup.
      console.warn("Attempted to get terrain by ID before data is loaded.");
    }
    return this.terrainsById.get(id);
  }

  /**
   * Gets all loaded terrains.
   * @returns An array of all Terrain objects.
   */
  public getAll(): Terrain[] {
    if (!this.isLoaded) {
      console.warn("Attempted to get all terrains before data is loaded.");
    }
    return this.terrains;
  }

  /**
   * Clears all loaded data and resets the repository to its initial state.
   * Primarily useful for testing purposes.
   */
  public clear(): void {
    this.terrains = [];
    this.terrainsById.clear();
    this.isLoaded = false;
  }
}

/**
 * A singleton instance of the TerrainRepository.
 * This simplifies access from different parts of the application
 * without needing to pass the instance around everywhere.
 * Note: This assumes a single, consistent terrain data source for the app session.
 */
export const terrainRepository = new TerrainRepository();
