import { parseTraits } from "../Trait";

describe("Trait Parser", () => {
  it("should parse simple single-character traits", () => {
    const traits = parseTraits("PBS");
    expect(traits).toHaveLength(3);
    expect(traits[0].code).toBe("P");
    expect(traits[1].code).toBe("B");
    expect(traits[2].code).toBe("S");
  });

  it("should parse complex traits with prefixes", () => {
    const traits = parseTraits("弱火効水");
    expect(traits).toHaveLength(2);
    expect(traits[0].code).toBe("弱火");
    expect(traits[1].code).toBe("効水");
  });

  it("should handle nested prefixes", () => {
    // "弱効火" -> Weak to (Effective Fire) or Weakness that is also Effective?
    // Based on parser logic: checks ch=弱/効/剋 in loop.
    const traits = parseTraits("弱効火");
    expect(traits).toHaveLength(1);
    expect(traits[0].code).toBe("弱効火");
  });

  it("should handle 'Low' (低) specific traits", () => {
    const traits = parseTraits("低攻低防");
    expect(traits).toHaveLength(2);
    expect(traits[0].code).toBe("低攻");
    expect(traits[1].code).toBe("低防");
  });

  it("should handle mixed traits", () => {
    const traits = parseTraits("P弱火B");
    expect(traits).toHaveLength(3);
    expect(traits[0].code).toBe("P");
    expect(traits[1].code).toBe("弱火");
    expect(traits[2].code).toBe("B");
  });
});
