const { sendOtpToEmail, verifyOtp } = require("./otpService");
const { runTool } = require("./mcpTools");

// In-memory session states: { [sessionId]: { state, email } }
const sessions = {};

// Simple intent detection: is user asking about order status?
const isOrderStatusIntent = (text) => {
  const t = text.toLowerCase();
  return (
    t.includes("where is my order") ||
    t.includes("where is my product") ||
    (t.includes("order") && (t.includes("where") || t.includes("status") || t.includes("track"))) ||
    t.includes("delivery time") ||
    t.includes("when will it arrive")
  );
};

exports.handleChat = async (sessionId, message) => {
  if (!sessions[sessionId]) {
    sessions[sessionId] = { state: "NORMAL", email: null };
  }
  const session = sessions[sessionId];
  const text = message.trim();

  // State: WAITING FOR EMAIL
  if (session.state === "AWAITING_EMAIL") {
    const email = text;
    session.email = email;
    await sendOtpToEmail(email);
    session.state = "AWAITING_OTP";

    return {
      reply: `✅ OTP sent to ${email}. Please enter the OTP to verify and view your order status.`
    };
  }

  // State: WAITING FOR OTP
  if (session.state === "AWAITING_OTP") {
    const otp = text;
    const ok = await verifyOtp(session.email, otp);

    if (!ok) {
      return {
        reply: "❌ Invalid or expired OTP. Please enter the correct OTP."
      };
    }

    session.state = "VERIFIED";

    const result = await runTool("get_latest_order", { email: session.email });

    if (!result.success) {
      return {
        reply:
          "✅ OTP verified, but I could not find any orders linked to your email."
      };
    }

    const items = result.items
      .map((it) => `${it.quantity} x ${it.name}`)
      .join(", ");

    let msg = `✅ OTP verified!

Your latest order: ${items}
Status: ${result.status}`;
    if (result.expectedDelivery) {
      msg += `
Expected delivery: ${new Date(result.expectedDelivery).toLocaleString()}`;
    }
    if (result.courier && result.trackingId) {
      msg += `
Courier: ${result.courier}
Tracking ID: ${result.trackingId}`;
    }

    return { reply: msg };
  }

  // State: NORMAL or VERIFIED
  if (session.state === "NORMAL" || session.state === "VERIFIED") {
    if (isOrderStatusIntent(text)) {
      session.state = "AWAITING_EMAIL";
      return {
        reply:
          "To check your order status, please enter the email used while placing the order."
      };
    }

    return {
      reply:
        "Hi! I can help you track your order. Type something like 'Where is my order?' to begin."
    };
  }

  return {
    reply: "Sorry, I didn't understand that."
  };
};
