import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Chatbot from "@/components/Chatbot";
import { ChatProvider } from "@/context/ChatContext";

export default function Home() {
  return (
    <ChatProvider initiallyOpen={false}>
      <div className="relative min-h-dvh overflow-hidden">
        <Header />
        <Hero />
      </div>
      <Chatbot />
    </ChatProvider>
  );
}
