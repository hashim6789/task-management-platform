import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md shadow-2xl transition-all duration-300 hover sonar-3xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-orange-600 p-3 text-white shadow-md">
              <AlertCircle className="h-7 w-7" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Page Not Found
          </CardTitle>
          <p className="text-gray-600 text-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 px-6">
          <p className="text-center text-gray-500 text-sm">
            Let's get you back to a familiar place.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 transition-all duration-200"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
