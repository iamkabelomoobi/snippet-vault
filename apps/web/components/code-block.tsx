'use client';

import { Highlight, themes } from 'prism-react-renderer';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute top-3 right-3 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <Highlight
        theme={theme === 'dark' ? themes.vsDark : themes.vsLight}
        code={code}
        language={language.toLowerCase()}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} rounded-lg p-4 overflow-auto text-sm`}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="inline-block w-8 text-right mr-4 text-muted-foreground select-none">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}