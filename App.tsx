import React, { useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { InputSection } from './components/InputSection';
import { ReportSection } from './components/ReportSection';
import { ChatSection } from './components/ChatSection';
import { generateInsightReport } from './services/gemini';
import { AnalysisReport } from './types';
import { Sparkles, Download, Copy, Check } from 'lucide-react';

export default function App() {
  const [transcript, setTranscript] = useState<string>('');
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Ref for the input textarea to control scrolling and selection
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    if (!transcript.trim()) return;
    
    setIsGenerating(true);
    setReport(null);
    
    try {
      const data = await generateInsightReport(transcript);
      setReport(data);
    } catch (error) {
      console.error("Generation failed", error);
      alert("生成报告失败，请检查您的 API Key 并重试。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setTranscript('');
    setReport(null);
  }

  const handleHighlightText = (text: string) => {
    if (!textareaRef.current || !text) return;

    const fullText = textareaRef.current.value;
    const index = fullText.indexOf(text);

    if (index !== -1) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(index, index + text.length);
      
      // Calculate approximate scroll position
      // This is a rough estimation for textarea scrolling. 
      // For pixel-perfect scrolling, we would need a more complex overlay or mirror div.
      // But focusing usually scrolls it into view automatically in modern browsers.
      textareaRef.current.blur();
      textareaRef.current.focus();
    } else {
        // Fallback for fuzzy matching if exact match fails (basic version)
        // Or just alert user
        console.warn("Exact text not found in transcript");
    }
  };

  const generateFeishuMarkdown = (report: AnalysisReport) => {
    let md = `# ${report.basicInfo.theme}\n\n`;
    
    md += `## 一、调研基础信息\n\n`;
    md += `**调研主题**：${report.basicInfo.theme}\n`;
    md += `**调研对象**：${report.basicInfo.subject}\n`;
    md += `**调研时间**：${report.basicInfo.date || '未提及'}\n`;
    md += `**调研方式**：${report.basicInfo.method || '未提及'}\n`;
    md += `**调研目的**：${report.basicInfo.purpose}\n\n`;

    md += `## 二、核心访谈内容梳理\n\n`;
    report.contentAnalysis.forEach((cat) => {
        md += `### ${cat.categoryName}\n\n`;
        cat.items.forEach((item) => {
            md += `#### ${item.subTitle}\n`;
            item.details.forEach(detail => {
                md += `- ${detail}\n`;
            });
            md += `\n`;
        });
    });

    md += `## 三、一线运营核心痛点汇总\n\n`;
    report.painPoints.forEach((point, idx) => {
        md += `1. ${point}\n`;
    });
    md += `\n`;

    md += `## 四、一线员工优化建议\n\n`;
    report.suggestions.forEach((sug, idx) => {
        md += `1. ${sug}\n`;
    });
    
    return md;
  };

  const handleExport = () => {
    if (!report) return;
    const markdown = generateFeishuMarkdown(report);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feishu-insight-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    if (!report) return;
    const markdown = generateFeishuMarkdown(report);
    navigator.clipboard.writeText(markdown).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Layout
      header={
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/20">
              <Sparkles size={18} />
            </div>
            <h1 className="font-bold text-xl text-slate-800 tracking-tight">InsightGen AI</h1>
          </div>
          {report && (
             <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopyToClipboard}
                  className="px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    {copied ? "已复制" : "复制飞书格式"}
                </button>
                <button 
                    onClick={handleExport} 
                    className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full shadow-lg shadow-black/20 hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                    <Download size={16} />
                    下载 .md
                </button>
             </div>
          )}
        </div>
      }
      leftPanel={
        <InputSection
          ref={textareaRef}
          transcript={transcript}
          setTranscript={setTranscript}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          hasReport={!!report}
          onReset={handleReset}
        />
      }
      centerPanel={
        <ReportSection 
          report={report} 
          isGenerating={isGenerating} 
        />
      }
      rightPanel={
        <ChatSection 
            transcript={transcript}
            hasReport={!!report}
            onCitationClick={handleHighlightText}
        />
      }
    />
  );
}