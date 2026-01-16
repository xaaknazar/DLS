'use client';

import { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  FileCode,
  Eye,
  Edit3,
  Link as LinkIcon,
  Terminal,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Напишите документацию...',
  minHeight = 400,
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertCodeBlock = (language: string = 'python') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const selectedText = value.substring(textarea.selectionStart, textarea.selectionEnd);
    const codeBlock = `\n\`\`\`${language}\n${selectedText || '# Ваш код здесь'}\n\`\`\`\n`;

    const newText = value.substring(0, start) + codeBlock + value.substring(textarea.selectionEnd);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  const toolbarButtons = [
    { icon: Heading1, title: 'Заголовок 1', action: () => insertAtCursor('# ', '', 'Заголовок') },
    { icon: Heading2, title: 'Заголовок 2', action: () => insertAtCursor('## ', '', 'Заголовок') },
    { icon: Heading3, title: 'Заголовок 3', action: () => insertAtCursor('### ', '', 'Заголовок') },
    { type: 'divider' },
    { icon: Bold, title: 'Жирный', action: () => insertAtCursor('**', '**', 'текст') },
    { icon: Italic, title: 'Курсив', action: () => insertAtCursor('*', '*', 'текст') },
    { icon: Code, title: 'Inline код', action: () => insertAtCursor('`', '`', 'код') },
    { type: 'divider' },
    { icon: List, title: 'Список', action: () => insertAtCursor('- ', '', 'элемент') },
    { icon: ListOrdered, title: 'Нумерованный список', action: () => insertAtCursor('1. ', '', 'элемент') },
    { icon: Quote, title: 'Цитата', action: () => insertAtCursor('> ', '', 'цитата') },
    { type: 'divider' },
    { icon: FileCode, title: 'Блок кода Python', action: () => insertCodeBlock('python'), highlight: true },
    { icon: Terminal, title: 'Блок кода (другой)', action: () => insertCodeBlock('') },
    { icon: LinkIcon, title: 'Ссылка', action: () => insertAtCursor('[', '](url)', 'текст ссылки') },
  ];

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center gap-1 flex-wrap">
        {toolbarButtons.map((btn, i) => (
          btn.type === 'divider' ? (
            <div key={i} className="w-px h-6 bg-gray-600 mx-1" />
          ) : (
            <button
              key={i}
              type="button"
              onClick={btn.action}
              title={btn.title}
              className={`p-2 rounded-lg transition-colors ${
                btn.highlight
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {btn.icon && <btn.icon className="w-4 h-4" />}
            </button>
          )
        ))}

        <div className="flex-1" />

        {/* Preview toggle */}
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
            showPreview
              ? 'bg-green-500/20 text-green-400'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          {showPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="text-sm">{showPreview ? 'Редактор' : 'Превью'}</span>
        </button>
      </div>

      {/* Editor / Preview */}
      {showPreview ? (
        <div
          className="p-6 bg-gray-900 prose prose-invert max-w-none overflow-auto"
          style={{ minHeight }}
        >
          {value ? (
            <ReactMarkdown
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const inline = !match;
                  return !inline ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-xl !bg-gray-800 !my-4"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-800 px-1.5 py-0.5 rounded text-blue-400" {...props}>
                      {children}
                    </code>
                  );
                },
                h1: ({ children }) => <h1 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-semibold text-white mt-4 mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-gray-300">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a href={href} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                em: ({ children }) => <em className="text-gray-300">{children}</em>,
              }}
            >
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-500 italic">Начните писать документацию...</p>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full px-4 py-3 bg-gray-900 text-white placeholder-gray-500 focus:outline-none font-mono text-sm resize-y"
        />
      )}

      {/* Quick templates */}
      <div className="bg-gray-800 border-t border-gray-700 p-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">Шаблоны:</span>
          <button
            type="button"
            onClick={() => {
              const template = `# Название темы

## Введение
Краткое описание темы и её важности.

## Синтаксис

\`\`\`python
# Пример кода
variable = "значение"
print(variable)
\`\`\`

## Примеры

### Пример 1: Базовый
\`\`\`python
# Ваш код
\`\`\`

### Пример 2: Продвинутый
\`\`\`python
# Ваш код
\`\`\`

## Важно запомнить
- Первый пункт
- Второй пункт
- Третий пункт

> **Совет:** Полезная подсказка для учеников.
`;
              onChange(value + template);
            }}
            className="px-2 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
          >
            Базовый шаблон
          </button>
          <button
            type="button"
            onClick={() => {
              const codeExample = `
\`\`\`python
# Название примера
код_здесь = True
\`\`\`
`;
              onChange(value + codeExample);
            }}
            className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
          >
            + Код Python
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(value + '\n\n> **Примечание:** ');
            }}
            className="px-2 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
          >
            + Примечание
          </button>
        </div>
      </div>
    </div>
  );
}
