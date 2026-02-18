/**
 * Irrigation decision logic based on weather and soil conditions
 */
export function getIrrigationDecision(
  lastIrrigationDate: string,
  rainProbability: number,
  soil: string
): string {
  const today = new Date();
  const lastDate = new Date(lastIrrigationDate);
  const daysSince = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  // Adjust thresholds based on soil type
  const soilWaterRetention: Record<string, number> = {
    Clay: 7,    // Clay retains water longer
    Loamy: 5,   // Loamy is balanced
    Sandy: 3,   // Sandy drains quickly
  };

  const maxDaysBetweenIrrigation = soilWaterRetention[soil] || 5;

  // Decision logic
  if (rainProbability > 60 && daysSince < 3) {
    return "Delay irrigation by 1-2 days";
  } else if (daysSince >= maxDaysBetweenIrrigation) {
    return "Irrigation recommended today";
  } else {
    return "Monitor soil conditions";
  }
}

/**
 * Calculate water saved based on delayed irrigation
 */
export function calculateWaterSaved(fieldSize: number, daysDelayed: number): number {
  const avgWaterPerDay = 5; // liters per sq meter (approx)
  return fieldSize * avgWaterPerDay * daysDelayed;
}

/**
 * Determine days delayed based on recommendation
 */
export function getDaysDelayed(recommendation: string): number {
  if (recommendation.includes("Delay")) {
    return 2; // Assume 2 days delay if recommendation is to delay
  }
  return 0;
}
