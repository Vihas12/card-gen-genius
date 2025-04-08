
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export interface StudentData {
  name: string;
  rollNumber: string;
  classAndDivision: string;
  allergies: string[];
  photo: string;
  rackNumber: string;
  busRouteNumber: string;
  createdAt: number;
}

interface StudentFormProps {
  onSubmit: (data: StudentData) => void;
  initialData?: StudentData;
}

const DEFAULT_PHOTO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzYiIHI9IjIwIiBmaWxsPSIjZDFkNWRiIi8+PHBhdGggZD0iTTI1LDg2IGE0MCw0MCAwIDAgMSA1MCwwIHoiIGZpbGw9IiNkMWQ1ZGIiLz48L3N2Zz4=';

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [rollNumber, setRollNumber] = useState(initialData?.rollNumber || '');
  const [classAndDivision, setClassAndDivision] = useState(initialData?.classAndDivision || '');
  const [allergies, setAllergies] = useState<string[]>(initialData?.allergies || []);
  const [photo, setPhoto] = useState<string>(initialData?.photo || DEFAULT_PHOTO);
  const [rackNumber, setRackNumber] = useState(initialData?.rackNumber || '');
  const [busRouteNumber, setBusRouteNumber] = useState(initialData?.busRouteNumber || '');

  const { toast } = useToast();

  const classOptions = ['1-A', '1-B', '2-A', '2-B', '3-A', '3-B', '4-A', '4-B', '5-A', '5-B'];
  const busRouteOptions = ['Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 5'];
  const allergyOptions = [
    { id: 'nuts', label: 'Nuts' },
    { id: 'dairy', label: 'Dairy' },
    { id: 'eggs', label: 'Eggs' },
    { id: 'pollen', label: 'Pollen' },
    { id: 'gluten', label: 'Gluten' },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 1MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAllergyChange = (allergyId: string) => {
    setAllergies((current) =>
      current.includes(allergyId)
        ? current.filter(id => id !== allergyId)
        : [...current, allergyId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !rollNumber || !classAndDivision || !rackNumber || !busRouteNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      name,
      rollNumber,
      classAndDivision,
      allergies,
      photo,
      rackNumber,
      busRouteNumber,
      createdAt: Date.now(),
    });

    toast({
      title: "Success",
      description: "Student ID card created successfully",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
        <CardDescription>Enter student details to generate an ID card</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll Number *</Label>
            <Input
              id="rollNumber"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="e.g. R12345"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="classAndDivision">Class & Division *</Label>
            <Select
              value={classAndDivision}
              onValueChange={setClassAndDivision}
              required
            >
              <SelectTrigger id="classAndDivision">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rackNumber">Rack Number *</Label>
            <Input
              id="rackNumber"
              value={rackNumber}
              onChange={(e) => setRackNumber(e.target.value)}
              placeholder="e.g. A12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="busRouteNumber">Bus Route Number *</Label>
            <Select 
              value={busRouteNumber} 
              onValueChange={setBusRouteNumber}
              required
            >
              <SelectTrigger id="busRouteNumber">
                <SelectValue placeholder="Select bus route" />
              </SelectTrigger>
              <SelectContent>
                {busRouteOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Allergies (if any)</Label>
            <div className="grid grid-cols-2 gap-2">
              {allergyOptions.map((allergy) => (
                <div key={allergy.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`allergy-${allergy.id}`}
                    checked={allergies.includes(allergy.id)}
                    onCheckedChange={() => handleAllergyChange(allergy.id)}
                  />
                  <label
                    htmlFor={`allergy-${allergy.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {allergy.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Student Photo</Label>
            <div className="flex flex-col items-center space-y-2">
              <div className="photo-upload-container">
                {photo && <img src={photo} alt="Student" className="object-cover" />}
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Click to upload (Max: 1MB)</p>
            </div>
          </div>

          <Button type="submit" className="w-full">Generate ID Card</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
