import { useEffect, useState } from "react";

export function useWebSocketData(url) {
  const [points, setPoints] = useState([]);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "point") {
        setPoints(prevPoints => [...prevPoints, data]);
      } else if (data.type === "image1") {
        setImage1(data.data);
      } else if (data.type === "image2") {
        setImage2(data.data);
      } else if (data.type === "frame") {
        setFrame(data.frame);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, [url]);

  return { points, image1, image2, frame };
}