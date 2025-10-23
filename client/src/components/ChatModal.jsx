import { useState, useEffect, useRef } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import { IoMdContact } from "react-icons/io";
import axios from 'axios';

const ChatModal = ({ isOpen, onClose }) => {
  // const [userInput, setUserInput] = useState("");
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Scrolls to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setMessages([{ text: "Hello, how can I help you?", sender: "bot" }]);
    }
  }, [isOpen]);
  
  // Function to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isOpen) return null;

  

  const handleInput = async (e) => {
    e.preventDefault();
    const newMessage = { type: 'user', text: prompt };
    setMessages((prev) => [...prev, newMessage]);
    setPrompt("");

    try {
      const res = await axios.post('http://localhost:3000/api/chat', { prompt });
      const botMessage = { type: 'bot', text: res.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = { type: 'bot', text: "Error fetching AI response" };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.div}>
          <h2>Chat</h2>
          <button onClick={onClose} style={styles.closeButton}>
            X
          </button>
        </div>
        <div style={styles.content}>
          <div style={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} items-center mb-2`}
              >
                <div
                  className={`px-3 text-[12px] py-2 rounded-lg max-w-[70%] ${
                    message.type === 'user' ? 'bg-blue-500 text-white rounded-l-md' : 'bg-blue-200 text-gray-700 rounded-r-md'
                  }`}
                >
                  {message.text}
                </div>
                {message.type === 'user' ? <IoMdContact /> : null}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            style={styles.input}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div onClick={handleInput} style={styles.sendButton}>
            <FaLocationArrow />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "8px",
    width: "300px",
    height: "400px",
    position: "absolute",
    right: "20px",
    display: "flex",
    flexDirection: "column",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    marginLeft: "10px",
  },
  div: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#13496b",
    padding: "10px",
    width: "100%",
    color: "white",
  },
  content: {
    flex: 1,
    padding: "10px",
    overflowY: "auto", // Makes the chat scrollable
  },
  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderTop: "1px solid #bbb",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #bbb",
  },
  sendButton: {
    marginLeft: "10px",
    width: "30px",
    height: "30px",
    backgroundColor: "#13496b",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    cursor: "pointer",
  },
};

export default ChatModal;