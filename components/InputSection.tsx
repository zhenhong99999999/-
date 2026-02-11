import React, { useRef } from 'react';
import { FileText, Play, RotateCcw, Upload } from 'lucide-react';

interface InputSectionProps {
  transcript: string;
  setTranscript: (text: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasReport: boolean;
  onReset: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  transcript,
  setTranscript,
  onGenerate,
  isGenerating,
  hasReport,
  onReset,
}) => {
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
    reader.readAsText(file); // Default is UTF-8
    
    // Reset value to allow re-uploading the same file
    event.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="font-semibold text-slate-700 flex items-center gap-2">
          <FileText size={18} />
          逐字稿输入
        </h2>
        <div className="flex items-center gap-3">
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
             className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             title="上传文件"
          >
            <Upload size={14} />
            <span className="hidden sm:inline">导入</span>
          </button>
          
          {hasReport && (
             <button
             onClick={onReset}
             disabled={isGenerating}
             className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors disabled:opacity-50"
             title="清空并新建"
           >
             <RotateCcw size={14} />
             <span className="hidden sm:inline">新建</span>
           </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <textarea
          className="w-full h-full p-4 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none placeholder:text-slate-400 font-mono leading-relaxed"
          placeholder="请在此粘贴您的访谈逐字稿...
或者点击右上角“导入”按钮上传文本文件。
示例：
访谈者：您对这个新功能感觉如何？
用户：老实说，我觉得设置入口有点难找..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          disabled={isGenerating}
        />
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <button
          onClick={onGenerate}
          disabled={!transcript.trim() || isGenerating}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all shadow-sm ${
            !transcript.trim() || isGenerating
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:transform active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              分析中...
            </>
          ) : (
            <>
              <Play size={18} fill="currentColor" />
              生成洞察
            </>
          )}
        </button>
      </div>
    </div>
  );
};