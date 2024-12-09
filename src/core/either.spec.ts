import { left, right } from "./either";

test("success result", () => {
	const success = right("success");

	expect(success.value).toBe("success");
});

test("error result", () => {
	const error = left("error");

	expect(error.value).toBe("error");
});
