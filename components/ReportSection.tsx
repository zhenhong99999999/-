import React from 'react';
import { AnalysisReport } from '../types';
import { Lightbulb, FileText, AlertTriangle, CheckCircle, ClipboardList } from 'lucide-react';

interface ReportSectionProps {
  report: AnalysisReport | null;
  isGenerating: boolean;
}

export const ReportSection: React.FC<ReportSectionProps> = ({ report, isGenerating }) => {
  if (isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 animate-pulse">
        <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
        <div className="h-4 w-48 bg-slate-200 rounded mb-2"></div>
        <div className="h-3 w-32 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-8 text-center">
        <ClipboardList size={48} className="mb-4 text-slate-300" />
        <p className="text-lg font-medium text-slate-500">准备分析</p>
        <p className="text-sm">粘贴逐字稿或上传文件，点击生成以查看专业报告。</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50">
      <div className="max-w-5xl mx-auto p-8 space-y-8 font-sans">
        
        {/* Section 1: Basic Info */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-2">
            <FileText className="text-blue-600" size={24} />
            一、调研基础信息
          </h2>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-600 bg-slate-50 w-1/4">调研主题</td>
                  <td className="px-6 py-4 text-sm text-slate-800 font-medium">{report.basicInfo.theme}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-600 bg-slate-50">调研对象</td>
                  <td className="px-6 py-4 text-sm text-slate-800">{report.basicInfo.subject}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-600 bg-slate-50">调研时间</td>
                  <td className="px-6 py-4 text-sm text-slate-800">{report.basicInfo.date || '未提及'}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-600 bg-slate-50">调研方式</td>
                  <td className="px-6 py-4 text-sm text-slate-800">{report.basicInfo.method || '未提及'}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-600 bg-slate-50">调研目的</td>
                  <td className="px-6 py-4 text-sm text-slate-800">{report.basicInfo.purpose}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Core Content Analysis */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
           <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-2">
            <ClipboardList className="text-indigo-600" size={24} />
            二、核心访谈内容梳理
          </h2>
          <div className="space-y-8">
            {report.contentAnalysis.map((category, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-700 bg-indigo-50 px-4 py-2 rounded-lg inline-block">
                  {category.categoryName}
                </h3>
                <div className="pl-2 space-y-6">
                  {category.items.map((item, subIdx) => (
                    <div key={subIdx} className="ml-4 border-l-2 border-slate-200 pl-4">
                      <h4 className="font-semibold text-slate-800 mb-2 text-base">{item.subTitle}</h4>
                      <ul className="list-disc list-outside ml-4 space-y-1.5 text-slate-600 text-sm leading-relaxed">
                        {item.details.map((detail, dIdx) => (
                          <li key={dIdx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Pain Points */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-2">
            <AlertTriangle className="text-amber-500" size={24} />
            三、一线运营核心痛点汇总
          </h2>
          <ul className="space-y-4">
            {report.painPoints.map((point, idx) => (
              <li key={idx} className="flex gap-3 text-slate-700 bg-amber-50 p-4 rounded-lg border border-amber-100">
                <span className="font-bold text-amber-600 shrink-0">{idx + 1}.</span>
                <span className="leading-relaxed text-sm">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4: Suggestions */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-2">
            <CheckCircle className="text-green-600" size={24} />
            四、一线员工优化建议
          </h2>
          <div className="grid gap-4">
            {report.suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex gap-3 p-4 rounded-lg bg-green-50 border border-green-100">
                 <span className="font-bold text-green-700 shrink-0">{idx + 1}.</span>
                 <span className="text-slate-700 text-sm leading-relaxed">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  );
};