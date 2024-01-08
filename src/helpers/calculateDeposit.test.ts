import { expect, it, describe } from "@jest/globals";
import calculateDeposit from "./calculateDeposit";

describe("calculateDeposit", () => {
  it("should return first currency if first profit is greater", () => {
    const result = calculateDeposit("USD", 5, 2, "EUR", 2);
    expect(result).toBe("USD");
  });

  it("should return second currency if second profit is greater", () => {
    const result = calculateDeposit("USD", 3, 2, "EUR", 5);
    expect(result).toBe("EUR");
  });

  it("should return first currency if profits are equal", () => {
    const result = calculateDeposit("USD", 4, 2, "EUR", 2);
    expect(result).toBe("USD");
  });
});

