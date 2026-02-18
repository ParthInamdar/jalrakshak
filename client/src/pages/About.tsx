import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Leaf, TrendingDown, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button
          variant="outline"
          onClick={() => setLocation("/")}
          className="mb-8"
        >
          ← Back to Home
        </Button>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <Droplets className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About JalRakshak</h1>
          <p className="text-xl text-gray-600">Smart Irrigation Recommendation System</p>
        </div>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              JalRakshak is dedicated to revolutionizing agricultural water management through intelligent, data-driven irrigation recommendations. We believe that smart irrigation is key to sustainable farming and water conservation.
            </p>
            <p>
              Our platform combines real-time weather data, soil analysis, and crop-specific requirements to provide farmers with actionable recommendations that maximize crop yield while minimizing water waste.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Sustainable Farming
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p>
                We help farmers reduce water consumption by up to 40% while maintaining or improving crop health through intelligent irrigation scheduling.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                Cost Reduction
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p>
                Lower water consumption directly translates to reduced irrigation costs, helping farmers improve their bottom line while being environmentally responsible.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-cyan-600" />
                Weather-Based Decisions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p>
                Our AI-powered system analyzes real-time weather patterns, soil conditions, and historical data to provide accurate, timely irrigation recommendations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Farmer-Centric Design
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p>
                Built by farmers, for farmers. Our intuitive interface makes it easy for anyone to get started with smart irrigation management.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Our intelligent recommendation process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">
                  1
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Input Field Details</h4>
                <p className="text-gray-700">Provide information about your location, crop type, soil conditions, and last irrigation date.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">
                  2
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Analyze Weather & Soil</h4>
                <p className="text-gray-700">Our system fetches real-time weather data and considers soil water retention capacity.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">
                  3
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Generate Recommendation</h4>
                <p className="text-gray-700">Based on AI analysis, we provide a specific irrigation recommendation with water savings estimate.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">
                  4
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Track & Optimize</h4>
                <p className="text-gray-700">Monitor your water savings over time and optimize your irrigation strategy continuously.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
            <CardDescription>Built with modern, reliable technologies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Frontend</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• React 19 with TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• shadcn/ui components</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Backend</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Node.js with Express</li>
                  <li>• tRPC for type-safe APIs</li>
                  <li>• MySQL database</li>
                  <li>• Drizzle ORM</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-green-300">
          <CardHeader>
            <CardTitle>Get Started Today</CardTitle>
            <CardDescription>Join thousands of farmers saving water and money</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Start getting smart irrigation recommendations tailored to your farm's unique conditions. It only takes a few minutes to set up.
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              Get Your First Recommendation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
