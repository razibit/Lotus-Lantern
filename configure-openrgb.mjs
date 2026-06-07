import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const appData = process.env.APPDATA;
if (!appData) {
  throw new Error("APPDATA is not available.");
}

const configPath = join(appData, "OpenRGB", "OpenRGB.json");
if (!existsSync(configPath)) {
  throw new Error(`OpenRGB configuration was not found: ${configPath}`);
}

const config = JSON.parse(readFileSync(configPath, "utf8").replace(/^\uFEFF/, ""));
config.DDPDevices = {
  devices: [
    {
      name: "Lotus Lantern BLE",
      ip: "127.0.0.1",
      port: 4048,
      num_leds: 1,
      keepalive_time: 500,
    },
  ],
};

config.Detectors ??= {};
config.Detectors.detectors ??= {};
config.Detectors.detectors.DDP = true;

// Port 1920 is not an OpenRGB SDK endpoint.
config.Client ??= {};
config.Client.clients = (config.Client.clients ?? []).filter(
  (client) => !(client.ip === "127.0.0.1" && client.port === 1920),
);

writeFileSync(configPath, JSON.stringify(config, null, 4));
console.log(`Configured OpenRGB device "Lotus Lantern BLE" in ${configPath}`);
