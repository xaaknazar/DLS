'use client';

import { useEffect, useState } from 'react';

// Pyodide CDN configuration
const PYODIDE_VERSION = '0.25.1';
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<any>;
  runPython: (code: string) => any;
  globals: any;
}

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>;
  }
}

let pyodideInstance: PyodideInterface | null = null;
let pyodideLoading: Promise<PyodideInterface> | null = null;
let loadError: Error | null = null;

export async function loadPyodideInstance(): Promise<PyodideInterface> {
  if (loadError) {
    throw loadError;
  }

  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (pyodideLoading) {
    return pyodideLoading;
  }

  pyodideLoading = (async () => {
    try {
      // Load Pyodide script if not loaded
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `${PYODIDE_CDN}pyodide.js`;
          script.async = true;
          script.crossOrigin = 'anonymous';

          const timeout = setTimeout(() => {
            reject(new Error('Timeout loading Pyodide script'));
          }, 30000);

          script.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          script.onerror = (e) => {
            clearTimeout(timeout);
            reject(new Error('Failed to load Pyodide script'));
          };
          document.head.appendChild(script);
        });
      }

      // Initialize Pyodide with indexURL
      pyodideInstance = await window.loadPyodide({
        indexURL: PYODIDE_CDN,
      });

      return pyodideInstance;
    } catch (error) {
      loadError = error as Error;
      pyodideLoading = null;
      throw error;
    }
  })();

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

    // Escape the code properly for embedding in Python string
    const escapedCode = code.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'");

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
__builtins__["input"] = _mock_input

# Execute user code
_error = None
try:
    exec('''${escapedCode.replace(/'''/g, "\\'\\'\\'")}''')
except Exception as e:
    _error = str(e)

# Restore stdout and get output
sys.stdout = _old_stdout
_final_output = _output.getvalue()
if _error:
    _final_output = f"Error: {_error}"
_final_output
`;

    const result = await pyodide.runPythonAsync(wrappedCode);
    const executionTime = Date.now() - startTime;

    return {
      output: result ? String(result).trim() : '',
      error: null,
      executionTime,
    };
  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    let errorMessage = error.message || 'Ошибка выполнения';

    // Parse Python errors
    if (errorMessage.includes('PythonError')) {
      const match = errorMessage.match(/PythonError: (.+)/);
      if (match) {
        errorMessage = match[1];
      }
    }

    return {
      output: '',
      error: errorMessage,
      executionTime,
    };
  }
}

export function usePyodide() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    loadPyodideInstance()
      .then(() => {
        if (mounted) {
          setIsReady(true);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { isLoading, isReady, error };
}

// Reset pyodide (useful for testing or after errors)
export function resetPyodide() {
  pyodideInstance = null;
  pyodideLoading = null;
  loadError = null;
}
