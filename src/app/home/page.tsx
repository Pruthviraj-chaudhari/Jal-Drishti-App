/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Upload, MapPin, Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ProgressBar } from '@/components/progress-bar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';


type Department = {
  _id: string;
  name: string;
};

function JalDristi() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [uploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [department, setDepartment] = useState<string>('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isLoadingDepartments, setIsLoadingDepartments] = useState<boolean>(true);

  const router = useRouter();



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/departments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }
        const data: Department[] = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [router]);

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
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!department || !category || !imageFile || !location || !description.trim()) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    const [latitude, longitude] = location.split(', ');

    const userData = localStorage.getItem('user') || '';

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('department_id', department);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('user', userData);

    try {
      const token = localStorage.getItem('token');
      setIsUploading(true);
      const response = await fetch('http://localhost:8000/api/incidents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      setIsUploading(false);
      if (!response.ok) {
        throw new Error('Failed to submit the report.');
      }

      await response.json();
      alert('Incident submitted successfully!');
      router.push('/incidents');
    } catch (error) {
      console.error('Error submitting the report:', error);
      alert('An error occurred while submitting the report.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-2xl font-bold text-center">Create Incident</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <div className="flex justify-center space-x-2">
                <Button asChild className="flex-1 bg-blue-500 hover:bg-blue-600">
                  <label>
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </Button>
              </div>
              {isUploading && <ProgressBar progress={uploadProgress} />}
              {imagePreview && (
                <div className="mt-2">
                  <Image src={imagePreview} alt="Preview" width={300} height={200} className="rounded-lg" />
                </div>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center space-x-2">
              <Input placeholder="Location" value={location || ''} readOnly className="flex-grow" />
              <Button onClick={getLocation} type="button" className="bg-yellow-500 hover:bg-yellow-600">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>

            {/* Department */}
            <div className="space-y-2">
              {isLoadingDepartments ? (
                <div className="space-y-2">
                  {[...Array(1)].map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
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

            {/* Category */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
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

            {/* Description */}
            <Textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Alert */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>Ensure all details are correct before submission.</AlertDescription>
            </Alert>

            {/* Submit */}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              <Send className="mr-2 h-4 w-4" /> Submit Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default JalDristi;
