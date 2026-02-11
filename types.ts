export interface BasicInfo {
  theme: string;       // 调研主题
  subject: string;     // 调研对象
  date: string;        // 调研时间
  method: string;      // 调研方式
  purpose: string;     // 调研目的
}

export interface ContentItem {
  subTitle: string;    // e.g. "1. 加粉渠道"
  details: string[];   // e.g. ["核心渠道：...", "外拓活动..."]
}

export interface ContentCategory {
  categoryName: string; // e.g. "（一）企微加粉运营现状"
  items: ContentItem[];
}

export interface AnalysisReport {
  basicInfo: BasicInfo;
  contentAnalysis: ContentCategory[];
  painPoints: string[];
  suggestions: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}