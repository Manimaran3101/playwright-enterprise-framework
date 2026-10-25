import fs from 'node:fs';
import path from 'node:path';
import type { CDPSession, Page } from '@playwright/test';
import { applyPalette, GIFEncoder, quantize } from 'gifenc';
import jpeg from 'jpeg-js';

interface Frame {
  jpeg: Buffer;
  /** Seconds, from the screencast metadata. */
  timestamp: number;
}

// Records the page with the Chrome DevTools screencast and saves a GIF.
// Chrome only sends a frame when the page changes, so I rebuild the timing from the timestamps.
export class GifRecorder {
  private readonly frames: Frame[] = [];
  private cdp?: CDPSession;

  constructor(
    private readonly page: Page,
    private readonly options = { maxWidth: 800, maxHeight: 500, fps: 8, holdLastMs: 3000 },
  ) {}

  async start(): Promise<void> {
    this.cdp = await this.page.context().newCDPSession(this.page);
    this.cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
      this.frames.push({ jpeg: Buffer.from(data, 'base64'), timestamp: metadata.timestamp ?? 0 });
      await this.cdp?.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
    });
    await this.cdp.send('Page.startScreencast', {
      format: 'jpeg',
      quality: 85,
      maxWidth: this.options.maxWidth,
      maxHeight: this.options.maxHeight,
    });
  }

  async stop(outFile: string): Promise<{ frames: number; bytes: number }> {
    await this.cdp?.send('Page.stopScreencast');
    if (this.frames.length === 0) throw new Error('No screencast frames were captured');

    // Put frames on a fixed fps timeline and join repeated frames into one longer frame.
    const step = 1 / this.options.fps;
    const start = this.frames[0].timestamp;
    const end = this.frames.at(-1)!.timestamp;
    const timeline: { frame: number; delayMs: number }[] = [];
    let cursor = 0;
    for (let t = start; t <= end; t += step) {
      while (cursor + 1 < this.frames.length && this.frames[cursor + 1].timestamp <= t) cursor++;
      const last = timeline.at(-1);
      if (last?.frame === cursor) last.delayMs += step * 1000;
      else timeline.push({ frame: cursor, delayMs: step * 1000 });
    }
    timeline.at(-1)!.delayMs += this.options.holdLastMs;

    const decoded = timeline.map(({ frame }) =>
      jpeg.decode(this.frames[frame].jpeg, { useTArray: true }),
    );

    // One palette for all frames, plus one transparent colour. Then each frame only
    // needs the pixels that changed (makes the GIF much smaller).
    const sample = decoded.filter((_, i) => i % Math.ceil(decoded.length / 12) === 0);
    const sampleRgba = new Uint8Array(sample.reduce((n, f) => n + f.data.length, 0));
    sample.reduce((offset, f) => (sampleRgba.set(f.data, offset), offset + f.data.length), 0);
    const colours = quantize(sampleRgba, 255);
    // Use only the real colours here. Otherwise black pixels can become transparent
    // and the old frame shows through.
    const transparentIndex = colours.length;
    const palette = [...colours, [255, 0, 255]];

    const gif = GIFEncoder();
    let previous: Uint8Array | undefined;
    decoded.forEach(({ width, height, data }, i) => {
      const index = applyPalette(data, colours);
      const delta = index.slice();
      if (previous && previous.length === index.length) {
        for (let p = 0; p < index.length; p++) {
          if (index[p] === previous[p]) delta[p] = transparentIndex;
        }
      }
      gif.writeFrame(delta, width, height, {
        palette: i === 0 ? palette : undefined,
        delay: Math.round(timeline[i].delayMs),
        transparent: i > 0,
        transparentIndex,
        dispose: 1, // keep the previous frame under the transparent pixels
      });
      previous = index;
    });
    gif.finish();

    const bytes = gif.bytes();
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, bytes);
    return { frames: timeline.length, bytes: bytes.length };
  }
}

// Shows a caption at the bottom of the page during the recording.
export async function caption(page: Page, text: string): Promise<void> {
  await page.evaluate((label) => {
    let el = document.getElementById('demo-caption');
    if (!el) {
      el = document.createElement('div');
      el.id = 'demo-caption';
      Object.assign(el.style, {
        position: 'fixed',
        left: '50%',
        bottom: '28px',
        transform: 'translateX(-50%)',
        zIndex: '2147483647',
        padding: '12px 22px',
        borderRadius: '999px',
        background: 'rgba(17, 24, 39, 0.92)',
        color: '#fff',
        font: '600 20px/1.3 system-ui, -apple-system, Segoe UI, sans-serif',
        boxShadow: '0 6px 24px rgba(0,0,0,.3)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      });
      document.body.appendChild(el);
    }
    el.textContent = label;
  }, text);
}
