import { Button } from "@/components/ui/button"
import { Sparkles, ArrowLeft } from "lucide-react"
import CollapsibeMarkdown from "./CollapsibeMarkdown"

interface AiAnalysisPanelProps {
    isAnalyzing: boolean
    analysisResult: string | null
    onClose: () => void
}

const TypingIndicator = () => (
    <div className="flex items-center gap-1 text-blue-600">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
)

const AiAnalysisPanel = ({
    isAnalyzing,
    analysisResult,
    onClose
}: AiAnalysisPanelProps) => {
    return (
        <div className="flex flex-col h-full bg-white">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-4 bg-white text-blue-900 shrink-0 border-b border-gray-100">
                <div className="flex items-center gap-2 font-bold text-base">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-blue-900 hover:bg-blue-50 hover:text-blue-700 mr-1"
                        onClick={onClose}
                    >
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                    <Sparkles className="h-4 w-4" />
                    <span>Analisis Wilayah AI</span>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-5">
                {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-blue-700 animate-pulse" />
                            <Sparkles className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="text-center space-y-2 flex flex-col justify-center items-center">
                            <p className="text-sm font-semibold text-gray-800">AI Sedang Menganalisis</p>
                            <p className="text-xs text-gray-500 mb-5">Mencari data & berita terkini...</p>
                            <TypingIndicator />
                        </div>
                    </div>
                ) : (
                    /* Result View */
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-emerald-800 text-xs flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            Analisis Selesai - Powered by Google Gemini
                        </div>
                        <div className="prose prose-sm prose-blue max-w-none text-gray-700 bg-white p-1 rounded-lg">
                            <div
                                className="bg-linear-to-br from-white to-blue-50/30 p-4 rounded-xl border border-blue-100/50 shadow-inner"
                            >
                                {analysisResult ? (
                                    <CollapsibeMarkdown content={analysisResult} />
                                ) : (
                                    <div className="text-center text-gray-500">Tidak ada hasil analisis</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AiAnalysisPanel
