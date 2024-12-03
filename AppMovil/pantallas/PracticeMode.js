import React, { useRef, useState, useEffect } from "react";

const PracticeMode = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [serverResponse, setServerResponse] = useState("");

  useEffect(() => {
    // Acceso a la cámara
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        // Conexión al WebSocket
        socketRef.current = new WebSocket("ws://localhost:5000/video-stream");

        // Escuchar mensajes del servidor
        socketRef.current.onmessage = (event) => {
          setServerResponse(event.data);
          console.log("Respuesta del servidor:", event.data);
        };

        // Enviar frames al WebSocket
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const intervalId = setInterval(() => {
          if (videoRef.current) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
              (blob) => {
                if (
                  socketRef.current &&
                  socketRef.current.readyState === WebSocket.OPEN
                ) {
                  socketRef.current.send(blob);
                }
              },
              "image/jpeg",
              0.95
            );
          }
        }, 100); // Capturar frames cada 100ms

        return () => clearInterval(intervalId);
      })
      .catch((err) => console.error("Error al acceder a la cámara:", err));

    // Cleanup al desmontar el componente
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>Letra: {serverResponse}</h1>
      <video ref={videoRef} autoPlay muted style={videoStyles}></video>
    </div>
  );
};

const videoStyles = {
  width: "100%",
  height: "auto",
  border: "2px solid black",
};

export default PracticeMode;
