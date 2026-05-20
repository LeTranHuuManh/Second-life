import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { MessageDTO } from '@workspace/api-client-react';

export function useChatWebSocket(userId: number | undefined) {
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: function (str) {
        // console.log("STOMP: ", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function (frame) {
      // console.log('STOMP connected', frame);
      client.subscribe(`/topic/user/${userId}/messages`, (msg) => {
        if (msg.body) {
          const newMessage: MessageDTO = JSON.parse(msg.body);
          setMessages((prev) => {
            // Prevent duplicates if needed
            if (prev.find(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      });
    };

    client.onStompError = function (frame) {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [userId]);

  const clearMessages = () => setMessages([]);

  return { incomingMessages: messages, clearMessages };
}