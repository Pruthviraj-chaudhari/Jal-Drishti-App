'use client'

import { useState } from 'react'
import { Camera, Upload, MapPin, Send, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProgressBar } from "@/components/progress-bar"

export default function JalDristi() {
  const [image, setImage] = useState<string | null>(null)
  const [location, setLocation] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [department, setDepartment] = useState<string>('')
  const [category, setCategory] = useState<string>('')

  const captureImage = () => {
    // This would typically use the device's camera API
    console.log('Capturing image...')
  }

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setIsUploading(false)
        setUploadProgress(100)
      }
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(progress)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`)
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  const submitReport = (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Submitting report...', { department, category })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-2xl font-bold text-center">JalDristi</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <form onSubmit={submitReport} className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-center space-x-2">
                <Button onClick={captureImage} className="flex-1 bg-green-500 hover:bg-green-600">
                  <Camera className="mr-2 h-4 w-4" /> Capture
                </Button>
                <Button asChild className="flex-1 bg-blue-500 hover:bg-blue-600">
                  <label>
                    <Upload className="mr-2 h-4 w-4" /> Upload
                    <input type="file" className="hidden" onChange={uploadImage} accept="image/*" />
                  </label>
                </Button>
              </div>
              {isUploading && (
                <ProgressBar progress={uploadProgress} />
              )}
              {image && (
                <div className="mt-2">
                  <img src={image} alt="Captured" className="w-full rounded-lg" />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Location" 
                value={location || ''} 
                readOnly 
                className="flex-grow"
              />
              <Button onClick={getLocation} type="button" className="bg-yellow-500 hover:bg-yellow-600">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>

            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="water">Department of Water</SelectItem>
                <SelectItem value="environment">Department of Environment</SelectItem>
                <SelectItem value="urban">Department of Urban Development</SelectItem>
                <SelectItem value="rural">Department of Rural Development</SelectItem>
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select issue category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="leakage">Water Leakage</SelectItem>
                <SelectItem value="quality">Water Quality</SelectItem>
                <SelectItem value="scarcity">Water Scarcity</SelectItem>
                <SelectItem value="drainage">Drainage Issue</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Textarea placeholder="Describe the issue..." />

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Please ensure all information is accurate before submitting.
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
              <Send className="mr-2 h-4 w-4" /> Submit Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

