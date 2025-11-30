import React, { useState } from "react";
import axios from "axios";

function App() {
	const [message, setMessage] = useState("");
	const [chat, setChat] = useState([{ bot: "Hi! Ask me: Where is my order?" }]);

	const sessionId = "user123"; // simple fixed session

	const sendMessage = async () => {
		if (!message.trim()) return;

		// Add user message
		setChat((prev) => [...prev, { user: message }]);

		try {
			const res = await axios.post("http://localhost:5000/api/chat/message", {
				sessionId,
				message,
			});

			// Add bot reply
			setChat((prev) => [...prev, { bot: res.data.reply }]);
		} catch (err) {
			setChat((prev) => [...prev, { bot: "Server error" }]);
		}

		setMessage("");
	};

	return (
		<div style={styles.container}>
			<h2>Order Tracking Chatbot</h2>

			<div style={styles.chatBox}>
				{chat.map((msg, index) => (
					<div key={index}>
						{msg.user && <p style={styles.user}>You: {msg.user}</p>}
						{msg.bot && <p style={styles.bot}>Bot: {msg.bot}</p>}
					</div>
				))}
			</div>

			<div style={styles.inputArea}>
				<input
					style={styles.input}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder='Type your message...'
				/>
				<button
					style={styles.button}
					onClick={sendMessage}>
					Send
				</button>
			</div>
		</div>
	);
}

const styles = {
	container: {
		width: "400px",
		margin: "40px auto",
		padding: "20px",
		fontFamily: "Arial",
		borderRadius: "10px",
		background: "#f5f5f5",
		boxShadow: "0 0 10px #ccc",
		textAlign: "center",
	},
	chatBox: {
		height: "300px",
		overflowY: "auto",
		background: "#fff",
		padding: "10px",
		marginBottom: "10px",
		borderRadius: "5px",
		border: "1px solid #ddd",
	},
	user: {
		textAlign: "right",
		color: "blue",
		margin: "5px",
	},
	bot: {
		textAlign: "left",
		color: "green",
		margin: "5px",
	},
	inputArea: {
		display: "flex",
		gap: "5px",
	},
	input: {
		flex: 1,
		padding: "8px",
	},
	button: {
		padding: "8px 15px",
		background: "#007bff",
		color: "#fff",
		border: "none",
		cursor: "pointer",
	},
};

export default App;
