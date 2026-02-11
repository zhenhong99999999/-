import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { InputSection } from './components/InputSection';
import { ReportSection } from './components/ReportSection';
import { ChatSection } from './components/ChatSection';
import { generateInsightReport } from './services/gemini';
import { AnalysisReport } from './types';
import { Sparkles, Download } from 'lucide-react';

export default function App() {
  const [transcript, setTranscript] = useState<string>('');
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleExport = () => {
    if (!report) return;
    
    let markdown = `# 调研报告：${report.basicInfo.theme}\n\n`;
    
    // 1. Basic Info
    markdown += `## 一、调研基础信息\n`;
    markdown += `| 项目 | 详情 |\n|---|---|\n`;
    markdown += `| 调研主题 | ${report.basicInfo.theme} |\n`;
    markdown += `| 调研对象 | ${report.basicInfo.subject} |\n`;
    markdown += `| 调研时间 | ${report.basicInfo.date || '未提及'} |\n`;
    markdown += `| 调研方式 | ${report.basicInfo.method || '未提及'} |\n`;
    markdown += `| 调研目的 | ${report.basicInfo.purpose} |\n\n`;

    // 2. Content Analysis
    markdown += `## 二、核心访谈内容梳理\n`;
    report.contentAnalysis.forEach((cat) => {
        markdown += `### ${cat.categoryName}\n`;
        cat.items.forEach((item) => {
            markdown += `#### ${item.subTitle}\n`;
            item.details.forEach(detail => {
                markdown += `- ${detail}\n`;
            });
            markdown += `\n`;
        });
    });

    // 3. Pain Points
    markdown += `## 三、一线运营核心痛点汇总\n`;
    report.painPoints.forEach((point, idx) => {
        markdown += `${idx + 1}. ${point}\n`;
    });
    markdown += `\n`;

    // 4. Suggestions
    markdown += `## 四、一线员工优化建议\n`;
    report.suggestions.forEach((sug, idx) => {
        markdown += `${idx + 1}. ${sug}\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout
      header={
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Sparkles size={18} />
            </div>
            <h1 className="font-bold text-xl text-slate-800 tracking-tight">InsightGen AI</h1>
          </div>
          {report && (
             <button onClick={handleExport} className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-2 transition-colors">
                <Download size={16} />
                导出 MD
             </button>
          )}
        </div>
      }
      leftPanel={
        <InputSection
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
        />
      }
    />
  );
}