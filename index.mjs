import { createSocket } from "node:dgram";
import Device from "@bjclopes/homebridge-ledstrip-bledom/Device.js";

if (!process.argv[2]) {
  throw new Error("pls enter uuid");
}

const server = createSocket("udp4");
const uuid = process.argv[2];
const device = new Device(uuid);

server.on("error", (err) => {
  console.log(`server error: ${err.stack}`);
});

server.on("listening", () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.on("message", (msg, info) => {
  if (device.peripheral == undefined) return;

  const data = msg.slice(1, msg.length - 2);
  const r = data[0];
  const g = data[1];
  const b = data[2];

  device.set_rgb(r, g, b);
});

server.bind(1920);
