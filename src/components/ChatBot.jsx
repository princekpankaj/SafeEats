import React, { useState, useRef, useEffect } from "react";
import { FaRobot } from "react-icons/fa";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hi! I'm your AI food assistant. What would you like to cook today?",
    },
  ]);

  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const typeBotResponse = (fullText) => {
    let index = 0;
    const typingInterval = 30; // ms per character
    let currentText = "";

    const typingTimer = setInterval(() => {
      currentText += fullText[index];
      index++;

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { from: "bot", text: currentText },
      ]);

      if (index >= fullText.length) {
        clearInterval(typingTimer);
      }
    }, typingInterval);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [
      ...prev,
      userMessage,
      { from: "bot", text: "⏳ Let me think..." },
    ]);
    setInput("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/chatbot/generate-recipe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: input }),
        }
      );

      const data = await response.json();

      // Add a little pause before typing starts
      setTimeout(() => {
        setMessages((prev) => [...prev.slice(0, -1), { from: "bot", text: "" }]);
        typeBotResponse(data.recipe || "Sorry, I couldn't generate a recipe.");
      }, 800); // delay after "Let me think..."
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { from: "bot", text: "Oops! Something went wrong." },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white border border-gray-300 dark:border-zinc-700 shadow-2xl rounded-xl w-80 h-96 flex flex-col overflow-hidden">
          <div className="bg-black text-white px-4 py-2 font-semibold flex justify-between items-center">
            <span className="flex items-center gap-2">
              <FaRobot /> AI Chef
            </span>
            <button onClick={toggleChat}>✖️</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.from === "user"
                    ? "bg-zinc-100 dark:bg-zinc-700 text-right ml-auto"
                    : "bg-zinc-200 dark:bg-zinc-800 text-left mr-auto"
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>

          <div className="p-2 flex border-t border-gray-300 dark:border-zinc-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-2 py-1 rounded-l-md bg-white dark:bg-zinc-800 text-black dark:text-white outline-none"
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-black hover:bg-zinc-900 text-white px-3 rounded-r-md"
            >
              ➤
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-black hover:bg-zinc-900 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        >
          <FaRobot size={22} />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
