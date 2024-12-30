'use client';

import { useEffect, useState } from 'react';
import { Upload, MapPin, Send, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/mapcomponent'), { ssr: false });

type Department = {
  _id: string;
  name: string;
};

function JalDristi() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [department, setDepartment] = useState<string>('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isLoadingDepartments, setIsLoadingDepartments] = useState<boolean>(true);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/departments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data: Department[] = response.data;
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [router, token]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location access failed",
            description: "Please choose a location on the map.",
            variant: "destructive"
          });
          setIsMapModalOpen(true);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      toast({
        title: "Geolocation not supported",
        description: "Please choose a location on the map.",
        variant: "destructive"
      });
      setIsMapModalOpen(true);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLocation(`${lat}, ${lng}`);
    setIsMapModalOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!department || !category || !imageFile || !location || !description.trim()) {
      toast({
        title: "Incomplete form",
        description: "Please fill out all fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    const [latitude, longitude] = location.split(", ");
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("department", department);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/user/incidents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 201) {
        throw new Error("Failed to submit the report.");
      }

      toast({
        title: "Incident submitted successfully!",
        description: "We'll get back to you soon.",
      });
      router.push("/incidents");
    } catch (error) {
      console.error("Error submitting the report:", error);
      toast({
        title: "Error occurred",
        description: "An error occurred while submitting the report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-4 sm:p-6 md:p-8">
      <Card className="max-w-lg mx-auto shadow-xl">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-2xl font-bold text-center">Create Incident</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <div className="flex justify-center">
                <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200">
                  <label className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" /> {imageFile ? 'Change Image' : 'Upload Image'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </Button>
              </div>
              {imagePreview && (
                <div className="mt-2 relative">
                  <Image src={imagePreview} alt="Preview" width={300} height={200} className="rounded-lg w-full object-cover" />
                  <Button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-1"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Location"
                value={location || ''}
                readOnly
                className="flex-grow bg-gray-100"
              />
              <Button
                onClick={getLocation}
                type="button"
                className="bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200"
              >
                <MapPin className="h-4 w-4" />
              </Button>
              <Dialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen}>
                <DialogTrigger asChild>
                  <Button type="button" className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200">
                    Choose on Map
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Choose Location on Map</DialogTitle>
                  </DialogHeader>
                  <div className="h-[300px] w-full">
                    <MapComponent
                     onLocationSelect={handleMapClick} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Department and Category */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                {isLoadingDepartments ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger id="department" className="w-full">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept._id} value={dept._id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Issue Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select Issue Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flood">Flood</SelectItem>
                    <SelectItem value="leakage">Water Leakage</SelectItem>
                    <SelectItem value="quality">Water Quality</SelectItem>
                    <SelectItem value="scarcity">Water Scarcity</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Alert */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>Ensure all details are correct before submission.</AlertDescription>
            </Alert>

            {/* Submit */}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Submit Report
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default JalDristi;

