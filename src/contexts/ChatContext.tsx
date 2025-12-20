import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  sendMessage: (content: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const mockResponses: Record<string, string[]> = {
  topology: [
    'Анализирую топологию связей между статьями. Найдено 3 кластера с высокой плотностью цитирований.',
    'Центральный узел графа — статья "Deep Learning in Medical Imaging" с 847 цитированиями.',
    'Обнаружена сильная корреляция между статьями 2023 года в области трансформеров.',
  ],
  default: [
    'Анализирую запрос... Найдено 42 релевантных статьи. Формирую отчёт.',
    'На основе анализа 165K статей выявлены ключевые тренды в исследованиях.',
    'Синтезирую данные из найденных источников для формирования выводов.',
  ],
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Готов к анализу. Введите запрос для поиска по 165,432 научным статьям.',
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || isProcessing) return;

    // Add user message
    addMessage(content, 'user');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = mockResponses.default;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'assistant');
      setIsProcessing(false);
    }, 1000 + Math.random() * 1000);
  }, [isProcessing, addMessage]);

  return (
    <ChatContext.Provider value={{ messages, addMessage, isProcessing, setIsProcessing, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
