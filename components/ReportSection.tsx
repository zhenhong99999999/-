import React from 'react';
import { AnalysisReport } from '../types';
import { Lightbulb, FileText, AlertTriangle, CheckCircle, ClipboardList, Sparkles, User, Calendar, Target } from 'lucide-react';

interface ReportSectionProps {
  report: AnalysisReport | null;
  isGenerating: boolean;
}

export const ReportSection: React.FC<ReportSectionProps> = ({ report, isGenerating }) => {
  if (isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white/30 animate-pulse rounded-3xl">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-xl absolute top-0 left-0 animate-blob"></div>
          <div className="w-20 h-20 bg-gradient-to-tr from-rose-100 to-orange-100 rounded-full blur-xl absolute bottom-0 right-0 animate-blob animation-delay-2000"></div>
          <div className="relative bg-white/80 w-24 h-24 rounded-2xl shadow-sm border border-white flex items-center justify-center">
             <Sparkles className="text-blue-500 animate-spin-slow" size={32} />
          </div>
        </div>
        <h3 className="mt-8 font-medium text-slate-600 text-lg">AI 正在思考...</h3>
        <p className="text-slate-400 text-sm mt-2">正在梳理访谈逻辑与洞察</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center">
        <div className="w-32 h-32 bg-gradient-to-b from-blue-50 to-white rounded-full flex items-center justify-center shadow-sm border border-white mb-6">
            <ClipboardList size={48} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">洞察生成器</h2>
        <p className="text-slate-500 mt-3 max-w-sm leading-relaxed">
          导入访谈记录，AI 将为您自动生成结构化、专业的用户调研报告。
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        
        {/* Header Title */}
        <div className="text-center pb-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-100">
                Research Insight
             </div>
             <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{report.basicInfo.theme}</h1>
        </div>

        {/* Section 1: Basic Info - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm backdrop-blur-sm flex flex-col gap-2 hover:bg-white/80 transition-colors">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={12} /> 调研对象
                </span>
                <p className="font-medium text-slate-800 text-sm leading-relaxed">{report.basicInfo.subject}</p>
            </div>
            <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm backdrop-blur-sm flex flex-col gap-2 hover:bg-white/80 transition-colors">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={12} /> 时间与方式
                </span>
                <p className="font-medium text-slate-800 text-sm leading-relaxed">{report.basicInfo.date} · {report.basicInfo.method}</p>
            </div>
            <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm backdrop-blur-sm flex flex-col gap-2 hover:bg-white/80 transition-colors">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={12} /> 调研目的
                </span>
                <p className="font-medium text-slate-800 text-sm leading-relaxed line-clamp-3">{report.basicInfo.purpose}</p>
            </div>
        </div>

        {/* Section 2: Core Content Analysis */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-3 bg-gradient-to-r from-slate-50/50 to-white">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <ClipboardList size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">核心访谈内容梳理</h2>
           </div>
           
           <div className="p-8 space-y-10">
            {report.contentAnalysis.map((category, idx) => (
              <div key={idx} className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-100 rounded-full"></div>
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold border border-slate-200 shadow-sm">{idx + 1}</span>
                  {category.categoryName}
                </h3>
                <div className="pl-9 space-y-6">
                  {category.items.map((item, subIdx) => (
                    <div key={subIdx} className="group">
                      <h4 className="font-semibold text-slate-800 mb-2 text-sm">{item.subTitle}</h4>
                      <ul className="space-y-2">
                        {item.details.map((detail, dIdx) => (
                          <li key={dIdx} className="text-slate-600 text-sm leading-relaxed pl-3 border-l border-slate-200 group-hover:border-indigo-300 transition-colors">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 3: Pain Points */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3 bg-gradient-to-r from-amber-50/30 to-white">
                    <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                        <AlertTriangle size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">核心痛点</h2>
                </div>
                <div className="p-6 flex-1 bg-amber-50/10">
                    <ul className="space-y-3">
                        {report.painPoints.map((point, idx) => (
                        <li key={idx} className="flex gap-3 text-slate-700 p-3 rounded-xl bg-white border border-amber-100/50 shadow-sm hover:shadow-md transition-shadow">
                            <span className="font-bold text-amber-500 text-xs mt-0.5 shrink-0 bg-amber-50 w-5 h-5 flex items-center justify-center rounded-full">{idx + 1}</span>
                            <span className="leading-relaxed text-sm">{point}</span>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Section 4: Suggestions */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3 bg-gradient-to-r from-emerald-50/30 to-white">
                    <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                        <CheckCircle size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">优化建议</h2>
                </div>
                <div className="p-6 flex-1 bg-emerald-50/10">
                    <div className="space-y-3">
                        {report.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex gap-3 p-3 rounded-xl bg-white border border-emerald-100/50 shadow-sm hover:shadow-md transition-shadow">
                            <span className="font-bold text-emerald-600 text-xs mt-0.5 shrink-0 bg-emerald-50 w-5 h-5 flex items-center justify-center rounded-full">{idx + 1}</span>
                            <span className="text-slate-700 text-sm leading-relaxed">{suggestion}</span>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="h-12 text-center text-slate-300 text-xs">
            Generated by InsightGen AI
        </div>
      </div>
    </div>
  );
};