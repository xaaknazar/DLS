'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Lightbulb,
  AlertTriangle,
  Info,
  CheckCircle2,
  BookOpen,
  Code2,
  Copy,
  Check
} from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { useState } from 'react';

interface DocumentationViewerProps {
  content: string;
  className?: string;
}

// Parse special blocks from content
function parseContent(content: string) {
  const blocks: Array<{
    type: 'markdown' | 'video' | 'tip' | 'warning' | 'info' | 'success';
    content: string;
    meta?: Record<string, string>;
  }> = [];

  // Split by special block markers
  const regex = /:::(video|tip|warning|info|success)\s*({[^}]*})?\n([\s\S]*?):::/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Add markdown before this block
    if (match.index > lastIndex) {
      const markdown = content.slice(lastIndex, match.index).trim();
      if (markdown) {
        blocks.push({ type: 'markdown', content: markdown });
      }
    }

    // Parse metadata if present
    let meta: Record<string, string> = {};
    if (match[2]) {
      try {
        meta = JSON.parse(match[2]);
      } catch {
        // Ignore parse errors
      }
    }

    blocks.push({
      type: match[1] as 'video' | 'tip' | 'warning' | 'info' | 'success',
      content: match[3].trim(),
      meta,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining markdown
  if (lastIndex < content.length) {
    const markdown = content.slice(lastIndex).trim();
    if (markdown) {
      blocks.push({ type: 'markdown', content: markdown });
    }
  }

  return blocks;
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );
}

function CalloutBox({
  type,
  children
}: {
  type: 'tip' | 'warning' | 'info' | 'success';
  children: React.ReactNode;
}) {
  const styles = {
    tip: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      icon: <Lightbulb className="w-5 h-5 text-yellow-400" />,
      title: 'Совет',
      titleColor: 'text-yellow-400',
    },
    warning: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      title: 'Внимание',
      titleColor: 'text-red-400',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      icon: <Info className="w-5 h-5 text-blue-400" />,
      title: 'Информация',
      titleColor: 'text-blue-400',
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
      title: 'Отлично',
      titleColor: 'text-green-400',
    },
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
        <div className="flex-1">
          <p className={`font-semibold ${style.titleColor} mb-1`}>{style.title}</p>
          <div className="text-gray-300 text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}

function MarkdownBlock({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Заголовки с иконками
        h1: ({ children }) => (
          <h1 className="flex items-center gap-3 text-2xl font-bold text-white mb-6 mt-8 first:mt-0 pb-3 border-b border-gray-700">
            <BookOpen className="w-7 h-7 text-blue-400" />
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4 mt-8 first:mt-0">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-gray-200 mb-3 mt-6 first:mt-0">{children}</h3>
        ),

        // Параграфы
        p: ({ children }) => (
          <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>
        ),

        // Списки
        ul: ({ children }) => (
          <ul className="space-y-2 mb-4 ml-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal space-y-2 mb-4 ml-6 text-gray-300">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-2 text-gray-300">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 flex-shrink-0" />
            <span>{children}</span>
          </li>
        ),

        // Код
        code: ({ className, children }) => {
          const isInline = !className;

          if (isInline) {
            return (
              <code className="bg-gray-800 text-yellow-400 px-2 py-1 rounded-md text-sm font-mono border border-gray-700">
                {children}
              </code>
            );
          }

          return (
            <code className="block text-green-400 text-sm font-mono">
              {children}
            </code>
          );
        },
        pre: ({ children }) => {
          // Extract code content for copy button
          let codeContent = '';
          try {
            const child = children as React.ReactElement<{ children?: React.ReactNode }>;
            if (child?.props?.children) {
              codeContent = String(child.props.children);
            }
          } catch {
            // Ignore extraction errors
          }

          return (
            <div className="relative group mb-4">
              <div className="absolute top-0 left-0 right-0 h-10 bg-gray-800 rounded-t-xl border-b border-gray-700 flex items-center px-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <span className="ml-4 text-xs text-gray-500 font-mono">
                  <Code2 className="w-3 h-3 inline mr-1" />
                  python
                </span>
              </div>
              <pre className="bg-gray-900 rounded-xl pt-14 pb-4 px-4 overflow-x-auto border border-gray-700">
                {children}
              </pre>
              <CopyButton code={codeContent} />
            </div>
          );
        },

        // Таблицы
        table: ({ children }) => (
          <div className="overflow-x-auto mb-6 rounded-xl border border-gray-700">
            <table className="min-w-full">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-800/80">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-gray-700 bg-gray-900/50">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-gray-800/50 transition-colors">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left text-sm font-semibold text-white">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-sm text-gray-300">{children}</td>
        ),

        // Ссылки
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 hover:decoration-blue-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
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
          <blockquote className="border-l-4 border-purple-500 pl-4 py-2 mb-4 bg-purple-500/10 rounded-r-xl italic">
            {children}
          </blockquote>
        ),

        // Горизонтальная линия
        hr: () => (
          <hr className="border-gray-700 my-8" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default function DocumentationViewer({ content, className = '' }: DocumentationViewerProps) {
  const blocks = parseContent(content);

  return (
    <div className={`documentation-viewer ${className}`}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'video':
            return (
              <VideoPlayer
                key={index}
                videoId={block.meta?.id || block.content}
                title={block.meta?.title}
              />
            );
          case 'tip':
          case 'warning':
          case 'info':
          case 'success':
            return (
              <CalloutBox key={index} type={block.type}>
                <MarkdownBlock content={block.content} />
              </CalloutBox>
            );
          default:
            return <MarkdownBlock key={index} content={block.content} />;
        }
      })}
    </div>
  );
}
