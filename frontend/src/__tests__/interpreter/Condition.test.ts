import {
  AndCondition,
  AtomCondition,
  OrCondition,
  parseCondition,
} from "../../models/Condition";

describe("Condition Parser", () => {
  it("should parse simple atom", () => {
    const cond = parseCondition("Ground");
    expect(cond).toBeInstanceOf(AtomCondition);
    expect((cond as AtomCondition).text).toBe("Ground");
  });

  it("should parse OR condition", () => {
    const cond = parseCondition("A or B");
    expect(cond).toBeInstanceOf(OrCondition);
    // Cast to check internals if needed, or just check type
  });

  it("should parse AND condition", () => {
    const cond = parseCondition("A and B");
    expect(cond).toBeInstanceOf(AndCondition);
  });

  it("should parse complex condition with parens", () => {
    const cond = parseCondition("(A or B) and C");
    expect(cond).toBeInstanceOf(AndCondition);
    // Structure: And(Or(A, B), C)
  });
});
