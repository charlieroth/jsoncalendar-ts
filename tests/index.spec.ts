import { hello } from "../src/index";
import { describe, it } from "vitest";

describe("hello", () => {
  it("should log 'Hello, world!'", () => {
    hello();
  });
});
