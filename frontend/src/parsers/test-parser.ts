/**
 * Simple test script to verify parser works
 * Run with: node --loader ts-node/esm test-parser.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { parseUnitFile } from './unitParser.js';

const fixturesPath = join(process.cwd(), 'src', '__tests__', 'parsers', 'fixtures');
const sampleFile = join(fixturesPath, 'sample_unit.txt');

console.log('Reading sample unit data from:', sampleFile);

const text = readFileSync(sampleFile, 'utf-8');
console.log(`File size: ${text.length} characters\n`);

console.log('Parsing unit data...');
const result = parseUnitFile(text);

if (!result.success) {
  console.error('❌ Parse failed:', result.error.message);
  process.exit(1);
}

console.log(`✅ Successfully parsed ${result.data.length} units\n`);

result.data.forEach((unit, index) => {
  console.log(`Unit ${index + 1}: ${unit.Name}`);
  console.log(`  Nickname: ${unit.Nickname}`);
  console.log(`  Class: ${unit.UnitClass}`);
  console.log(`  HP/EN: ${unit.HP}/${unit.EN}`);
  console.log(`  Weapons: ${unit.Weapons.length}`);
  if (unit.Weapons.length > 0) {
    unit.Weapons.forEach((w) => {
      console.log(`    - ${w.Name} (Power: ${w.AttackPower}, Range: ${w.MinRange}-${w.MaxRange})`);
    });
  }
  console.log(`  Abilities: ${unit.Abilities.length}`);
  if (unit.Abilities.length > 0) {
    unit.Abilities.forEach((a) => {
      console.log(`    - ${a.Name}`);
    });
  }
  console.log('');
});

console.log('✅ All tests passed!');
