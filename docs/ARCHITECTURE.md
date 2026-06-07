# Architecture

## Bridge

`index.mjs` owns the BLE connection and two local UDP listeners:

- `127.0.0.1:4048`: standard DDP packets from OpenRGB
- `127.0.0.1:1920`: RGB packets from `visualizer.py`

Only the newest RGB value is retained. This prevents stale music frames from
building up in the BLE command queue.

The bridge limits BLE writes to approximately five updates per second because
the tested controller becomes unreliable when flooded with commands.

## OpenRGB Adapter

OpenRGB creates a virtual DDP LED strip named `Lotus Lantern BLE`. The device has
one logical LED because the tested BLE controller can set only one color for the
entire physical strip.

When a DDP packet contains multiple pixels, the bridge averages their RGB
values.

## BLE Protocol

The tested controller uses:

```text
Service:        FFF0
Write target:   FFF3
Write property: writeWithoutResponse
```

RGB command:

```text
7E 07 05 03 RR GG BB 10 EF
```

Example red:

```text
7E 07 05 03 FF 00 00 10 EF
```

## Standalone Audio Analysis

`visualizer.py` captures the default Windows speaker loopback, applies a Hann
window, calculates an FFT, and maps frequency bands to RGB:

- 20-250 Hz: red
- 250-2000 Hz: green
- 2000-8000 Hz: blue

Adaptive per-band peaks compensate for different playback volumes.
