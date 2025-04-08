
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentData } from '@/components/StudentForm';
import { formatDistanceToNow } from 'date-fns';

interface HistoryListProps {
  history: StudentData[];
  onSelect: (data: StudentData) => void;
  onClearHistory: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onClearHistory }) => {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-6">No history yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">History</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClearHistory}
        >
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="max-h-[300px] overflow-y-auto">
        <div className="space-y-2">
          {history.map((item, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center p-3 bg-secondary rounded-md hover:bg-secondary/60 cursor-pointer transition-colors"
              onClick={() => onSelect(item)}
            >
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex space-x-2 text-xs text-muted-foreground">
                  <span>{item.classAndDivision}</span>
                  <span>•</span>
                  <span>Roll: {item.rollNumber}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Created {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                </div>
              </div>
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img 
                  src={item.photo} 
                  alt={item.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryList;
