import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, BarChart3, TrendingUp, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: logs, isLoading: logsLoading } = trpc.irrigation.getLogs.useQuery();
  const { data: totalWaterSaved, isLoading: totalLoading } = trpc.irrigation.getTotalWaterSaved.useQuery();

  if (logsLoading || totalLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const avgWaterPerRecommendation = logs && logs.length > 0 ? totalWaterSaved! / logs.length : 0;
  const recommendationCount = logs?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || "User"}!</p>
          </div>
          <Button
            onClick={() => setLocation("/")}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Droplets className="w-4 h-4" />
            New Recommendation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Total Water Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">{totalWaterSaved?.toFixed(0) || 0}L</p>
              <p className="text-xs text-green-700 mt-1">Cumulative savings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{recommendationCount}</p>
              <p className="text-xs text-blue-700 mt-1">Total received</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Average Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-600">{avgWaterPerRecommendation.toFixed(0)}L</p>
              <p className="text-xs text-purple-700 mt-1">Per recommendation</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Recent Recommendations
            </CardTitle>
            <CardDescription>Your irrigation history and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            {logs && logs.length > 0 ? (
              <div className="space-y-3">
                {logs.slice(0, 5).map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{log.crop}</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {log.soil}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{log.location}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{log.recommendation}</p>
                      <p className="text-sm text-green-600 font-bold mt-1">
                        💧 {(typeof log.waterSaved === "string" ? parseFloat(log.waterSaved) : Number(log.waterSaved)).toFixed(0)}L saved
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Droplets className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No recommendations yet</p>
                <Button
                  onClick={() => setLocation("/")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Get Your First Recommendation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>✓ Check recommendations regularly for optimal results</p>
              <p>✓ Adjust based on local weather patterns</p>
              <p>✓ Monitor soil moisture before irrigation</p>
              <p>✓ Track your water savings progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>✓ Save up to 40% water annually</p>
              <p>✓ Reduce irrigation costs</p>
              <p>✓ Improve crop health</p>
              <p>✓ Contribute to sustainability</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
