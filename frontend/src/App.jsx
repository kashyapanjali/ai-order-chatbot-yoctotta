import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/chat";

function App() {
	const [sessionId, setSessionId] = useState("");
	const [messages, setMessages] = useState([
		{
			role: "bot",
			content:
				"Hi! I can help you track your order. Try asking: 'Where is my order?'",
		},
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const id = "sess-" + Date.now() + "-" + Math.random().toString(36).slice(2);
		setSessionId(id);
	}, []);

	const sendMessage = async () => {
		if (!input.trim()) return;
		const userMsg = { role: "user", content: input };
		setMessages((prev) => [...prev, userMsg]);

		setLoading(true);
		try {
			const res = await axios.post(`${API_BASE}/message`, {
				sessionId,
				message: input,
			});

			const botMsg = { role: "bot", content: res.data.reply };
			setMessages((prev) => [...prev, botMsg]);
		} catch (err) {
			console.error(err);
			setMessages((prev) => [
				...prev,
				{ role: "bot", content: "Error talking to server." },
			]);
		} finally {
			setInput("");
			setLoading(false);
		}
	};

	const handleKey = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	return (
		<div className='page'>
			<div className='chat-card'>
				<h1 className='title'>AI Order Tracking Chatbot</h1>
				<div className='chat-window'>
					{messages.map((m, i) => (
						<div
							key={i}
							className={`msg-row \${m.role === "user" ? "right" : "left"}`}>
							<div className={`bubble \${m.role === "user" ? "user" : "bot"}`}>
								{m.content}
							</div>
						</div>
					))}
					{loading && <div className='typing'>Bot is typing…</div>}
				</div>
				<textarea
					className='input'
					placeholder='Type here… e.g. Where is my order?'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKey}
				/>
				<button
					onClick={sendMessage}
					disabled={loading}
					className='send-btn'>
					Send
				</button>
			</div>
		</div>
	);
}

export default App;
