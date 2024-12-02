import {
  allComponents,
  provideFluentDesignSystem,
} from "@fluentui/web-components";
import { SocketCanvasElement } from "./socket_canvas.js";
// Make everything use microsoft fluent by default.
provideFluentDesignSystem().register(allComponents);

/* 

Useful types (you don't have to use them explicitly, 
they serve as documentation for what the protocol is doing) 

*/

interface Point {
  x: number;
  y: number;
}

interface WelcomeMessage {
  // The size of the remote canvas.
  x: number;
  y: number;
  data: [number];
}

interface UpdateMessage {
  point: Point;
  value: boolean;
}

// Create a websocket connection.
// More info at https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
const socket = new WebSocket("ws:socket.zavazadlo.unsigned-short.com");
socket.onmessage = (message) => {
  try {
    const data = JSON.parse(message.data);

    if (data.x && data.y && Array.isArray(data.data)) {
      const width = data.x;
      const height = data.y;
      const pixelData = data.data;

      canvas.width = width;
      canvas.height = height;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = y * width + x;
          const value = pixelData[index];
          canvas.setPixel(x, y, !!value);
        }
      }
    }
  } catch (err) {
    console.error("Failed to parse server response:", err);
  }
};

// Example of how to use the canvas element:
const canvas = new SocketCanvasElement();
canvas.width = 128;
canvas.height = 128;

function updateCanvas() {
  socket.onmessage = (message) => {
    try {
      const data = JSON.parse(message.data);
      if (Array.isArray(data)) {
        data.forEach((update) => {
          const { point, value } = update;
          if (
            point &&
            typeof point.x === "number" &&
            typeof point.y === "number"
          ) {
            canvas.setPixel(point.x, point.y, value);
          }
        });
      }
    } catch (err) {
      console.error("Failed to parse server response:", err);
    }
  };
}

canvas.ondraw = (x, y) => {
  canvas.setPixel(x, y, true);
  socket.send(JSON.stringify({ point: { x: x, y: y }, value: false })); //false for white, true for black
  updateCanvas();
};

setInterval(() => {
  socket.send(JSON.stringify({ point: { x: 1, y: 1 }, value: false })); // idk if it can be empty
  updateCanvas();
}, 500);

document.querySelector("#container")!.appendChild(canvas);

// We can only draw into canvas once it is actually shown, hence we postpose the draw operation.
setTimeout(() => {
  for (let x = 0; x < 128; x++) {
    canvas.setPixel(x, x, true);
  }
});
