const express = require("express");
const router = express.Router();

const { sendOtp, verifyOtp } = require("../services/otpService");
const Order = require("../models/Order");

// Simple in-memory session
let sessions = {};

router.post("/message", async (req, res) => {
	try {
		const { sessionId, message } = req.body;

		if (!sessionId || !message) {
			return res.status(400).json({ reply: "Session ID and message are required" });
		}

		if (!sessions[sessionId]) {
			sessions[sessionId] = { step: "NORMAL" };
		}

		const session = sessions[sessionId];

		// STEP 1: Ask for phone
		if (session.step === "NORMAL" && message.toLowerCase().includes("order")) {
			session.step = "PHONE";
			return res.json({ reply: "Please enter your mobile number" });
		}

		// STEP 2: Send OTP
		if (session.step === "PHONE") {
			session.phone = message;
			await sendOtp(message);
			session.step = "OTP";
			return res.json({ reply: "OTP sent. Please enter OTP" });
		}

		// STEP 3: Verify OTP & Fetch Order
		if (session.step === "OTP") {
			const isValid = await verifyOtp(session.phone, message);

			if (!isValid) {
				return res.json({ reply: "Invalid OTP. Try again" });
			}

			const order = await Order.findOne({ userPhone: session.phone });

			if (!order) {
				return res.json({ reply: "No order found for this number" });
			}

			return res.json({
				reply: `Order Found!\n Product: ${order.productName}\n Status: ${order.status}\n Delivery: ${order.expectedDelivery}\n🔎 Tracking ID: ${order.trackingId}`,
			});
		}

		return res.json({
			reply: "💬 Ask me: Where is my order?",
		});
	} catch (error) {
		console.error("Error in /message route:", error);
		res.status(500).json({ reply: "Server error. Please try again later." });
	}
});

module.exports = router;
