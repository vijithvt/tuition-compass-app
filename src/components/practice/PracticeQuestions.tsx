
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Check, Clock } from 'lucide-react';

const PracticeQuestions: React.FC = () => {
  const [markedQuestions, setMarkedQuestions] = useState<string[]>([]);

  const toggleMark = (questionId: string) => {
    if (markedQuestions.includes(questionId)) {
      setMarkedQuestions(markedQuestions.filter(id => id !== questionId));
    } else {
      setMarkedQuestions([...markedQuestions, questionId]);
    }
  };

  return (
    <section id="practice" className="py-8 animate-fade-in">
      <Card className="border shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Practice Questions & PYQ Bank</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mcq">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mcq">MCQs</TabsTrigger>
              <TabsTrigger value="coding">Coding Questions</TabsTrigger>
              <TabsTrigger value="subjective">Subjective Questions</TabsTrigger>
            </TabsList>

            <TabsContent value="mcq" className="mt-4 space-y-6">
              <div className="filters flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">Module 1</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">Module 2</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">Module 3</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">Module 4</Badge>
                <Badge variant="secondary" className="cursor-pointer">APJ KTU</Badge>
              </div>

              {/* Sample MCQ Question */}
              <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-all">
                <div className="flex justify-between">
                  <Badge>Module 1</Badge>
                  <button 
                    onClick={() => toggleMark('mcq1')}
                    className={`text-sm flex items-center gap-1 ${markedQuestions.includes('mcq1') ? 'text-primary' : 'text-gray-400'}`}
                  >
                    <Bookmark size={16} className={markedQuestions.includes('mcq1') ? 'fill-primary' : ''} />
                    {markedQuestions.includes('mcq1') ? 'Marked' : 'Mark for Revision'}
                  </button>
                </div>
                <div className="mt-2">
                  <p className="font-medium">Which of the following is not a valid C variable name?</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="mcq1" id="mcq1_a" />
                      <label htmlFor="mcq1_a">int_count</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="mcq1" id="mcq1_b" />
                      <label htmlFor="mcq1_b">float_63</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="mcq1" id="mcq1_c" />
                      <label htmlFor="mcq1_c">2_count</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="mcq1" id="mcq1_d" />
                      <label htmlFor="mcq1_d">_value</label>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Check size={14} />
                      Check Answer
                    </Button>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      KTU 2021 Final
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample MCQ Question 2 */}
              <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-all">
                <div className="flex justify-between">
                  <Badge>Module 2</Badge>
                  <button 
                    onClick={() => toggleMark('mcq2')}
                    className={`text-sm flex items-center gap-1 ${markedQuestions.includes('mcq2') ? 'text-primary' : 'text-gray-400'}`}
                  >
                    <Bookmark size={16} className={markedQuestions.includes('mcq2') ? 'fill-primary' : ''} />
                    {markedQuestions.includes('mcq2') ? 'Marked' : 'Mark for Revision'}
                  </button>
                </div>
                <div className="mt-2">
                  <p className="font-medium">What is the output of the following code snippet?</p>
                  <pre className="bg-gray-100 p-2 rounded text-xs mt-2">
                    {`int arr[5] = {1, 2, 3, 4, 5};
printf("%d", arr[5]);`}
                  </pre>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="mcq2" id="mcq2_a" />
                      <label htmlFor="mcq2_a">5</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="mcq2" id="mcq2_b" />
                      <label htmlFor="mcq2_b">Garbage value</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="mcq2" id="mcq2_c" />
                      <label htmlFor="mcq2_c">0</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="mcq2" id="mcq2_d" />
                      <label htmlFor="mcq2_d">Compilation error</label>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Check size={14} />
                      Check Answer
                    </Button>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      KTU 2022 Midterm
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Button>Load More Questions</Button>
              </div>
            </TabsContent>

            <TabsContent value="coding" className="mt-4">
              <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-all mb-4">
                <div className="flex justify-between">
                  <Badge>Module 3</Badge>
                  <button 
                    onClick={() => toggleMark('code1')}
                    className={`text-sm flex items-center gap-1 ${markedQuestions.includes('code1') ? 'text-primary' : 'text-gray-400'}`}
                  >
                    <Bookmark size={16} className={markedQuestions.includes('code1') ? 'fill-primary' : ''} />
                    {markedQuestions.includes('code1') ? 'Marked' : 'Mark for Revision'}
                  </button>
                </div>
                <div className="mt-2">
                  <p className="font-medium">Write a C function to find the factorial of a number using recursion.</p>
                  <div className="mt-4">
                    <Button className="flex items-center gap-1">
                      <Play size={14} />
                      Solve in Compiler
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button>Browse More Coding Questions</Button>
              </div>
            </TabsContent>

            <TabsContent value="subjective" className="mt-4">
              <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-all mb-4">
                <div className="flex justify-between">
                  <Badge>Module 4</Badge>
                  <button 
                    onClick={() => toggleMark('subj1')}
                    className={`text-sm flex items-center gap-1 ${markedQuestions.includes('subj1') ? 'text-primary' : 'text-gray-400'}`}
                  >
                    <Bookmark size={16} className={markedQuestions.includes('subj1') ? 'fill-primary' : ''} />
                    {markedQuestions.includes('subj1') ? 'Marked' : 'Mark for Revision'}
                  </button>
                </div>
                <div className="mt-2">
                  <p className="font-medium">Explain the difference between passing by value and passing by reference in C programming, with examples.</p>
                  <div className="mt-4 flex justify-between">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      View Sample Answer
                    </Button>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      KTU 2023 Final (8 marks)
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Button>Browse More Questions</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};

export default PracticeQuestions;
