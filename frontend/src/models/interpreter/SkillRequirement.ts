/**
 * 武器やアビリティの必要技能を表すインタフェース
 * 例: "ニュータイプLv1", "切り払いLv1"
 */
export interface SkillRequirement {
  skillName: string;
  level: number;
}

export function parseSkillRequirement(reqStr: string): SkillRequirement[] {
  if (!reqStr) return [];

  // "ニュータイプLv1" specific format?
  // Or "Skill A" or "Skill B" (OR logic) or "Skill A" and "Skill B" (AND logic)?
  // Based on "UnitData.ts" field "RequiredSkill", it is a string.
  // Docs say: "Multiple skills can be specified separated by spaces (AND condition)".
  // Wait, the user example was "@森林 or @林". That was for Condition.
  // For Skill, it is usually "Ready Lv1".

  // Assuming space separation means multiple requirements (AND).
  // VB5 Logic: split by space?

  // Simple implementation: Split by space, parse each.
  // If there are OR conditions in skills, that complicates things suitable for Condition parser.
  // But typically RequiredSkill is a list.

  const skills: SkillRequirement[] = [];
  const parts = reqStr.split(/\s+/).filter((s) => s.length > 0);

  for (const part of parts) {
    // Check for "Lv"
    const match = part.match(/^(.+)Lv(\d+)$/i);
    if (match) {
      skills.push({
        skillName: match[1],
        level: parseInt(match[2], 10),
      });
    } else {
      skills.push({
        skillName: part,
        level: 1, // Default level 1
      });
    }
  }

  return skills;
}
