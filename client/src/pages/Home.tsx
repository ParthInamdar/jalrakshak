import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Droplets, Leaf } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    location: "",
    crop: "",
    soil: "Loamy",
    lastIrrigationDate: "",
    fieldSize: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendationMutation = trpc.irrigation.getRecommendation.useMutation({
    onSuccess: (data) => {
      setIsLoading(false);
      toast.success("Recommendation generated!");
      // Store result in sessionStorage and navigate to results
      sessionStorage.setItem("irrigationResult", JSON.stringify(data));
      setLocation("/result");
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error("Failed to get recommendation: " + error.message);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSoilChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      soil: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.location || !formData.crop || !formData.lastIrrigationDate || !formData.fieldSize) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await getRecommendationMutation.mutateAsync({
        location: formData.location,
        crop: formData.crop,
        soil: formData.soil as "Clay" | "Loamy" | "Sandy",
        lastIrrigationDate: formData.lastIrrigationDate,
        fieldSize: parseFloat(formData.fieldSize),
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Droplets className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">JalRakshak</CardTitle>
            <CardDescription>Smart Irrigation Recommendation System</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Save water and optimize your irrigation with AI-powered recommendations based on weather and soil conditions.
            </p>
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              Sign In to Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <Droplets className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">JalRakshak</h1>
          <p className="text-gray-600">Smart Irrigation Recommendation System</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Get Your Irrigation Recommendation
            </CardTitle>
            <CardDescription>
              Provide your field details and we'll recommend the best irrigation schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Mumbai, Maharashtra"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crop">Crop Type</Label>
                  <Input
                    id="crop"
                    name="crop"
                    placeholder="e.g., Rice, Wheat, Cotton"
                    value={formData.crop}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="soil">Soil Type</Label>
                  <Select value={formData.soil} onValueChange={handleSoilChange}>
                    <SelectTrigger id="soil">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clay">Clay</SelectItem>
                      <SelectItem value="Loamy">Loamy</SelectItem>
                      <SelectItem value="Sandy">Sandy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fieldSize">Field Size (sq meters)</Label>
                  <Input
                    id="fieldSize"
                    name="fieldSize"
                    type="number"
                    placeholder="e.g., 1000"
                    value={formData.fieldSize}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastIrrigationDate">Last Irrigation Date</Label>
                <Input
                  id="lastIrrigationDate"
                  name="lastIrrigationDate"
                  type="date"
                  value={formData.lastIrrigationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-11"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recommendation...
                  </>
                ) : (
                  "Get Recommendation"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">💧 Water Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">Up to 40%</p>
              <p className="text-xs text-gray-600">Reduce water consumption</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">🌤️ Weather-Based</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">Real-time</p>
              <p className="text-xs text-gray-600">AI-powered recommendations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">📊 Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">Dashboard</p>
              <p className="text-xs text-gray-600">Monitor your savings</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
