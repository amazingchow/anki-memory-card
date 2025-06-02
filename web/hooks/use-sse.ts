import { useEffect, useCallback, useState } from 'react';

interface SSEMessage {
  event: string;
  data: Record<string, unknown>;
}

export const useSSE = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<SSEMessage[]>([]);

  const connect = useCallback(() => {
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, { event: event.type, data }]);
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      setIsConnected(false);
      eventSource.close();
      
      // 尝试重新连接
      setTimeout(() => {
        connect();
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      cleanup();
    };
  }, [connect]);

  return {
    isConnected,
    messages,
  };
}; 