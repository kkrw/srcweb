/**
 * Simple test script to verify parser works
 * Run with: node --loader ts-node/esm test-parser.ts
 */

import { readFileSync } from "fs";
import { join } from "path";
import { parseUnitFile } from "./unitParser.js";

const fixturesPath = join(
  process.cwd(),
  "src",
  "__tests__",
  "parsers",
  "fixtures"
);
const sampleFile = join(fixturesPath, "sample_unit.txt");

console.log("Reading sample unit data from:", sampleFile);

const text = readFileSync(sampleFile, "utf-8");
console.log(`File size: ${text.length} characters\n`);

console.log("Parsing unit data...");
const result = parseUnitFile(text);

if (!result.success) {
  console.error("❌ Parse failed:", result.error.message);
  process.exit(1);
}

console.log(`✅ Successfully parsed ${result.data.length} units\n`);

result.data.forEach((unit, index) => {
  console.log(`Unit ${index + 1}: ${unit.name}`);
  console.log(`  Nickname: ${unit.nickname}`);
  console.log(`  Class: ${unit.unitClass}`);
  console.log(`  HP/EN: ${unit.hp}/${unit.en}`);
  console.log(`  Weapons: ${unit.weapons.length}`);
  if (unit.weapons.length > 0) {
    unit.weapons.forEach((w) => {
      console.log(
        `    - ${w.name} (Power: ${w.attackPower}, Range: ${w.minRange}-${w.maxRange})`
      );
    });
  }
  console.log(`  Abilities: ${unit.abilities.length}`);
  if (unit.abilities.length > 0) {
    unit.abilities.forEach((a) => {
      console.log(`    - ${a.name}`);
    });
  }
  console.log("");
});

console.log("✅ All tests passed!");
