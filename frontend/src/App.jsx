import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
	const [message, setMessage] = useState("");
	const [chat, setChat] = useState([{ bot: "Hi! I'm here to help you track your order. Ask me: Where is my order?" }]);
	const [loading, setLoading] = useState(false);
	const chatEndRef = useRef(null);
	const inputRef = useRef(null);

	const sessionId = "user123"; // simple fixed session

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chat]);

	const sendMessage = async () => {
		if (!message.trim() || loading) return;

		const userMessage = message.trim();
		// Add user message
		setChat((prev) => [...prev, { user: userMessage }]);
		setMessage("");
		setLoading(true);

		try {
			const res = await axios.post("http://localhost:5000/api/chat/message", {
				sessionId,
				message: userMessage,
			});

			// Add bot reply
			setChat((prev) => [...prev, { bot: res.data.reply }]);
		} catch (err) {
			setChat((prev) => [
				...prev,
				{ bot: "Sorry, I'm having trouble connecting. Please try again later." },
			]);
		} finally {
			setLoading(false);
			inputRef.current?.focus();
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const formatMessage = (text) => {
		// Split by newlines and create paragraphs
		return text.split("\n").map((line, index) => (
			<span key={index}>
				{line}
				{index < text.split("\n").length - 1 && <br />}
			</span>
		));
	};

	return (
		<div style={styles.container}>
			<div style={styles.header}>
				<div style={styles.headerContent}>
					<div style={styles.botAvatar}>🤖</div>
					<div>
						<h2 style={styles.title}>Order Tracking Assistant</h2>
						<p style={styles.subtitle}>Online • Ready to help</p>
					</div>
				</div>
			</div>

			<div style={styles.chatBox} id="chatBox">
				{chat.map((msg, index) => (
					<div key={index} style={styles.messageWrapper}>
						{msg.user && (
							<div style={styles.userMessage}>
								<div style={styles.userBubble}>
									{formatMessage(msg.user)}
								</div>
								<div style={styles.userAvatar}>👤</div>
							</div>
						)}
						{msg.bot && (
							<div style={styles.botMessage}>
								<div style={styles.botAvatarSmall}>🤖</div>
								<div style={styles.botBubble}>
									{formatMessage(msg.bot)}
								</div>
							</div>
						)}
					</div>
				))}
				{loading && (
					<div style={styles.botMessage}>
						<div style={styles.botAvatarSmall}>🤖</div>
						<div style={styles.botBubble}>
							<div style={styles.typingIndicator}>
								<span style={{ ...styles.typingDot, animationDelay: "0s" }}></span>
								<span style={{ ...styles.typingDot, animationDelay: "0.2s" }}></span>
								<span style={{ ...styles.typingDot, animationDelay: "0.4s" }}></span>
							</div>
						</div>
					</div>
				)}
				<div ref={chatEndRef} />
			</div>

			<div style={styles.inputArea}>
				<input
					ref={inputRef}
					style={styles.input}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="Type your message..."
					disabled={loading}
				/>
				<button
					style={{
						...styles.button,
						opacity: loading || !message.trim() ? 0.5 : 1,
						cursor: loading || !message.trim() ? "not-allowed" : "pointer",
					}}
					onClick={sendMessage}
					disabled={loading || !message.trim()}>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2">
						<line x1="22" y1="2" x2="11" y2="13"></line>
						<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
					</svg>
				</button>
			</div>
		</div>
	);
}

const styles = {
	container: {
		width: "100%",
		maxWidth: "450px",
		height: "600px",
		margin: "20px auto",
		display: "flex",
		flexDirection: "column",
		fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
		background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
		borderRadius: "12px",
		overflow: "hidden",
	},
	header: {
		background: "rgba(255, 255, 255, 0.95)",
		padding: "20px",
		borderBottom: "1px solid rgba(0,0,0,0.1)",
		boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
	},
	headerContent: {
		display: "flex",
		alignItems: "center",
		gap: "15px",
	},
	botAvatar: {
		width: "50px",
		height: "50px",
		borderRadius: "50%",
		background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "24px",
		boxShadow: "0 4px 10px rgba(102, 126, 234, 0.4)",
	},
	title: {
		margin: 0,
		fontSize: "20px",
		fontWeight: "600",
		color: "#333",
	},
	subtitle: {
		margin: "4px 0 0 0",
		fontSize: "13px",
		color: "#666",
	},
	chatBox: {
		flex: 1,
		overflowY: "auto",
		padding: "20px",
		background: "#f5f7fa",
		display: "flex",
		flexDirection: "column",
		gap: "12px",
	},
	messageWrapper: {
		display: "flex",
		flexDirection: "column",
	},
	userMessage: {
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "flex-end",
		gap: "8px",
		marginBottom: "4px",
	},
	userBubble: {
		background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		color: "#fff",
		padding: "12px 16px",
		borderRadius: "18px 18px 4px 18px",
		maxWidth: "75%",
		wordWrap: "break-word",
		boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
		fontSize: "14px",
		lineHeight: "1.4",
	},
	userAvatar: {
		width: "28px",
		height: "28px",
		borderRadius: "50%",
		background: "#e0e0e0",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "16px",
		flexShrink: 0,
	},
	botMessage: {
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "flex-end",
		gap: "8px",
		marginBottom: "4px",
	},
	botAvatarSmall: {
		width: "28px",
		height: "28px",
		borderRadius: "50%",
		background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "16px",
		flexShrink: 0,
	},
	botBubble: {
		background: "#fff",
		color: "#333",
		padding: "12px 16px",
		borderRadius: "18px 18px 18px 4px",
		maxWidth: "75%",
		wordWrap: "break-word",
		boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
		fontSize: "14px",
		lineHeight: "1.4",
	},
	typingIndicator: {
		display: "flex",
		gap: "4px",
		padding: "4px 0",
		alignItems: "center",
	},
	typingDot: {
		width: "8px",
		height: "8px",
		borderRadius: "50%",
		background: "#999",
		display: "inline-block",
		animation: "typing 1.4s infinite ease-in-out",
	},
	inputArea: {
		display: "flex",
		gap: "10px",
		padding: "15px 20px",
		background: "#fff",
		borderTop: "1px solid rgba(0,0,0,0.1)",
		boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
	},
	input: {
		flex: 1,
		padding: "12px 16px",
		border: "2px solid #e0e0e0",
		borderRadius: "24px",
		fontSize: "14px",
		outline: "none",
		transition: "border-color 0.3s",
		fontFamily: "inherit",
	},
	button: {
		width: "44px",
		height: "44px",
		borderRadius: "50%",
		background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		color: "#fff",
		border: "none",
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
		transition: "transform 0.2s, box-shadow 0.2s",
	},
};

// Add CSS for typing animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
	@keyframes typing {
		0%, 60%, 100% {
			transform: translateY(0);
			opacity: 0.7;
		}
		30% {
			transform: translateY(-10px);
			opacity: 1;
		}
	}
	#chatBox::-webkit-scrollbar {
		width: 6px;
	}
	#chatBox::-webkit-scrollbar-track {
		background: transparent;
	}
	#chatBox::-webkit-scrollbar-thumb {
		background: rgba(0,0,0,0.2);
		border-radius: 3px;
	}
	#chatBox::-webkit-scrollbar-thumb:hover {
		background: rgba(0,0,0,0.3);
	}
	input:focus {
		border-color: #667eea !important;
	}
	button:hover:not(:disabled) {
		transform: scale(1.05);
		box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5) !important;
	}
	button:active:not(:disabled) {
		transform: scale(0.95);
	}
`;
document.head.appendChild(styleSheet);

export default App;
