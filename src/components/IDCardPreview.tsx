
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { StudentData } from '@/components/StudentForm';
import { useToast } from '@/hooks/use-toast';

interface IDCardPreviewProps {
  studentData: StudentData;
  template: 'template1' | 'template2';
}

const getAllergyLabel = (id: string): string => {
  const allergyMap: Record<string, string> = {
    'nuts': 'Nuts',
    'dairy': 'Dairy',
    'eggs': 'Eggs',
    'pollen': 'Pollen',
    'gluten': 'Gluten',
  };
  return allergyMap[id] || id;
};

const IDCardPreview: React.FC<IDCardPreviewProps> = ({ studentData, template }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const downloadCard = async () => {
    if (cardRef.current === null) {
      return;
    }
    
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true });
      
      const link = document.createElement('a');
      link.download = `student-id-${studentData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Download complete",
        description: "ID card has been downloaded successfully",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Download failed",
        description: "There was an error downloading the ID card",
        variant: "destructive",
      });
    }
  };

  const qrCodeData = JSON.stringify(studentData);
  
  const Template1 = () => (
    <div className="id-card id-card-template1 bg-white rounded-lg overflow-hidden" ref={cardRef}>
      <div className="bg-education-blue text-white py-4 px-4 text-center">
        <h2 className="text-xl font-bold">UNITY SCHOOL</h2>
        <p className="text-sm">Student Identification Card</p>
      </div>
      
      <div className="p-4 flex flex-col items-center">
        <div className="photo-container border-4 border-education-blue my-4">
          <img src={studentData.photo} alt={studentData.name} className="w-full h-full object-cover" />
        </div>
        
        <h3 className="text-lg font-bold text-center mb-1">{studentData.name}</h3>
        <p className="text-sm text-gray-600 text-center">Class: {studentData.classAndDivision}</p>
        <p className="text-sm text-gray-600 text-center mb-4">Roll: {studentData.rollNumber}</p>
        
        <div className="w-full space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Rack Number:</span>
            <span>{studentData.rackNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Bus Route:</span>
            <span>{studentData.busRouteNumber}</span>
          </div>
          
          {studentData.allergies.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Allergies:</p>
              <div className="flex flex-wrap gap-1">
                {studentData.allergies.map((allergy) => (
                  <Badge key={allergy} variant="destructive" className="text-xs">
                    {getAllergyLabel(allergy)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-auto mb-4">
          <QRCodeSVG value={qrCodeData} size={100} />
          <p className="text-xs text-center mt-1 text-gray-500">Scan for complete details</p>
        </div>
      </div>
    </div>
  );

  const Template2 = () => (
    <div className="id-card id-card-template2 rounded-lg overflow-hidden" ref={cardRef}>
      <div className="relative h-24 overflow-hidden">
        <div className="absolute inset-0 bg-education-purple opacity-20"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <h2 className="text-2xl font-bold text-white">UNITY SCHOOL</h2>
        </div>
      </div>
      
      <div className="p-5 flex flex-col items-center relative">
        <div className="photo-container border-2 border-white my-4 shadow-lg">
          <img src={studentData.photo} alt={studentData.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold">{studentData.name}</h3>
          <div className="flex justify-center space-x-3 mt-1">
            <Badge variant="outline" className="bg-white/20 text-white">
              {studentData.classAndDivision}
            </Badge>
            <Badge variant="outline" className="bg-white/20 text-white">
              Roll: {studentData.rollNumber}
            </Badge>
          </div>
        </div>
        
        <div className="w-full bg-white/10 rounded-lg p-3 space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Rack Number:</span>
            <span>{studentData.rackNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Bus Route:</span>
            <span>{studentData.busRouteNumber}</span>
          </div>
          
          {studentData.allergies.length > 0 && (
            <div className="mt-3 pt-2 border-t border-white/20">
              <p className="text-sm font-medium mb-2">Allergies:</p>
              <div className="flex flex-wrap gap-1">
                {studentData.allergies.map((allergy) => (
                  <Badge key={allergy} className="bg-red-500 text-white border-none text-xs">
                    {getAllergyLabel(allergy)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-auto mb-2 bg-white p-2 rounded-lg">
          <QRCodeSVG value={qrCodeData} size={100} />
          <p className="text-xs text-center mt-1 text-gray-500">Scan for complete details</p>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="p-4 flex flex-col items-center">
      <div className="mb-4">
        {template === 'template1' ? <Template1 /> : <Template2 />}
      </div>
      <Button onClick={downloadCard} className="mt-4 w-full max-w-[338px]">
        <Download className="mr-2 h-4 w-4" /> Download as PNG
      </Button>
    </Card>
  );
};

export default IDCardPreview;
