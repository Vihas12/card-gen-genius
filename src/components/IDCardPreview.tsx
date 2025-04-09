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
      <div className="bg-education-blue text-white py-5 px-4 text-center">
        <h2 className="text-2xl font-bold">UNITY SCHOOL</h2>
        <p className="text-sm">Student Identification Card</p>
      </div>

      <div className="p-5 flex flex-col items-center">
        <div className="photo-container border-4 border-education-blue my-4">
          <img src={studentData.photo} alt={studentData.name} className="w-full h-full object-cover" />
        </div>

        <h3 className="text-xl font-bold text-center mb-2">{studentData.name}</h3>
        <p className="text-base text-gray-600 text-center">Class: {studentData.classAndDivision}</p>
        <p className="text-base text-gray-600 text-center mb-5">Roll: {studentData.rollNumber}</p>

        <div className="w-full space-y-3 mb-5">
          <div className="flex justify-between text-base">
            <span className="font-medium">Rack Number:</span>
            <span>{studentData.rackNumber}</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="font-medium">Bus Route:</span>
            <span>{studentData.busRouteNumber}</span>
          </div>

          {studentData.allergies.length > 0 && (
            <div className="mt-3">
              <p className="text-base font-medium mb-2">Allergies:</p>
              <div className="flex flex-wrap gap-1">
                {studentData.allergies.map((allergy) => (
                  <Badge key={allergy} variant="destructive" className="text-sm">
                    {getAllergyLabel(allergy)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto mb-4 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm w-full flex flex-col items-center">
          <QRCodeSVG value={qrCodeData} size={120} bgColor="#FFFFFF" fgColor="#333333" />
          <p className="text-sm text-center mt-2 text-gray-500">Scan for complete details</p>
        </div>
      </div>
    </div>
  );

  const Template2 = () => (
    <div className="id-card id-card-template2 rounded-lg overflow-hidden" ref={cardRef}>
      <div className="relative h-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-education-blue to-education-purple opacity-80"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <h2 className="text-2xl font-bold text-white">UNITY SCHOOL</h2>
        </div>
      </div>

      <div className="p-6 flex flex-col items-center relative">
        <div className="photo-container border-2 border-white my-4 shadow-lg">
          <img src={studentData.photo} alt={studentData.name} className="w-full h-full object-cover" />
        </div>

        <div className="text-center mb-5">
          <h3 className="text-2xl font-bold text-white">{studentData.name}</h3>
          <div className="flex justify-center space-x-3 mt-2">
            <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-base">
              {studentData.classAndDivision}
            </Badge>
            <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-base">
              Roll: {studentData.rollNumber}
            </Badge>
          </div>
        </div>

        <div className="w-full bg-white/10 rounded-lg p-4 space-y-3 mb-5 backdrop-blur-sm">
          <div className="flex justify-between text-base text-white">
            <span className="font-medium">Rack Number:</span>
            <span>{studentData.rackNumber}</span>
          </div>
          <div className="flex justify-between text-base text-white">
            <span className="font-medium">Bus Route:</span>
            <span>{studentData.busRouteNumber}</span>
          </div>

          {studentData.allergies.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/20">
              <p className="text-base font-medium mb-2 text-white">Allergies:</p>
              <div className="flex flex-wrap gap-2">
                {studentData.allergies.map((allergy) => (
                  <Badge key={allergy} className="bg-red-500 text-white border-none text-sm">
                    {getAllergyLabel(allergy)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto mb-2 bg-white p-4 rounded-lg shadow-md w-full flex flex-col items-center">
          <QRCodeSVG value={qrCodeData} size={120} bgColor="#FFFFFF" fgColor="#333333" />
          <p className="text-sm text-center mt-2 text-gray-600 font-medium">Scan for complete details</p>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="p-4 flex flex-col items-center">
      <div className="mb-4">
        {template === 'template1' ? <Template1 /> : <Template2 />}
      </div>
      <Button onClick={downloadCard} className="mt-4 w-full max-w-[450px]">
        <Download className="mr-2 h-4 w-4" /> Download as PNG
      </Button>
    </Card>
  );
};

export default IDCardPreview;
