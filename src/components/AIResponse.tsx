import ReactMarkdown from 'react-markdown';
import { Bot } from 'lucide-react';

interface AIResponseProps {
  response: string;
}

export function AIResponse({ response }: AIResponseProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg mb-8 border border-blue-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#1877F2] to-blue-600 text-white">
          <Bot className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">النتائج بتقرير الذكاء الاصطناعي</h2>
      </div>
      <div className="prose prose-blue max-w-none dark:prose-invert">
        <ReactMarkdown
          components={{
            // Enhanced table styling
            table: ({ children }) => (
              <div className="my-6 w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full border-collapse table-auto">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-100 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {children}
              </tbody>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-6 py-4 text-sm text-gray-600 whitespace-normal dark:text-gray-400">
                {children}
              </td>
            ),
            // Style blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-[#1877F2] pl-6 italic text-gray-700 my-6 bg-blue-50 py-3 dark:bg-gray-800 dark:border-blue-500 dark:text-gray-300">
                {children}
              </blockquote>
            ),
            // Style code blocks
            code: ({ inline, className, children, ...props }: { inline?: boolean, className?: string, children?: React.ReactNode }) => (
              inline ?
                <code className={`bg-gray-100 rounded px-2 py-1 text-sm font-mono ${className} dark:bg-gray-800`} {...props}>
                  {children}
                </code> :
                <pre className="bg-gray-800 rounded-xl p-5 overflow-x-auto my-6">
                  <code className={`text-sm font-mono text-gray-100 ${className}`} {...props}>{children}</code>
                </pre>
            ),
            // Style headings
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-5 pb-2 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold text-gray-800 mt-7 mb-4 dark:text-gray-200">
                {children}
              </h3>
            ),
            // Style links
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877F2] hover:underline font-medium dark:text-blue-400"
              >
                {children}
              </a>
            ),
            // Style lists
            ul: ({ children }) => (
              <ul className="list-disc pl-8 space-y-3 my-5">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-8 space-y-3 my-5">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-700 dark:text-gray-300">
                {children}
              </li>
            ),
            // Style paragraphs
            p: ({ children }) => (
              <p className="text-gray-700 my-5 leading-relaxed dark:text-gray-300">
                {children}
              </p>
            ),
          }}
        >
          {response}
        </ReactMarkdown>
      </div>
    </div>
  );
}