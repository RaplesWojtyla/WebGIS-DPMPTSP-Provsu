'use client'

import { useMemo } from "react"
import MarkdownRenderer from "./MarkdownRenderer"
import CollapsibleSection from "./CollapsibleSection"

interface CollapsibeMarkdownProps {
    content: string
}

interface Section {
    title: string
    content: string
}


const CollapsibeMarkdown = ({ content }: CollapsibeMarkdownProps) => {
    const sections = useMemo(() => {
        const lines = content.split('\n')
        const result: Section[] = []
        let currentSection: Section | null = null
        let introContent = ''

        for (const line of lines) {
            if (line.startsWith('## ')) {
                if (currentSection) {
                    result.push(currentSection)
                }

                currentSection = {
                    title: line.replace('## ', '').trim(),
                    content: ''
                }
            } else if (line.startsWith('# ')) {
                introContent += line + '\n'
            } else if (currentSection) {
                currentSection.content += line + '\n'
            } else {
                introContent += line + '\n'
            }
        }

        if (currentSection) {
            result.push(currentSection)
        }

        return { intro: introContent.trim(), sections: result }
    }, [content])

    return (
        <div className="space-y-3">
            {sections.intro && (
                <MarkdownRenderer content={sections.intro} />
            )}

            {sections.sections.map((section, i) => (
                <CollapsibleSection
                    key={section.title}
                    title={section.title}
                    content={section.content}
                    defaultOpen={i < 2}
                />
            ))}
        </div>
    )
}

export default CollapsibeMarkdown