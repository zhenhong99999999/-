import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisReport } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const reportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    basicInfo: {
      type: Type.OBJECT,
      properties: {
        theme: { type: Type.STRING, description: "调研的核心主题" },
        subject: { type: Type.STRING, description: "被访谈者的角色、经验或具体身份" },
        date: { type: Type.STRING, description: "访谈时间（如果文中未提及，根据当前日期或上下文推断）" },
        method: { type: Type.STRING, description: "访谈方式（如线上访谈、线下面访等）" },
        purpose: { type: Type.STRING, description: "调研的主要目的" },
      },
      required: ["theme", "subject", "purpose"],
    },
    contentAnalysis: {
      type: Type.ARRAY,
      description: "核心访谈内容梳理，按逻辑板块分类",
      items: {
        type: Type.OBJECT,
        properties: {
          categoryName: { type: Type.STRING, description: "板块标题，例如：（一）企微加粉运营现状" },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                subTitle: { type: Type.STRING, description: "子标题，例如：1. 加粉渠道" },
                details: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "该子标题下的具体事实、观点或数据列表"
                }
              },
              required: ["subTitle", "details"]
            }
          }
        },
        required: ["categoryName", "items"]
      }
    },
    painPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "一线运营核心痛点汇总列表"
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "一线员工优化建议列表"
    }
  },
  required: ["basicInfo", "contentAnalysis", "painPoints", "suggestions"],
};

export const generateInsightReport = async (transcript: string): Promise<AnalysisReport> => {
  if (!transcript.trim()) throw new Error("Transcript is empty");

  const prompt = `
    你是一位资深用户研究员。请分析以下用户访谈逐字稿，生成一份结构严谨的专业调研报告。

    请严格按照以下结构进行提取和总结：
    1. **调研基础信息**：提取主题、对象、时间、方式和目的。
    2. **核心访谈内容梳理**：将访谈内容按逻辑板块（如现状、问题、工具、管理等）进行分类归纳。每个板块下包含若干子项，子项下详细列出事实和观点。
    3. **一线运营核心痛点汇总**：总结归纳出的核心问题。
    4. **一线员工优化建议**：基于访谈内容提出的改进建议。

    请确保语言专业、精炼，直接反映一线实操情况。所有输出必须使用中文。

    逐字稿内容：
    "${transcript}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: reportSchema,
        systemInstruction: "你是一位专业的用户研究专家。你的任务是将杂乱的访谈逐字稿转化为结构化、逻辑清晰的调研报告。",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisReport;
    }
    throw new Error("No response generated");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const chatWithContext = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  context: string
) => {
  try {
    const systemInstruction = `
      你是一位乐于助人的研究助手。
      你可以访问特定的用户访谈逐字稿。
      请仅根据提供的上下文回答用户的问题。
      请使用中文回答。
      
      上下文 (逐字稿):
      ${context}
    `;

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction },
      history: history,
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};