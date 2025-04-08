
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import StudentForm, { StudentData } from '@/components/StudentForm';
import IDCardPreview from '@/components/IDCardPreview';
import HistoryList from '@/components/HistoryList';
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = 'student-id-history';

const Index = () => {
  const [currentTab, setCurrentTab] = useState<'form' | 'preview'>('form');
  const [currentStudent, setCurrentStudent] = useState<StudentData | null>(null);
  const [history, setHistory] = useState<StudentData[]>([]);
  const [templateStyle, setTemplateStyle] = useState<'template1' | 'template2'>('template1');
  const { toast } = useToast();

  // Load history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      toast({
        title: "Error loading history",
        description: "There was a problem loading your saved cards",
        variant: "destructive",
      });
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }, [history]);

  const handleFormSubmit = (data: StudentData) => {
    setCurrentStudent(data);
    setHistory((prev) => [data, ...prev]);
    setCurrentTab('preview');
  };

  const handleSelectFromHistory = (data: StudentData) => {
    setCurrentStudent(data);
    setCurrentTab('preview');
  };

  const handleClearHistory = () => {
    setHistory([]);
    if (currentTab === 'preview') {
      setCurrentTab('form');
      setCurrentStudent(null);
    }
    toast({
      title: "History cleared",
      description: "All saved ID cards have been removed",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-center">Smart Student ID Generator</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as 'form' | 'preview')}>
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="form">Student Form</TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  disabled={!currentStudent}
                >
                  ID Card Preview
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="form" className="mt-0">
                <StudentForm onSubmit={handleFormSubmit} initialData={currentStudent || undefined} />
              </TabsContent>
              
              <TabsContent value="preview" className="mt-0">
                {currentStudent && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Label htmlFor="template-style" className="whitespace-nowrap">Template Style:</Label>
                      <Select
                        value={templateStyle}
                        onValueChange={(v) => setTemplateStyle(v as 'template1' | 'template2')}
                      >
                        <SelectTrigger id="template-style" className="w-40">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="template1">Classic Blue</SelectItem>
                          <SelectItem value="template2">Modern Gradient</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <IDCardPreview 
                      studentData={currentStudent} 
                      template={templateStyle}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-5">
            <HistoryList 
              history={history} 
              onSelect={handleSelectFromHistory} 
              onClearHistory={handleClearHistory}
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 p-4 border-t mt-12">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 Smart Student ID Generator</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
