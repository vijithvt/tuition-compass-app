
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Save, Share } from 'lucide-react';

const CCompiler: React.FC = () => {
  const [code, setCode] = useState(`#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`);
  const [output, setOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);

  const runCode = async () => {
    setIsCompiling(true);
    setOutput('Compiling...');
    
    try {
      // In a real implementation, this would connect to a backend service
      // For now we'll simulate compilation with a timeout
      setTimeout(() => {
        if (code.includes('printf')) {
          const outputLines = [];
          // Simple regex to extract content between printf quotes
          const printfRegex = /printf\s*\(\s*"([^"]*)"/g;
          let match;
          
          while ((match = printfRegex.exec(code)) !== null) {
            // Replace escape sequences
            let content = match[1]
              .replace(/\\n/g, '\n')
              .replace(/\\t/g, '\t')
              .replace(/\\"/g, '"');
            outputLines.push(content);
          }
          
          setOutput(outputLines.join('') || 'Program executed with no output.');
        } else {
          setOutput('Program executed with no output.');
        }
        setIsCompiling(false);
      }, 1000);
    } catch (error) {
      setOutput(`Error: ${error}`);
      setIsCompiling(false);
    }
  };

  const saveCode = () => {
    // In a real implementation, this would save to a database
    alert('Code saved successfully!');
  };

  const shareCode = () => {
    // In a real implementation, this would generate a shareable link
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <section id="compiler" className="py-8 animate-fade-in">
      <Card className="border shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">In-Browser C Compiler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="code-editor-container">
              <div className="bg-gray-800 text-white p-2 flex items-center justify-between rounded-t-md">
                <span>main.c</span>
                <div className="flex space-x-2">
                  <Button 
                    onClick={runCode} 
                    disabled={isCompiling} 
                    variant="outline" 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                  >
                    <Play size={14} />
                    Run
                  </Button>
                  <Button onClick={saveCode} variant="outline" size="sm" className="flex items-center gap-1">
                    <Save size={14} />
                    Save
                  </Button>
                  <Button onClick={shareCode} variant="outline" size="sm" className="flex items-center gap-1">
                    <Share size={14} />
                    Share
                  </Button>
                </div>
              </div>
              <textarea
                className="w-full h-64 p-4 font-mono text-sm bg-gray-900 text-gray-100 border-none focus:ring-0 focus:outline-none rounded-b-md"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>

            <div className="output-container">
              <div className="bg-gray-700 text-white p-2 rounded-t-md">Console Output</div>
              <pre className="w-full h-64 p-4 font-mono text-sm bg-gray-800 text-gray-100 overflow-auto rounded-b-md">
                {output || 'Run your code to see output here...'}
              </pre>
            </div>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="guide">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="guide">Quick Guide</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="help">Common Errors</TabsTrigger>
              </TabsList>
              <TabsContent value="guide" className="p-4 bg-gray-50 rounded-md mt-2">
                <h4 className="font-medium mb-2">Getting Started with C</h4>
                <p className="text-sm">
                  Write your C code in the editor and click Run to execute. The output will appear in the console.
                  All C programs must include a main function as the entry point.
                </p>
              </TabsContent>
              <TabsContent value="examples" className="p-4 bg-gray-50 rounded-md mt-2">
                <h4 className="font-medium mb-2">Example: Variables and Input</h4>
                <pre className="text-xs bg-gray-100 p-2 rounded">
{`#include <stdio.h>

int main() {
    int number;
    printf("Enter a number: ");
    scanf("%d", &number);
    printf("You entered: %d\\n", number);
    return 0;
}`}
                </pre>
              </TabsContent>
              <TabsContent value="help" className="p-4 bg-gray-50 rounded-md mt-2">
                <h4 className="font-medium mb-2">Common Errors</h4>
                <ul className="text-sm list-disc list-inside space-y-1">
                  <li>Missing semicolons at the end of statements</li>
                  <li>Forgetting to include required header files</li>
                  <li>Missing closing braces in functions or control structures</li>
                  <li>Using variables before declaring them</li>
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CCompiler;
