"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, User } from 'lucide-react'
import { SplashScreen } from '@/components/splash-screen'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (username === 'admin' && password === 'password') {
            console.log("Hello")
        } else {
            setError('Invalid username or password')
        }
    }

    const [showSplash, setShowSplash] = useState(true)

    if (showSplash) {
        return <SplashScreen onFinish={() => setShowSplash(false)} />
    }

    return <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="text-2xl font-bold text-center">JalDristi Login</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="pl-10"
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
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Login
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>

}

