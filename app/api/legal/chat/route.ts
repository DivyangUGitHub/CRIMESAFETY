import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // If no API key, use fallback responses
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        reply: "⚠️ AI Legal Assistant is not configured. Please set GROQ_API_KEY in environment variables.\n\nFor legal information, please contact your local legal aid office or consult a lawyer.\n\n**Emergency Helplines:**\n• Police: 112\n• Women Helpline: 1091\n• Child Helpline: 1098\n• Cyber Crime: 1930",
        success: false
      });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are CrimeSafety AI Legal Assistant, an expert in Indian law and legal procedures.

**Your Role:**
- Provide accurate legal information based on Indian laws (IPC, CrPC, IT Act, etc.)
- Explain legal procedures (FIR, bail, court proceedings)
- Inform users about their legal rights
- Share relevant legal sections and acts
- Provide emergency helpline numbers when needed
- NEVER give specific legal advice - always recommend consulting a lawyer

**Important Guidelines:**
- Always be professional and compassionate
- For emergencies, always advise calling 112 immediately
- Disclaim that you are an AI and not a substitute for legal counsel
- Use simple, easy-to-understand language
- Cite relevant legal sections when applicable

**Format your responses nicely with:**
- Bullet points for lists
- Bold text for important information
- Clear sections with emojis where appropriate

**Topics you cover:**
1. Criminal Law (IPC, CrPC)
2. Cyber Crime Law (IT Act)
3. Women Safety Laws
4. Consumer Rights
5. Property Law
6. Traffic Law
7. Labor Law
8. Family Law

Remember: You are a helpful assistant providing legal INFORMATION, not legal ADVICE.`,
        },
        ...(history || []).slice(-10),
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1000,
    });

    const reply = completion.choices[0]?.message?.content || "I'm here to help with legal information. Please try again.";

    return NextResponse.json({ reply, success: true });

  } catch (error) {
    console.error("Legal Chat API error:", error);
    return NextResponse.json(
      { reply: "Sorry, I'm having trouble connecting. Please try again. For immediate legal help, contact your local legal aid office.", success: false },
      { status: 500 }
    );
  }
}