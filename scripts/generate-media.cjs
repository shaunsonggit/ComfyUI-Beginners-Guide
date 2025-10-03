const fs = require("fs");
const path = require("path");
const GIFEncoder = require("gif-encoder-2");

const OUTPUT_DIR = path.join(__dirname, "../public/assets/images");
const WIDTH = 480;
const HEIGHT = 280;

const palette = {
  background: [239, 246, 255, 255],
  panel: [255, 255, 255, 255],
  panelBorder: [148, 163, 184, 255],
  highlightPanel: [254, 242, 242, 255],
  highlightBorder: [220, 38, 38, 255],
  text: [30, 41, 59, 255],
  accent: [59, 130, 246, 255],
  arrow: [148, 163, 184, 255],
  accentArrow: [59, 130, 246, 255]
};

const fontMap = {
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  D: [0b11100, 0b10010, 0b10001, 0b10001, 0b10001, 0b10010, 0b11100],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01111],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  I: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
  K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  V: [0b10001, 0b10001, 0b10001, 0b01010, 0b01010, 0b00100, 0b00100],
  W: [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b10101, 0b01010],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  "-": [0b00000, 0b00000, 0b00000, 0b01110, 0b00000, 0b00000, 0b00000],
  " ": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000]
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function drawRect(buffer, x, y, w, h, color) {
  const [r, g, b, a] = color;
  for (let py = y; py < y + h; py++) {
    if (py < 0 || py >= HEIGHT) continue;
    for (let px = x; px < x + w; px++) {
      if (px < 0 || px >= WIDTH) continue;
      const idx = (py * WIDTH + px) * 4;
      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }
}

function drawRectBorder(buffer, x, y, w, h, thickness, color) {
  drawRect(buffer, x, y, w, thickness, color);
  drawRect(buffer, x, y + h - thickness, w, thickness, color);
  drawRect(buffer, x, y, thickness, h, color);
  drawRect(buffer, x + w - thickness, y, thickness, h, color);
}

function drawText(buffer, x, y, text, color, scale = 2) {
  let cursor = x;
  const upper = text.toUpperCase();
  for (const char of upper) {
    const glyph = fontMap[char] || fontMap[" "];
    for (let row = 0; row < glyph.length; row++) {
      for (let col = 0; col < 5; col++) {
        const bit = (glyph[row] >> (4 - col)) & 1;
        if (bit === 1) {
          drawRect(buffer, cursor + col * scale, y + row * scale, scale, scale, color);
        }
      }
    }
    cursor += (5 + 1) * scale;
  }
}

function fillTriangle(buffer, p1, p2, p3, color) {
  const minX = Math.floor(Math.min(p1.x, p2.x, p3.x));
  const maxX = Math.ceil(Math.max(p1.x, p2.x, p3.x));
  const minY = Math.floor(Math.min(p1.y, p2.y, p3.y));
  const maxY = Math.ceil(Math.max(p1.y, p2.y, p3.y));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (pointInTriangle({ x, y }, p1, p2, p3)) {
        drawRect(buffer, x, y, 1, 1, color);
      }
    }
  }
}

function pointInTriangle(p, a, b, c) {
  const area = (u, v, w) =>
    Math.abs((u.x * (v.y - w.y) + v.x * (w.y - u.y) + w.x * (u.y - v.y)) / 2);
  const areaABC = area(a, b, c);
  const areaPAB = area(p, a, b);
  const areaPBC = area(p, b, c);
  const areaPCA = area(p, c, a);
  return Math.abs(areaPAB + areaPBC + areaPCA - areaABC) < 1;
}

function drawArrow(buffer, from, to, color) {
  const steps = 220;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(from.x + (to.x - from.x) * t);
    const y = Math.round(from.y + (to.y - from.y) * t);
    drawRect(buffer, x, y, 3, 3, color);
  }
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const size = 10;
  const left = {
    x: to.x - size * Math.cos(angle - Math.PI / 6),
    y: to.y - size * Math.sin(angle - Math.PI / 6)
  };
  const right = {
    x: to.x - size * Math.cos(angle + Math.PI / 6),
    y: to.y - size * Math.sin(angle + Math.PI / 6)
  };
  fillTriangle(buffer, to, left, right, color);
}

function createFrame({ nodes, highlightId, arrows }) {
  const buffer = Buffer.alloc(WIDTH * HEIGHT * 4, 0);
  drawRect(buffer, 0, 0, WIDTH, HEIGHT, palette.background);

  nodes.forEach((node) => {
    const isHighlight = node.id === highlightId;
    const panelColor = isHighlight ? palette.highlightPanel : palette.panel;
    const borderColor = isHighlight ? palette.highlightBorder : palette.panelBorder;
    drawRect(buffer, node.x, node.y, node.w, node.h, panelColor);
    drawRectBorder(buffer, node.x, node.y, node.w, node.h, 4, borderColor);
    if (node.title) {
      drawText(buffer, node.x + 16, node.y + 24, node.title, palette.text, 2);
    }
    if (node.subtitle) {
      drawText(buffer, node.x + 16, node.y + 56, node.subtitle, palette.accent, 2);
    }
  });

  arrows.forEach((arrow) => {
    const color = arrow.highlight ? palette.accentArrow : palette.arrow;
    drawArrow(buffer, arrow.from, arrow.to, color);
  });

  return buffer;
}

async function writeGif(name, nodes, sequence, arrowFactory) {
  const encoder = new GIFEncoder(WIDTH, HEIGHT);
  const filePath = path.join(OUTPUT_DIR, name);
  const stream = encoder.createReadStream().pipe(fs.createWriteStream(filePath));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(900);

  sequence.forEach((highlightId) => {
    const arrows = arrowFactory(highlightId);
    const frame = createFrame({ nodes, highlightId, arrows });
    encoder.addFrame(frame);
  });

  encoder.finish();
  await new Promise((resolve) => stream.on("finish", resolve));
  console.log(`Generated ${name}`);
}

function arrowsForWorkflow(highlightId) {
  const base = [
    { id: "prompt->clip", from: { x: 160, y: 110 }, to: { x: 220, y: 110 } },
    { id: "latent->ksampler", from: { x: 140, y: 210 }, to: { x: 260, y: 210 } },
    { id: "ksampler->vae", from: { x: 360, y: 160 }, to: { x: 420, y: 160 } },
    { id: "vae->save", from: { x: 430, y: 200 }, to: { x: 450, y: 240 } }
  ];
  return base.map((arrow) => ({
    ...arrow,
    highlight:
      (highlightId === "prompt" && arrow.id === "prompt->clip") ||
      (highlightId === "latent" && arrow.id === "latent->ksampler") ||
      (highlightId === "ksampler" && arrow.id === "ksampler->vae") ||
      (highlightId === "vae" && arrow.id === "vae->save")
  }));
}

function arrowsForReuse(highlightId) {
  const base = [
    { id: "import->checkpoint", from: { x: 160, y: 110 }, to: { x: 260, y: 110 } },
    { id: "checkpoint->prompt", from: { x: 290, y: 150 }, to: { x: 360, y: 170 } },
    { id: "prompt->adjust", from: { x: 370, y: 190 }, to: { x: 470, y: 200 } }
  ];
  return base.map((arrow) => ({
    ...arrow,
    highlight:
      (highlightId === "checkpoint" && arrow.id === "import->checkpoint") ||
      (highlightId === "prompt" && arrow.id === "checkpoint->prompt") ||
      (highlightId === "adjust" && arrow.id === "prompt->adjust")
  }));
}

async function generateGifs() {
  ensureDir(OUTPUT_DIR);

  const textToImageNodes = [
    { id: "prompt", x: 40, y: 60, w: 150, h: 90, title: "PROMPT", subtitle: "CLIP" },
    { id: "latent", x: 40, y: 180, w: 170, h: 90, title: "LATENT", subtitle: "空画布" },
    { id: "ksampler", x: 240, y: 120, w: 150, h: 110, title: "KSAMPLER", subtitle: "采样" },
    { id: "vae", x: 410, y: 140, w: 120, h: 100, title: "VAE", subtitle: "解码" },
    { id: "save", x: 360, y: 230, w: 160, h: 70, title: "SAVE", subtitle: "输出" }
  ];
  const textToImageSequence = ["prompt", "latent", "ksampler", "vae", "save"];

  const reuseNodes = [
    { id: "import", x: 40, y: 80, w: 150, h: 90, title: "IMPORT", subtitle: "JSON/PNG" },
    { id: "checkpoint", x: 220, y: 80, w: 170, h: 90, title: "CHECKPOINT", subtitle: "模型" },
    { id: "prompt", x: 220, y: 190, w: 170, h: 90, title: "PROMPT", subtitle: "提示词" },
    { id: "adjust", x: 410, y: 160, w: 150, h: 110, title: "ADJUST", subtitle: "细节" }
  ];
  const reuseSequence = ["import", "checkpoint", "prompt", "adjust"];

  await writeGif("text-to-image-demo.gif", textToImageNodes, textToImageSequence, arrowsForWorkflow);
  await writeGif("workflow-reuse-demo.gif", reuseNodes, reuseSequence, arrowsForReuse);
}

function createSvgFiles() {
  const conceptSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="960" height="520" viewBox="0 0 960 520" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .node { fill: #0f172a; stroke: #1d4ed8; stroke-width: 3; rx: 18; ry: 18; }
      .text { font-family: 'Inter', 'Segoe UI', sans-serif; font-size: 24px; fill: #e2e8f0; font-weight: 600; }
      .desc { font-family: 'Inter', 'Segoe UI', sans-serif; font-size: 18px; fill: #cbd5f5; }
      .callout { fill: #1d4ed8; opacity: 0.12; stroke: #93c5fd; stroke-dasharray: 8 6; stroke-width: 2; }
      .tag { font-family: 'Inter', 'Segoe UI', sans-serif; font-size: 16px; fill: #1d4ed8; font-weight: 600; }
    </style>
  </defs>
  <rect width="960" height="520" fill="#0b1120" rx="24" />
  <rect x="60" y="70" width="220" height="100" class="node" />
  <text x="90" y="120" class="text">节点</text>
  <text x="90" y="150" class="desc">功能积木</text>
  <rect x="360" y="70" width="220" height="100" class="node" />
  <text x="390" y="120" class="text">工作流</text>
  <text x="390" y="150" class="desc">积木搭建图</text>
  <rect x="660" y="70" width="220" height="100" class="node" />
  <text x="690" y="120" class="text">Checkpoint</text>
  <text x="690" y="150" class="desc">画风模型</text>
  <rect x="200" y="260" width="220" height="100" class="node" />
  <text x="230" y="310" class="text">LoRA</text>
  <text x="230" y="340" class="desc">细节风格微调</text>
  <rect x="520" y="260" width="220" height="100" class="node" />
  <text x="550" y="310" class="text">VAE</text>
  <text x="550" y="340" class="desc">色彩滤镜</text>
  <polyline points="170,170 170,260 200,260" stroke="#38bdf8" stroke-width="6" stroke-dasharray="12 10" fill="none" />
  <polyline points="790,170 790,260 740,260" stroke="#38bdf8" stroke-width="6" stroke-dasharray="12 10" fill="none" />
  <rect x="120" y="30" width="200" height="40" class="callout" />
  <text x="140" y="58" class="tag">逻辑输入</text>
  <rect x="380" y="30" width="200" height="40" class="callout" />
  <text x="410" y="58" class="tag">连接规则</text>
  <rect x="680" y="30" width="200" height="40" class="callout" />
  <text x="710" y="58" class="tag">生成基底</text>
</svg>`;

  const workflowOutlineSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="960" height="520" viewBox="0 0 960 520" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .panel { fill: #1e293b; stroke: #334155; stroke-width: 2; rx: 18; ry: 18; }
      .title { font-family: 'Inter', 'Segoe UI', sans-serif; font-size: 22px; fill: #f8fafc; font-weight: 600; }
      .step { font-family: 'Inter', 'Segoe UI', sans-serif; font-size: 16px; fill: #cbd5f5; }
    </style>
  </defs>
  <rect width="960" height="520" fill="#0f172a" rx="24" />
  <rect x="80" y="80" width="220" height="360" class="panel" />
  <text x="110" y="130" class="title">准备节点</text>
  <text x="110" y="170" class="step">• Prompt 节点</text>
  <text x="110" y="210" class="step">• Negative Prompt</text>
  <text x="110" y="250" class="step">• Checkpoint Loader</text>
  <rect x="370" y="80" width="220" height="360" class="panel" />
  <text x="400" y="130" class="title">生成阶段</text>
  <text x="400" y="170" class="step">• KSampler</text>
  <text x="400" y="210" class="step">• Empty Latent Image</text>
  <text x="400" y="250" class="step">• CLIP Text Encode</text>
  <rect x="660" y="80" width="220" height="360" class="panel" />
  <text x="690" y="130" class="title">输出阶段</text>
  <text x="690" y="170" class="step">• VAE Decode</text>
  <text x="690" y="210" class="step">• Save Image</text>
  <polyline points="300,260 370,260" stroke="#38bdf8" stroke-width="6" stroke-dasharray="16 10" fill="none" />
  <polyline points="590,260 660,260" stroke="#38bdf8" stroke-width="6" stroke-dasharray="16 10" fill="none" />
</svg>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, "core-concepts-map.svg"), conceptSvg, "utf8");
  fs.writeFileSync(path.join(OUTPUT_DIR, "workflow-outline.svg"), workflowOutlineSvg, "utf8");
  console.log("Generated SVG assets");
}

(async () => {
  try {
    await generateGifs();
    createSvgFiles();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
