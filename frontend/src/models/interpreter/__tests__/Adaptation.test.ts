import { Adaptation } from "../Adaptation";

describe("Adaptation Parser", () => {
  it("should parse valid AAAA string", () => {
    const adapt = Adaptation.fromString("AAAA");
    expect(adapt.air).toBe(5); // A
    expect(adapt.ground).toBe(5); // A
    expect(adapt.water).toBe(5); // A
    expect(adapt.space).toBe(5); // A
  });

  it("should parse mixed ranks", () => {
    const adapt = Adaptation.fromString("S-BC");
    expect(adapt.air).toBe(6); // S
    expect(adapt.ground).toBe(0); // -
    expect(adapt.water).toBe(4); // B
    expect(adapt.space).toBe(3); // C
  });

  it("should handle invalid length gracefully (default to AAAA or similar)", () => {
    // Current impl returns AAAA for invalid length
    const adapt = Adaptation.fromString("ABC");
    expect(adapt.air).toBe(5); // A
    expect(adapt.ground).toBe(5); // A
    expect(adapt.water).toBe(5); // A
    expect(adapt.space).toBe(5); // A
  });
});
