"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, User, Loader, AlertCircle } from 'lucide-react';
import { SplashScreen } from "@/components/splash-screen";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser, setToken } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem("splashShown", "true");
    }
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { user, token } = response.data;

        setUser(user);
        setToken(token);
        sessionStorage.setItem('authToken', token);

        router.push("/create");
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.email}`,
          variant: "default",
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error during login:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center p-4 relative">
      <Image
        src="/water.jpg"
        alt="Water Background"
        layout="fill"
        objectFit="cover"
        className="opacity-20"
      />
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">
            JalDristi Login
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/50 backdrop-blur-sm focus:bg-white transition-all duration-300"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/50 backdrop-blur-sm focus:bg-white transition-all duration-300"
                  required
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 flex justify-center items-center text-lg font-semibold py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="animate-spin mr-2" />
              ) : null}
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

