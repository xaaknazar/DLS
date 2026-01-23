'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Play, RotateCcw, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { SubmissionMetadata } from '@/types';

interface CodeEditorProps {
  initialCode: string;
  onRun: (code: string, metadata?: SubmissionMetadata) => Promise<void>;
  isRunning?: boolean;
}

export default function CodeEditor({ initialCode, onRun, isRunning = false }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const editorRef = useRef<any>(null);

  // Metadata tracking
  const startTimeRef = useRef<Date>(new Date());
  const keystrokeCountRef = useRef<number>(0);
  const pasteCountRef = useRef<number>(0);
  const tabSwitchCountRef = useRef<number>(0);

  // Reset metadata when problem changes (initialCode changes)
  useEffect(() => {
    startTimeRef.current = new Date();
    keystrokeCountRef.current = 0;
    pasteCountRef.current = 0;
    tabSwitchCountRef.current = 0;
  }, [initialCode]);

  // Track tab switches
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCountRef.current++;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Track paste events
  useEffect(() => {
    const handlePaste = () => {
      pasteCountRef.current++;
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Track keystrokes
    editor.onKeyDown(() => {
      keystrokeCountRef.current++;
    });
  };

  const handleReset = () => {
    setCode(initialCode);
    if (editorRef.current) {
      editorRef.current.setValue(initialCode);
    }
    // Reset metadata on code reset
    startTimeRef.current = new Date();
    keystrokeCountRef.current = 0;
    pasteCountRef.current = 0;
  };

  const handleRun = async () => {
    // Collect metadata
    const timeSpentSeconds = Math.round(
      (new Date().getTime() - startTimeRef.current.getTime()) / 1000
    );

    const metadata: SubmissionMetadata = {
      startedAt: startTimeRef.current,
      timeSpentSeconds,
      keystrokeCount: keystrokeCountRef.current,
      pasteCount: pasteCountRef.current,
      tabSwitchCount: tabSwitchCountRef.current,
    };

    await onRun(code, metadata);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-3 text-sm text-gray-400 font-mono">main.py</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Сброс
          </Button>
          <Button size="sm" onClick={handleRun} disabled={isRunning}>
            {isRunning ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-1" />
            )}
            Запустить
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>
    </div>
  );
}
