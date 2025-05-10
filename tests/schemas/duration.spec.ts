import { DurationSchema } from "../../src/schemas/duration";
import { describe, it, expect } from "vitest";

describe("DurationSchema", () => {
  it("should accept an object with only years property", () => {
    const result = DurationSchema.safeParse({ years: 1 });
    expect(result.success).toBe(true);
  });

  it("should accept an object with only months property", () => {
    const result = DurationSchema.safeParse({ months: 1 });
    expect(result.success).toBe(true);
  });

  it("should accept an object with only days property", () => {
    const result = DurationSchema.safeParse({ days: 1 });
    expect(result.success).toBe(true);
  });

  it("should accept an object with only hours property", () => {
    const result = DurationSchema.safeParse({ hours: 1 });
    expect(result.success).toBe(true);
  });

  it("should accept an object with only minutes property", () => {
    const result = DurationSchema.safeParse({ minutes: 1 });
    expect(result.success).toBe(true);
  });

  it("should accept an object with only seconds property", () => {
    const result = DurationSchema.safeParse({ seconds: 1 });
    expect(result.success).toBe(true);
  });

  it("should accept an object with multiple duration properties", () => {
    const result = DurationSchema.safeParse({
      years: 1,
      months: 2,
      days: 3,
      hours: 4,
      minutes: 5,
      seconds: 6,
    });
    expect(result.success).toBe(true);
  });

  it("should reject an empty object", () => {
    const result = DurationSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should reject when all properties are undefined", () => {
    const result = DurationSchema.safeParse({
      years: undefined,
      months: undefined,
      days: undefined,
      hours: undefined,
      minutes: undefined,
      seconds: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("should reject negative values for years", () => {
    const result = DurationSchema.safeParse({ years: -1 });
    expect(result.success).toBe(false);
  });

  it("should reject negative values for months", () => {
    const result = DurationSchema.safeParse({ months: -1 });
    expect(result.success).toBe(false);
  });

  it("should reject negative values for days", () => {
    const result = DurationSchema.safeParse({ days: -1 });
    expect(result.success).toBe(false);
  });

  it("should reject negative values for hours", () => {
    const result = DurationSchema.safeParse({ hours: -1 });
    expect(result.success).toBe(false);
  });

  it("should reject negative values for minutes", () => {
    const result = DurationSchema.safeParse({ minutes: -1 });
    expect(result.success).toBe(false);
  });

  it("should reject negative values for seconds", () => {
    const result = DurationSchema.safeParse({ seconds: -1 });
    expect(result.success).toBe(false);
  });

  it("should reject additional unknown properties", () => {
    const result = DurationSchema.safeParse({
      years: 1,
      unknown: "value",
    });
    expect(result.success).toBe(false);
  });

  it("should reject non-number values", () => {
    const result = DurationSchema.safeParse({
      years: "1" as unknown as number,
    });
    expect(result.success).toBe(false);
  });
});
