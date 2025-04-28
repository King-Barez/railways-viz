import { useState, useEffect } from 'react';

export function useWebSocketData(url) {
  const [points, setPoints] = useState([]);
  const [detections, setDetections] = useState([]); // <-- nuovo stato per le detections
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [frame, setFrame] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws); // Salva il websocket

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'point':
          setPoints(message.data);
          break;
        case 'detections': // <-- nuovo caso per gestire detection
          setDetections(message.data);
          break;
        case 'image1':
          setImage1(message.data);
          break;
        case 'image2':
          setImage2(message.data);
          break;
        case 'frame':
          setFrame(message.frame);
          break;
        default:
          console.warn('Messaggio sconosciuto ricevuto dal server:', message);
      }
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { points, detections, image1, image2, frame, socket }; // <-- aggiungi detections qui
}
