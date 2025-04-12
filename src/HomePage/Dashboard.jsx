import React from "react";
import Navbar from "../components/Navbar";
import Scanner from "../components/Scanner";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot"; // ✅ import chatbot

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="mt-23">
        <Scanner />
      </main>

      <Footer />

      <ChatBot /> {/* ✅ Floating chatbot in bottom-right */}
    </div>
  );
};

export default Dashboard;
