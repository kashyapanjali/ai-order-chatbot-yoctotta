require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const chatRoutes = require("./routes/chatRoutes");

const app = express();
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
	res.send("Simple OTP Chatbot Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
