require("dotenv").config();
const express = require("express");
const cors = require("cors");

const chatRoutes = require("./routes/chatRoutes");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
	res.send("Simple OTP Chatbot Backend Running");
});

// Connect to MongoDB and then start server
const startServer = async () => {
	try {
		await connectDB();
		const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();
