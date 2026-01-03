/**
 * 条件判定を行うためのインタフェース
 */
export interface Condition {
  evaluate(context: unknown): boolean;
}

export class AndCondition implements Condition {
  private conditions: Condition[];
  constructor(conditions: Condition[]) {
    this.conditions = conditions;
  }
  evaluate(context: unknown): boolean {
    return this.conditions.every((c) => c.evaluate(context));
  }
}

export class OrCondition implements Condition {
  private conditions: Condition[];
  constructor(conditions: Condition[]) {
    this.conditions = conditions;
  }
  evaluate(context: unknown): boolean {
    return this.conditions.some((c) => c.evaluate(context));
  }
}

export class AtomCondition implements Condition {
  public text: string;
  constructor(text: string) {
    this.text = text;
  }
  evaluate(_context: unknown): boolean {
    // Placeholder evaluation
    void _context;
    return true;
  }
}

/**
 * Valid tokens: "(", ")", "or", "and", literals
 *
 * SRC condition parsing based on VB5 implementation (Unit.cls IsNecessarySkillSatisfied):
 * - Evaluates left-to-right with short-circuit semantics
 * - Space-separated items are implicitly AND-ed
 * - "or" creates an alternative branch
 * - Example: "@森 or @林 地上" evaluates as:
 *   - If @森 succeeds, skip to after "or" alternatives, then check 地上
 *   - If @森 fails, check next is "or", then evaluate @林, then 地上
 *   - Result is equivalent to "(@森 or @林) and 地上"
 * - Example: "@森 地上 or @林" evaluates as:
 *   - If @森 succeeds and 地上 succeeds, skip @林
 *   - If @森 fails (and next is not "or"), entire expression fails
 *   - Result: @森 failure causes immediate failure, not equivalent to "(@森 and 地上) or @林"
 *
 * Implementation note: We convert to AST for evaluation compatibility, but the
 * left-to-right evaluation semantics need to be preserved. For now, we parse
 * assuming AND binds tighter than OR for AST construction.
 */
export function parseCondition(conditionStr: string): Condition {
  if (!conditionStr) return new AndCondition([]);

  // 1. Tokenize
  // Split by specific delimiters but keep them
  // "(A or B) and C" -> ["(", "A", "or", "B", ")", "and", "C"]
  const tokens = conditionStr
    .replace(/\(/g, " ( ")
    .replace(/\)/g, " ) ")
    .split(/\s+/)
    .filter((t) => t.length > 0);

  let cursor = 0;

  // parseExpression handles the full expression with OR and remaining AND terms
  // Based on VB5 logic: "A or B C" is parsed as "(A or B) and C"
  function parseExpression(): Condition {
    let left = parseFactor();

    // Handle OR alternatives (each OR takes only the next factor, not a full term)
    while (cursor < tokens.length && tokens[cursor].toLowerCase() === "or") {
      cursor++;
      const right = parseFactor();
      left = new OrCondition([left, right]);
    }

    // After all ORs are processed, handle remaining space-separated items as AND
    while (cursor < tokens.length) {
      const token = tokens[cursor].toLowerCase();

      // Stop at closing paren
      if (token === ")") {
        break;
      }

      // Explicit AND
      if (token === "and") {
        cursor++;
        const right = parseFactor();
        left = new AndCondition([left, right]);
      }
      // Implicit AND: space-separated items after OR chain
      else if (token !== "or") {
        const right = parseFactor();
        left = new AndCondition([left, right]);
      } else {
        // This shouldn't happen if we've already processed all ORs
        break;
      }
    }

    return left;
  }

  function parseFactor(): Condition {
    if (cursor >= tokens.length) return new AtomCondition("");

    const token = tokens[cursor];

    if (token === "(") {
      cursor++;
      const expr = parseExpression();
      if (cursor < tokens.length && tokens[cursor] === ")") {
        cursor++;
      }
      return expr;
    } else {
      cursor++;
      return new AtomCondition(token);
    }
  }

  return parseExpression();
}
