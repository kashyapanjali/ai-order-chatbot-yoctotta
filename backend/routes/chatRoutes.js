const express = require("express");
const router = express.Router();
const { handleChat } = require("../services/chatService");

router.post("/message", async (req, res) => {
	try {
		const { sessionId, message } = req.body;
		if (!sessionId || !message) {
			return res
				.status(400)
				.json({ message: "sessionId and message required" });
		}

		const result = await handleChat(sessionId, message);
		return res.json(result);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Chat error" });
	}
});

module.exports = router;
