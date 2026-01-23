'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Заголовки
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-white mb-3 mt-5 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-white mb-2 mt-4 first:mt-0">{children}</h3>
          ),

          // Параграфы
          p: ({ children }) => (
            <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>
          ),

          // Списки
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1 ml-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1 ml-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300">{children}</li>
          ),

          // Код
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-800 text-yellow-400 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className={`block bg-gray-800 text-green-400 p-4 rounded-xl text-sm font-mono overflow-x-auto mb-4 ${className}`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-800 rounded-xl overflow-x-auto mb-4">{children}</pre>
          ),

          // Таблицы
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-800">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-700">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-800/50 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-white border-b border-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-gray-300">{children}</td>
          ),

          // Ссылки
          a: ({ children, href }) => (
            <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),

          // Выделение
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-200">{children}</em>
          ),

          // Цитаты
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-500/10 rounded-r-lg">
              {children}
            </blockquote>
          ),

          // Горизонтальная линия
          hr: () => (
            <hr className="border-gray-700 my-6" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
