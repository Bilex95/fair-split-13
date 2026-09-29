import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// Mock DOM elements before requiring app.js
global.document = {
  getElementById: (id) => {
    return {
      innerHTML: "",
      value: "",
      addEventListener: () => {},
      appendChild: () => {},
      setAttribute: () => {},
      classList: { add: () => {}, remove: () => {} },
    };
  },
  createElement: () => {
    return {
      innerHTML: "",
      value: "",
      addEventListener: () => {},
      appendChild: () => {},
      append: () => {},
      setAttribute: () => {},
      classList: { add: () => {}, remove: () => {} },
    };
  },
};

const { formatAmount, generateSummary, computeShares, state } = require("../app.js");

test("formatAmount formats integers with commas and no unnecessary decimals", () => {
  assert.equal(formatAmount(4500), "4,500");
  assert.equal(formatAmount(10500), "10,500");
  assert.equal(formatAmount(0), "0");
});

test("formatAmount formats decimals with two places and commas", () => {
  assert.equal(formatAmount(4500.5), "4,500.50");
  assert.equal(formatAmount(12.34), "12.34");
  assert.equal(formatAmount(1000.05), "1,000.05");
});

test("generateSummary formats plain-text summary matching group chat example", () => {
  const people = [
    { name: "Tobi", items: [] },
    { name: "Ada", items: [] },
    { name: "Emeka", items: [] },
  ];
  const shares = [4500, 3200, 2800];
  const output = generateSummary(people, shares, "2026-07-13");

  const expected = [
    "fair-split — 2026-07-13",
    "Tobi: 4,500",
    "Ada: 3,200",
    "Emeka: 2,800",
    "Total: 10,500",
  ].join("\n");

  assert.equal(output, expected);
});

test("generateSummary falls back to (unnamed) when name is missing", () => {
  const people = [{ name: "" }];
  const shares = [50];
  const output = generateSummary(people, shares, "2026-01-01");
  assert.ok(output.includes("(unnamed): 50"));
  assert.ok(output.includes("Total: 50"));
});
