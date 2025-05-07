
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
        // Handle variable declarations and assignments
        const variables: Record<string, any> = {};
        
        // Extract variable declarations and assignments
        const varRegex = /\s*int\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(\d+)\s*;/g;
        let varMatch;
        
        while ((varMatch = varRegex.exec(code)) !== null) {
          const [_, varName, varValue] = varMatch;
          variables[varName] = parseInt(varValue, 10);
        }
        
        // Process printf statements with proper variable substitution
        const outputLines: string[] = [];
        const printfRegex = /printf\s*\(\s*"([^"]*)"\s*(?:,\s*([^)]*))?\s*\)\s*;/g;
        let match;
        
        while ((match = printfRegex.exec(code)) !== null) {
          const [_, format, args] = match;
          
          // If there are format specifiers and arguments
          if (args && format.includes('%')) {
            let formattedOutput = format;
            
            // Handle %d format specifiers
            const formatSpecifiers = format.match(/%d/g) || [];
            const argsList = args.split(',').map(arg => arg.trim());
            
            formatSpecifiers.forEach((_, index) => {
              const arg = argsList[index];
              // If it's a variable name, replace with its value
              if (variables[arg]) {
                formattedOutput = formattedOutput.replace(/%d/, variables[arg].toString());
              } else {
                // Try to evaluate as a direct number
                try {
                  const directValue = eval(arg);
                  formattedOutput = formattedOutput.replace(/%d/, directValue.toString());
                } catch (e) {
                  formattedOutput = formattedOutput.replace(/%d/, "[error]");
                }
              }
            });
            
            // Replace escape sequences
            formattedOutput = formattedOutput
              .replace(/\\n/g, '\n')
              .replace(/\\t/g, '\t')
              .replace(/\\"/g, '"');
              
            outputLines.push(formattedOutput);
          } else {
            // No arguments, just direct string output
            const directOutput = format
              .replace(/\\n/g, '\n')
              .replace(/\\t/g, '\t')
              .replace(/\\"/g, '"');
              
            outputLines.push(directOutput);
          }
        }
        
        setOutput(outputLines.join('') || 'Program executed with no output.');
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
          <CardTitle className="text-2xl font-bold">C Compiler</CardTitle>
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
        </CardContent>
      </Card>
    </section>
  );
};

export default CCompiler;
