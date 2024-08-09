import { describe, it, expect } from "vitest";
import renderPriceToHumanString from "../prices/renderPriceToHumanString";

describe("renderPriceToHumanString", () => {
  it("should format high value prices with 2 decimal places and spaces as thousands separators", () => {
    expect(renderPriceToHumanString(1000.4321, "WETH")).toBe("1 000.43 WETH");
    expect(renderPriceToHumanString(1234567.56789, "EUR")).toBe("1 234 567.57 EUR");
  });

  it("should format medium value prices with 3 decimal places", () => {
    expect(renderPriceToHumanString(0.56789, "WETH")).toBe("0.568 WETH");
    expect(renderPriceToHumanString(0.12345, "EUR")).toBe("0.123 EUR");
  });

  it("should format low value prices with 6 decimal places", () => {
    expect(renderPriceToHumanString(0.056789, "WETH")).toBe("0.056789 WETH");
    expect(renderPriceToHumanString(0.001234, "EUR")).toBe("0.001234 EUR");
  });

  it("should handle edge cases correctly", () => {
    expect(renderPriceToHumanString(0, "USD")).toBe("0.000000 USD");
    expect(renderPriceToHumanString(10, "USD")).toBe("10.00 USD");
  });
});
