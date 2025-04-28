// useWebSocketData.js

import { useState, useEffect } from 'react';

export function useWebSocketData(url) {
  const [points, setPoints] = useState([]);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [frame, setFrame] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws); // Salva il websocket per poterlo usare fuori

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'point') {
        setPoints(message.data);
      } else if (message.type === 'image1') {
        setImage1(message.data);
      } else if (message.type === 'image2') {
        setImage2(message.data);
      } else if (message.type === 'frame') {
        setFrame(message.frame);
      }
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { points, image1, image2, frame, socket };
}