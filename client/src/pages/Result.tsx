import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, ArrowLeft, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface RecommendationResult {
  recommendation: string;
  temperature: number;
  humidity: number;
  rainProbability: number;
  waterSaved: number;
}

export default function Result() {
  const [, setLocation] = useLocation();
  const [result, setResult] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem("irrigationResult");
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        setResult(parsed);
      } catch (error) {
        console.error("Failed to parse result:", error);
        setLocation("/");
      }
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getRecommendationColor = (rec: string) => {
    if (rec.includes("Delay")) return "bg-yellow-50 border-yellow-200";
    if (rec.includes("Irrigation recommended")) return "bg-red-50 border-red-200";
    return "bg-blue-50 border-blue-200";
  };

  const getRecommendationIcon = (rec: string) => {
    if (rec.includes("Delay")) return "⏸️";
    if (rec.includes("Irrigation recommended")) return "💧";
    return "📊";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Button
          variant="outline"
          onClick={() => setLocation("/")}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <Droplets className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Recommendation</h1>
          <p className="text-gray-600">Based on current weather and soil conditions</p>
        </div>

        <Card className={`shadow-lg border-2 mb-6 ${getRecommendationColor(result.recommendation)}`}>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <span className="text-3xl">{getRecommendationIcon(result.recommendation)}</span>
              {result.recommendation}
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{result.temperature}°C</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Humidity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{result.humidity}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Rain Probability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-cyan-600">{result.rainProbability}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Water Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{result.waterSaved.toFixed(0)}L</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              Impact Summary
            </CardTitle>
            <CardDescription>
              Following this recommendation will help you conserve water efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded border border-green-100">
              <span className="text-gray-700">Estimated Water Saved</span>
              <span className="font-bold text-green-600">{result.waterSaved.toFixed(2)} liters</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded border border-blue-100">
              <span className="text-gray-700">Current Weather Status</span>
              <span className="font-bold text-blue-600">
                {result.rainProbability > 60 ? "Rainy" : "Dry"}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded border border-orange-100">
              <span className="text-gray-700">Temperature Condition</span>
              <span className="font-bold text-orange-600">
                {result.temperature > 30 ? "Hot" : result.temperature > 20 ? "Moderate" : "Cool"}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            onClick={() => setLocation("/dashboard")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-11"
            size="lg"
          >
            View Dashboard
          </Button>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="flex-1 h-11"
            size="lg"
          >
            New Recommendation
          </Button>
        </div>
      </div>
    </div>
  );
}
