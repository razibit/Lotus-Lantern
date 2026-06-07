# Troubleshooting

## Expected Data Flow

### OpenRGB Effects mode

```text
OpenRGB Effects
  -> virtual "Lotus Lantern BLE" device
  -> DDP packet on 127.0.0.1:4048
  -> index.mjs
  -> BLE FFF3 characteristic
  -> LED strip
```

### Built-in visualizer mode

```text
Windows speaker loopback
  -> visualizer.py
  -> custom UDP packet on 127.0.0.1:1920
  -> index.mjs
  -> BLE FFF3 characteristic
  -> LED strip
```

## Connection Checklist

1. Turn on the LED controller.
2. Close the Lotus Lantern mobile app completely.
3. Enable Bluetooth in Windows.
4. Check the address in `config.cmd`.
5. Run only one top-level launcher.
6. Wait at least 8 seconds for BLE discovery.

Successful bridge output includes:

```text
Characteristic: 0000fff3-0000-1000-8000-00805f9b34fb
properties=read,writeWithoutResponse
BLE Connected and ready
```

## OpenRGB Does Not Show the Device

OpenRGB must contain this manual DDP configuration:

```json
{
  "DDPDevices": {
    "devices": [
      {
        "name": "Lotus Lantern BLE",
        "ip": "127.0.0.1",
        "port": 4048,
        "num_leds": 1,
        "keepalive_time": 500
      }
    ]
  }
}
```

The DDP detector must also be enabled. In OpenRGB, check **Settings > Supported
Devices** and enable **DDP**, then restart OpenRGB.

Do not configure OpenRGB's **Client** page to port `1920`. The Client page uses
the OpenRGB TCP SDK protocol, while port `1920` accepts the project's small UDP
RGB packet.

## OpenRGB Shows the Device but Effects Do Nothing

1. Open the Effects tab.
2. Select `Lotus Lantern BLE`.
3. Select an audio effect.
4. Select the correct Windows output or loopback audio device.
5. Start or enable the effect.
6. Confirm no standalone visualizer is running.

Some effects draw different colors across many pixels. This controller can only
set the whole strip to one color, so the bridge averages every DDP pixel.

## Wrong Characteristic

A successful Windows write callback does not prove the LED controller accepted
the command. The bridge must write to `FFF3`.

Incorrect:

```text
00002a00-0000-1000-8000-00805f9b34fb
properties=read,notify
```

Correct:

```text
0000fff3-0000-1000-8000-00805f9b34fb
properties=read,writeWithoutResponse
```

## Stale Processes and Port Conflicts

The bridge creates `connector.pid`; the standalone visualizer creates
`visualizer.pid`. Launchers use these files to stop their previous instances.

Ports:

| Port | Protocol | Owner |
| --- | --- | --- |
| `4048/UDP` | DDP | BLE bridge |
| `1920/UDP` | Legacy visualizer RGB | BLE bridge |
| `6742/TCP` | OpenRGB SDK | OpenRGB |

If a port remains occupied after all project windows are closed, restart
Windows. This is often faster and safer than terminating unrelated Node or
Python programs.

## Audio Capture Problems

The Python visualizer uses Windows loopback capture through `soundcard`.

Try:

1. Make the intended speakers the Windows default output device.
2. Restart `start-music-sync.cmd`.
3. Play audio through that exact device.
4. Avoid switching speakers after the visualizer starts.

Bluetooth headphones can change Windows audio endpoints when switching between
stereo and headset modes. Restart the visualizer after such a change.

## Device Compatibility Test

The strip is likely compatible when:

- It appears as `ELK-BLEDOM`, `ELK-BLEDDM`, or a similar `ELK-*` name.
- It works with the Lotus Lantern app.
- It exposes BLE service `FFF0`.
- It exposes writable characteristic `FFF3`.

It is likely incompatible without additional development when:

- It is Wi-Fi only.
- It uses Magic Home, Tuya, Govee, or another unrelated protocol.
- It exposes a different writable characteristic and command format.
- It is an addressable strip requiring individual pixel control from the BLE
  controller.

## Reporting a Bug

Include:

- Windows version
- Node.js version
- Python version
- OpenRGB version
- Advertised BLE device name
- Service and characteristic UUIDs
- The complete bridge log from discovery through the first RGB command

Remove Bluetooth addresses if you do not want to publish them.
