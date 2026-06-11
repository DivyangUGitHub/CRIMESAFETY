import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId } = body;
    
    console.log("📩 Received message:", message);
    
    if (!message || message.trim() === "") {
      return NextResponse.json(
        { reply: "Please type a message.", success: false },
        { status: 400 }
      );
    }
    
    const msg = message.toLowerCase();
    let reply = "";
    
    // Emergency detection
    if (msg.includes("emergency") || msg.includes("danger") || msg.includes("attack") || 
        msg.includes("hurt") || msg.includes("help") || msg.includes("police") || 
        msg.includes("fire") || msg.includes("accident")) {
      reply = "🚨 **EMERGENCY ALERT** 🚨\n\n⚠️ Please call **911 or 112** immediately!\n\n• Find a safe location\n• Don't engage with suspects\n• Share your location with authorities\n\nI'm here to support you after you're safe.";
    }
    // Safety tips
    else if (msg.includes("safety") || msg.includes("tip") || msg.includes("prevent")) {
      reply = "🛡️ **Safety Tips** 🛡️\n\n**At Home:**\n• Install security cameras\n• Use deadbolt locks\n• Don't share vacation plans publicly\n\n**In Public:**\n• Stay in well-lit areas\n• Share location with trusted contacts\n• Keep valuables out of sight\n• Trust your instincts\n\n**Online:**\n• Use strong passwords\n• Don't share personal info\n• Report suspicious activity\n\nNeed specific tips for a situation?";
    }
    // Crime reporting
    else if (msg.includes("report") || msg.includes("crime") || msg.includes("file") || msg.includes("incident")) {
      reply = "📝 **How to Report a Crime** 📝\n\nYou can file a report by:\n\n1️⃣ **Online Form** - Click 'Report Crime' in the menu\n2️⃣ **Call** - 100 (Police helpline)\n3️⃣ **Visit** - Nearest police station\n\n**What to include:**\n• What happened?\n• When and where?\n• Suspect description\n• Evidence (photos/videos)\n\nWould you like me to open the report form?";
    }
    // Area safety
    else if (msg.includes("area") || msg.includes("near") || msg.includes("surrounding") || msg.includes("neighborhood")) {
      reply = "📍 **Area Safety Check** 📍\n\nTo check your area safety:\n\n• View **Live Crime Map** on dashboard\n• Check recent incidents nearby\n• See police station locations\n• Get real-time alerts\n\n**Safety Score:**\n• Daytime: Good\n• Evening: Moderate\n• Late night: Be cautious\n\nWould you like to view the crime map?";
    }
    // Legal rights
    else if (msg.includes("rights") || msg.includes("legal") || msg.includes("law")) {
      reply = "⚖️ **Your Legal Rights** ⚖️\n\nAs a crime victim or witness, you have the right to:\n\n✅ Report crimes without fear\n✅ Request anonymity\n✅ Receive protection if threatened\n✅ Get case updates\n✅ Access victim support services\n✅ Be treated with dignity\n\nNeed help with a specific legal situation?";
    }
    // Report status
    else if (msg.includes("status") || msg.includes("update") || msg.includes("track")) {
      reply = "📊 **Report Status Tracking** 📊\n\nTo check your report status:\n\n• Go to 'My Reports' in dashboard\n• Enter your Report ID\n• Check email for updates\n\n**Processing times:**\n• Initial review: 24-48 hours\n• Investigation: 5-7 days\n• Resolution: Varies\n\nNeed help finding your report ID?";
    }
    // Greeting
    else if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("namaste")) {
      reply = "👋 Hello! I'm your **Crime Safety Assistant**.\n\nI can help you with:\n\n🔹 Reporting a crime\n🔹 Safety tips and prevention\n🔹 Area safety checks\n🔹 Your legal rights\n🔹 Emergency guidance\n\nHow can I assist you today?";
    }
    // Thank you
    else if (msg.includes("thank") || msg.includes("thanks")) {
      reply = "🙏 You're welcome! I'm glad I could help.\n\nStay safe! Is there anything else you'd like to know?";
    }
    // Bye
    else if (msg.includes("bye") || msg.includes("goodbye")) {
      reply = "👋 Stay safe! Remember, CrimeSafety is always here to help.\n\nTake care and report any suspicious activity.";
    }
    // Default response
    else {
      reply = "I'm here to help with crime reporting and safety.\n\nYou can ask me about:\n\n• How to report a crime\n• Safety tips for home/public/online\n• Check area safety\n• Your legal rights\n• Emergency procedures\n\nWhat would you like to know?";
    }
    
    console.log("📤 Sending reply:", reply.substring(0, 50) + "...");
    
    return NextResponse.json({ 
      success: true, 
      reply: reply,
      sessionId: sessionId || `session_${Date.now()}`
    });
    
  } catch (error) {
    console.error("❌ Chat API Error:", error);
    return NextResponse.json(
      { reply: "Sorry, I'm having trouble. Please try again.", success: false },
      { status: 500 }
    );
  }
}