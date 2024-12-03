import { ref, onMounted, onBeforeUnmount } from "vue";

const videoRef = ref(null);
const socket = ref(null);
const serverResponse = ref("");

onMounted(() => {
  // Acceso a la cámara
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      if (videoRef.value) {
        videoRef.value.srcObject = stream;
        videoRef.value.play();
      }

      // Conexión al WebSocket
      socket.value = new WebSocket("ws://localhost:5000/video-stream");

      socket.value.onmessage = (event) => {
        serverResponse.value = event.data; 
        console.log("Respuesta del servidor:", event.data);
      };

      // Enviar frames al WebSocket
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      setInterval(() => {
        if (videoRef.value) {
          canvas.width = videoRef.value.videoWidth;
          canvas.height = videoRef.value.videoHeight;
          ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            if (socket.value && socket.value.readyState === WebSocket.OPEN) {
              socket.value.send(blob);
            }
          }, "image/jpeg");
        }
      }, 1000); // Capturar frames cada 100ms
    })
    .catch((err) => console.error("Error al acceder a la cámara:", err));
});

onBeforeUnmount(() => {
  if (videoRef.value && videoRef.value.srcObject) {
    const tracks = videoRef.value.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
  }
  if (socket.value) {
    socket.value.close();
  }
});

return(
    <div>
        <h1>Letra: {{ serverResponse }}</h1>
        <video ref="videoRef" autoplay muted></video>
    </div>
)
