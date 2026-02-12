import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { FileText, Play, RotateCcw, Upload, Plus } from 'lucide-react';

interface InputSectionProps {
  transcript: string;
  setTranscript: (text: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasReport: boolean;
  onReset: () => void;
}

export const InputSection = forwardRef<HTMLTextAreaElement, InputSectionProps>(({
  transcript,
  setTranscript,
  onGenerate,
  isGenerating,
  hasReport,
  onReset,
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setTranscript(content);
      }
    };
    reader.readAsText(file); 
    event.target.value = '';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-black/5 flex justify-between items-center bg-white/40">
        <h2 className="font-bold text-slate-800 flex items-center gap-2.5 text-lg tracking-tight">
          <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100 text-slate-700">
             <FileText size={16} />
          </div>
          素材来源
        </h2>
        
        <div className="flex items-center gap-2">
           {hasReport && (
             <button
             onClick={onReset}
             disabled={isGenerating}
             className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
             title="新建"
           >
             <RotateCcw size={16} />
           </button>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".txt,.md,.json,.csv"
            onChange={handleFileUpload}
            disabled={isGenerating}
          />
          <button
             onClick={() => fileInputRef.current?.click()}
             disabled={isGenerating}
             className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:shadow-sm transition-all"
          >
            <Plus size={14} />
            导入
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative group">
        <textarea
          ref={ref}
          className="w-full h-full p-6 text-sm text-slate-700 bg-transparent outline-none resize-none placeholder:text-slate-400 font-mono leading-relaxed transition-colors selection:bg-yellow-200 selection:text-black"
          placeholder="在此粘贴访谈逐字稿，或点击右上角导入文件..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          disabled={isGenerating}
        />
        {/* Gradient overlay at bottom of textarea for visual polish */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/80 to-transparent pointer-events-none"></div>
      </div>

      <div className="p-6 border-t border-black/5 bg-white/40 backdrop-blur-sm">
        <button
          onClick={onGenerate}
          disabled={!transcript.trim() || isGenerating}
          className={`w-full py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-300 shadow-sm ${
            !transcript.trim() || isGenerating
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-black text-white hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              正在深度分析...
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              生成洞察报告
            </>
          )}
        </button>
      </div>
    </div>
  );
});

InputSection.displayName = 'InputSection';