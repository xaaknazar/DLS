'use client';

import { useEffect, useRef, useState } from 'react';

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<any>;
  runPython: (code: string) => any;
  globals: any;
}

declare global {
  interface Window {
    loadPyodide: () => Promise<PyodideInterface>;
  }
}

let pyodideInstance: PyodideInterface | null = null;
let pyodideLoading: Promise<PyodideInterface> | null = null;

export async function loadPyodideInstance(): Promise<PyodideInterface> {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (pyodideLoading) {
    return pyodideLoading;
  }

  pyodideLoading = new Promise(async (resolve, reject) => {
    try {
      // Load Pyodide script if not loaded
      if (!window.loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.async = true;

        await new Promise<void>((res, rej) => {
          script.onload = () => res();
          script.onerror = () => rej(new Error('Failed to load Pyodide'));
          document.head.appendChild(script);
        });
      }

      pyodideInstance = await window.loadPyodide();
      resolve(pyodideInstance);
    } catch (error) {
      reject(error);
    }
  });

  return pyodideLoading;
}

export interface ExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
}

export async function executePythonCode(
  code: string,
  input: string = ''
): Promise<ExecutionResult> {
  const startTime = Date.now();

  try {
    const pyodide = await loadPyodideInstance();

    // Prepare input handling
    const inputLines = input.split('\n');
    let inputIndex = 0;

    // Setup code to capture output and handle input
    const wrappedCode = `
import sys
from io import StringIO

# Capture stdout
_output = StringIO()
_old_stdout = sys.stdout
sys.stdout = _output

# Mock input function
_input_lines = ${JSON.stringify(inputLines)}
_input_index = [0]

def _mock_input(prompt=""):
    if _input_index[0] < len(_input_lines):
        result = _input_lines[_input_index[0]]
        _input_index[0] += 1
        return result
    return ""

# Replace built-in input
__builtins__.input = _mock_input

# User code
try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    print(f"Error: {e}")

# Restore stdout and get output
sys.stdout = _old_stdout
_result = _output.getvalue()
_result
`;

    const result = await pyodide.runPythonAsync(wrappedCode);
    const executionTime = Date.now() - startTime;

    return {
      output: result ? result.trim() : '',
      error: null,
      executionTime,
    };
  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    return {
      output: '',
      error: error.message || 'Ошибка выполнения',
      executionTime,
    };
  }
}

export function usePyodide() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPyodideInstance()
      .then(() => {
        setIsReady(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return { isLoading, isReady, error };
}
