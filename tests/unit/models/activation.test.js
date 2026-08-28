import activation from "models/activation.js";

describe("models/activation", () => {
  describe("ACTIVATION_FEATURES", () => {
    test("Should contain the expected default features after activation", () => {
      expect(activation.ACTIVATION_FEATURES).toEqual([
        "create:session",
        "read:session",
        "update:user",
        "create:warehouse_schedule",
      ]);
    });
  });
});
