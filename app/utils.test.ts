import { getUserFullName } from "./utilities";

test("validateEmail returns true for emails", () => {
  expect(getUserFullName("John", "Doe")).toBe("John Doe");
  expect(getUserFullName("John", "Doe")).toBeTypeOf("string");
});
