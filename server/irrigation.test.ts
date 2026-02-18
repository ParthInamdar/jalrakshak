import { describe, expect, it } from "vitest";
import { getIrrigationDecision, calculateWaterSaved, getDaysDelayed } from "./irrigation";

describe("Irrigation Logic", () => {
  describe("getIrrigationDecision", () => {
    it("should recommend delay when rain probability is high and last irrigation was recent", () => {
      const today = new Date();
      const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
      const lastIrrigationDate = twoDaysAgo.toISOString().split('T')[0];

      const decision = getIrrigationDecision(lastIrrigationDate, 70, "Loamy");
      expect(decision).toBe("Delay irrigation by 1-2 days");
    });

    it("should recommend irrigation when days since last irrigation exceeds soil threshold", () => {
      const today = new Date();
      const sixDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
      const lastIrrigationDate = sixDaysAgo.toISOString().split('T')[0];

      const decision = getIrrigationDecision(lastIrrigationDate, 20, "Loamy");
      expect(decision).toBe("Irrigation recommended today");
    });

    it("should recommend monitoring for clay soil when days are within threshold", () => {
      const today = new Date();
      const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
      const lastIrrigationDate = threeDaysAgo.toISOString().split('T')[0];

      const decision = getIrrigationDecision(lastIrrigationDate, 30, "Clay");
      expect(decision).toBe("Monitor soil conditions");
    });

    it("should recommend irrigation sooner for sandy soil", () => {
      const today = new Date();
      const fourDaysAgo = new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000);
      const lastIrrigationDate = fourDaysAgo.toISOString().split('T')[0];

      const decision = getIrrigationDecision(lastIrrigationDate, 20, "Sandy");
      expect(decision).toBe("Irrigation recommended today");
    });
  });

  describe("calculateWaterSaved", () => {
    it("should calculate water saved correctly", () => {
      const waterSaved = calculateWaterSaved(100, 2); // 100 sq meters, 2 days delayed
      expect(waterSaved).toBe(1000); // 100 * 5 * 2 = 1000 liters
    });

    it("should return 0 for no delay", () => {
      const waterSaved = calculateWaterSaved(100, 0);
      expect(waterSaved).toBe(0);
    });

    it("should handle decimal field sizes", () => {
      const waterSaved = calculateWaterSaved(50.5, 1);
      expect(waterSaved).toBe(252.5); // 50.5 * 5 * 1 = 252.5 liters
    });
  });

  describe("getDaysDelayed", () => {
    it("should return 2 for delay recommendation", () => {
      const daysDelayed = getDaysDelayed("Delay irrigation by 1-2 days");
      expect(daysDelayed).toBe(2);
    });

    it("should return 0 for irrigation recommendation", () => {
      const daysDelayed = getDaysDelayed("Irrigation recommended today");
      expect(daysDelayed).toBe(0);
    });

    it("should return 0 for monitor recommendation", () => {
      const daysDelayed = getDaysDelayed("Monitor soil conditions");
      expect(daysDelayed).toBe(0);
    });
  });
});
