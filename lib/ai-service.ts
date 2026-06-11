import Groq from 'groq-sdk';
import { prisma } from './prisma';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface AIAnalysisResult {
  isValid: boolean;
  confidence: number;
  analysis: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  suggestedActions: string[];
  category?: string;
}

export interface ChatResponse {
  message: string;
  actions?: string[];
  severity?: 'low' | 'medium' | 'high' | 'critical';
  suggestions?: string[];
}

export class AIService {
  
  /**
   * Verify crime report using Groq AI (Llama 3.3)
   */
  static async verifyReport(report: {
    title: string;
    description: string;
    category: string;
    location?: string;
  }): Promise<AIAnalysisResult> {
    try {
      const prompt = `
        You are an expert crime report analyzer for a safety platform. Analyze the following crime report and provide a structured analysis.
        
        Report Details:
        - Title: ${report.title}
        - Description: ${report.description}
        - Category: ${report.category}
        - Location: ${report.location || 'Not specified'}
        
        Please analyze for:
        1. Legitimacy - Is this report plausible and well-structured?
        2. Severity - How urgent is this situation?
        3. Missing information - What crucial details are missing?
        4. Suggested actions - What should be done?
        
        Respond with a JSON object in this exact format:
        {
          "isValid": boolean (true/false),
          "confidence": number (0-1, confidence in your analysis),
          "analysis": "string (detailed analysis of the report)",
          "severity": "LOW" or "MEDIUM" or "HIGH" or "CRITICAL",
          "suggestedActions": ["action1", "action2", "action3"],
          "missingInfo": ["info1", "info2"],
          "estimatedCategory": "suggested category if different"
        }
        
        Base your analysis on:
        - Report completeness and coherence
        - Presence of specific details (time, location, descriptions)
        - Consistency with known crime patterns
        - Urgency indicators (violence, weapons, threats)
      `;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an AI crime analysis expert. You provide accurate, helpful, and structured analyses of crime reports. Always respond in valid JSON format."
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama3-70b-8192",
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from AI");
      }

      const analysis = JSON.parse(response) as AIAnalysisResult;
      
      // ✅ Log AI analysis using Prisma model (instead of raw SQL)
      try {
        await prisma.aIAnalysisLog.create({
          data: {
            reportData: JSON.stringify(report),
            analysisResult: response,
            confidence: analysis.confidence,
            severity: analysis.severity,
          },
        });
      } catch (logError) {
        console.error("Failed to save AI analysis log:", logError);
      }

      return analysis;
      
    } catch (error) {
      console.error("AI Verification Error:", error);
      // Return default analysis if AI fails
      return {
        isValid: true,
        confidence: 0.5,
        analysis: "Report submitted successfully. Manual review recommended.",
        severity: "MEDIUM",
        suggestedActions: ["Review report details", "Verify with local authorities"],
      };
    }
  }

  /**
   * Chat with AI for user assistance
   */
  static async chatWithAI(
    message: string,
    context: {
      userId?: string;
      recentReports?: any[];
      userLocation?: string;
      conversationHistory?: any[];
    }
  ): Promise<ChatResponse> {
    try {
      const systemPrompt = `
        You are CrimeSafety AI Assistant, a helpful, empathetic, and knowledgeable assistant for a crime reporting and safety platform.
        
        Your capabilities:
        - Help users report crimes properly
        - Provide safety tips and prevention advice
        - Explain crime reporting procedures
        - Offer emotional support for victims
        - Guide users to appropriate resources
        - Never give legal advice - recommend consulting professionals
        - In emergencies, always advise calling local authorities immediately
        
        Current Context:
        - User has ${context.recentReports?.length || 0} previous reports
        - User location: ${context.userLocation || 'Unknown'}
        - Conversation history length: ${context.conversationHistory?.length || 0}
        
        Important Rules:
        1. If user mentions immediate danger, weapons, violence, or medical emergency → Tell them to call emergency services immediately
        2. Be compassionate and professional
        3. Provide actionable advice
        4. Suggest using the report form for detailed submissions
        5. Keep responses concise but informative
        6. Never promise specific outcomes
      `;

      const messages: any[] = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...(context.conversationHistory || []).slice(-5).map(msg => ({
          role: msg.isAI ? "assistant" : "user",
          content: msg.content,
        })),
        {
          role: "user",
          content: message,
        },
      ];

      const completion = await groq.chat.completions.create({
        messages,
        model: "llama3-70b-8192",
        temperature: 0.7,
        max_tokens: 500,
      });

      const aiResponse = completion.choices[0]?.message?.content || 
        "I apologize, I'm having trouble responding. Please try again or contact local authorities if this is an emergency.";

      // Detect severity from message
      const emergencyKeywords = ['emergency', 'danger', 'attack', 'hurt', 'bleeding', 'weapon', 'gun', 'knife', 'help'];
      const severity = emergencyKeywords.some(keyword => message.toLowerCase().includes(keyword)) 
        ? 'critical' 
        : undefined;

      // Extract suggested actions if any
      const actionKeywords = ['call', 'report', 'go to', 'contact', 'visit'];
      const actions = actionKeywords.filter(keyword => aiResponse.toLowerCase().includes(keyword));

      // ✅ Save chat interaction to database (if userId provided)
      if (context.userId) {
        try {
          await prisma.chatMessage.create({
            data: {
              content: message,
              userId: context.userId,
              isAI: false,
              sessionId: `chat_${Date.now()}`,
            },
          });
          
          await prisma.chatMessage.create({
            data: {
              content: aiResponse,
              userId: context.userId,
              isAI: true,
              sessionId: `chat_${Date.now()}`,
            },
          });
        } catch (dbError) {
          console.error("Failed to save chat message:", dbError);
        }
      }

      return {
        message: aiResponse,
        actions: actions.length > 0 ? actions : undefined,
        severity,
        suggestions: ["File a report", "View safety tips", "Check nearby crimes"],
      };

    } catch (error) {
      console.error("Chat AI Error:", error);
      return {
        message: "I'm here to help. Please try again or call emergency services if this is urgent.",
        severity: message.toLowerCase().includes('emergency') ? 'critical' : undefined,
      };
    }
  }

  /**
   * Analyze crime trends for dashboard
   */
  static async analyzeCrimeTrends(reports: any[]): Promise<any> {
    try {
      const prompt = `
        Analyze these crime reports and provide trend analysis:
        ${JSON.stringify(reports.slice(0, 100))}
        
        Return JSON:
        {
          "hotspots": [{lat, lng, severity, count, area}],
          "trends": [{category, change, prediction, timeFrame}],
          "recommendations": ["recommendation1", "recommendation2"],
          "alertZones": [{area, risk, timeFrame, suggestedAction}],
          "statistics": {
            "mostCommonCrime": "",
            "peakHours": [],
            "averageSeverity": "",
            "resolutionRate": 0
          }
        }
      `;

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-70b-8192",
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      return JSON.parse(completion.choices[0]?.message?.content || "{}");
      
    } catch (error) {
      console.error("Trend Analysis Error:", error);
      return {
        hotspots: [],
        trends: [],
        recommendations: ["Monitor high-traffic areas", "Increase patrols during peak hours"],
        alertZones: [],
      };
    }
  }

  /**
   * Generate safety tips based on location and time
   */
  static async generateSafetyTips(
    location: string,
    timeOfDay: string,
    recentCrimes: any[]
  ): Promise<string[]> {
    try {
      const prompt = `
        Generate 5 practical safety tips for:
        - Location: ${location}
        - Time: ${timeOfDay}
        - Recent crimes in area: ${recentCrimes.length} incidents
        
        Tips should be specific, actionable, and relevant to the local context.
        Return as JSON array of strings.
      `;

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-70b-8192",
        temperature: 0.5,
        max_tokens: 300,
      });

      const tips = JSON.parse(completion.choices[0]?.message?.content || "[]");
      return Array.isArray(tips) ? tips : [
        "Stay in well-lit areas",
        "Keep your phone charged",
        "Share your location with trusted contacts",
        "Trust your instincts",
        "Report suspicious activity immediately",
      ];
      
    } catch (error) {
      console.error("Safety Tips Error:", error);
      return [
        "Stay aware of your surroundings",
        "Keep emergency contacts handy",
        "Avoid isolated areas at night",
        "Secure your belongings",
        "Use trusted transportation",
      ];
    }
  }
}

export default AIService;