import { useSSE } from '@/hooks/use-sse';

export const SSEMessageDisplay = () => {
  const { isConnected, messages } = useSSE('/api/sse');

  return (
    <div className="p-4">
      <div className="mb-4">
        <span className="font-semibold">Connection Status: </span>
        <span className={isConnected ? 'text-green-500' : 'text-red-500'}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Messages:</h3>
        {messages.map((message, index) => (
          <div key={index} className="p-2 bg-gray-100 rounded">
            <div className="text-sm text-gray-600">Event: {message.event}</div>
            <pre className="mt-1 text-sm">
              {JSON.stringify(message.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}; 