import { factorial, initFactorialUi } from "./factorial.ts";

test("factorial-5", () => {
  expect(factorial(5)).toBe(120);
});
test("factorial-0", () => {
  expect(factorial(0)).toBe(1);
});
test("factorial-16", () => {
  expect(factorial(16)).toBe(20922789888000 );
});
test("factorial-minus", () => {
  const will_throw = () => {
    factorial(-1);
  };
  expect(will_throw).toThrow("Negative numbers not supported");
});
test("set factorial component innerHTML", () =>{
  const mockComponent = { innerHTML: "" } as HTMLElement;
  initFactorialUi(mockComponent);
  expect(mockComponent.innerHTML).toBe(
    'Factorial value <code>5!</code> is <code>120</code>.'
  );
})
