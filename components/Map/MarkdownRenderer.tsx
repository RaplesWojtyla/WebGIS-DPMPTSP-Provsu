'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


interface MarkdownRendererProps {
    content: string
}


const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => (
                    <h1 className='text-lg font-bold text-blue-900 border-b border-blue-200 pb-2 mb-3'>
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="text-base font-semibold text-blue-800 mt-4 mb-2 flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-500 rounded-full" />
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-sm font-semibold text-gray-800 mt-3 mb-1">
                        {children}
                    </h3>
                ),
                p: ({ children }) => (
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        {children}
                    </p>
                ),
                ul: ({ children }) => (
                    <ul className="list-none space-y-1 my-2 ml-2">
                        {children}
                    </ul>
                ),
                li: ({ children }) => (
                    <li className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{children}</span>
                    </li>
                ),
                strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">{children}</strong>
                ),
                em: ({ children }) => (
                    <em className="italic text-gray-600">{children}</em>
                ),
                a: ({ href, children }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
                    >
                        {children}
                    </a>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    )
}

export default MarkdownRenderer