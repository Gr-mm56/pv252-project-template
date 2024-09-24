import { factorial } from "./factorial.ts";

test("factorial-5", () => {
  expect(factorial(5)).toBe(120);
});
test("factorial-0", () => {
  expect(factorial(0)).toBe(0);
});

test("factorial-minus", () => {
  const will_throw = () => {
    factorial(-1);
  };
  expect(will_throw).toThrow("Negative numbers not supported");
});
