export const COLORS = {
  line: "#211f1b",
  node: "#1f5fae",
};

export const CONFIG = {
  baseCount: 85,        // node count at ~1440px width
  minCount: 40,         // floor for small screens
  maxDist: 135,         // px; edges drawn only between nodes closer than this
  driftSpeed: 0.12,     // px/frame baseline drift
  lineOpacity: 0.11,    // faint but readable
  nodeOpacity: 0.55,    // nodes a touch stronger than lines
  nodeRadius: 1.6,
  flowLerp: 0.08,       // smoothing for scroll-velocity → flowOffset
  proximityRadius: 140, // cursor glow reach
  igniteRadius: 180,    // section-pulse reach (vertical band)
  wander: 0.012,        // per-frame random acceleration magnitude
  maxSpeed: 0.22,       // speed clamp so wander never runs away
};

/**
 * Scales CONFIG.baseCount linearly by width / 1440
 * Clamps to [CONFIG.minCount, CONFIG.baseCount]
 * @param {number} width - canvas width in pixels
 * @returns {number} node count (integer)
 */
export function nodeCountFor(width) {
  const scaled = CONFIG.baseCount * (width / 1440);
  const clamped = Math.max(CONFIG.minCount, Math.min(CONFIG.baseCount, scaled));
  return Math.round(clamped);
}

/**
 * Builds array of node objects with random positions and velocities
 * @param {number} count - number of nodes
 * @param {number} w - canvas width
 * @param {number} h - canvas height
 * @returns {Array} array of node objects: { x, y, vx, vy, baseR, pulse }
 */
export function buildNodes(count, w, h) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 2 * CONFIG.driftSpeed,
      vy: (Math.random() - 0.5) * 2 * CONFIG.driftSpeed,
      baseR: CONFIG.nodeRadius,
      pulse: 0,
    });
  }
  return nodes;
}

/**
 * Steps nodes: updates positions with toroidal wrapping
 * @param {Array} nodes - node array (mutated in place)
 * @param {number} w - canvas width
 * @param {number} h - canvas height
 */
export function stepNodes(nodes, w, h) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    // Organic random wander: nudge velocity each frame then clamp speed
    node.vx += (Math.random() - 0.5) * CONFIG.wander;
    node.vy += (Math.random() - 0.5) * CONFIG.wander;
    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
    if (speed > CONFIG.maxSpeed) {
      node.vx = (node.vx / speed) * CONFIG.maxSpeed;
      node.vy = (node.vy / speed) * CONFIG.maxSpeed;
    }

    node.x += node.vx;
    node.y += node.vy;

    // Toroidal wrapping
    if (node.x < 0) {
      node.x += w;
    } else if (node.x > w) {
      node.x -= w;
    }

    if (node.y < 0) {
      node.y += h;
    } else if (node.y > h) {
      node.y -= h;
    }
  }
}

/**
 * Draws the network: edges, nodes, cursor glow, velocity sparks
 * @param {CanvasRenderingContext2D} ctx - canvas 2d context
 * @param {Array} nodes - array of node objects
 * @param {Object} state - { drawProgress, flowOffset, velocity, mouse: { x, y, active }, dpr }
 */
export function drawNetwork(ctx, nodes, state) {
  const { drawProgress, flowOffset, velocity, mouse, dpr } = state;
  const h = ctx.canvas.height / dpr;

  // Wrap drawn y so nodes stay distributed across the full viewport at any scroll depth.
  // flowOffset is an unbounded accumulator; without wrapping, nodes drift off the bottom.
  const wrapY = (y) => ((y % h) + h) % h;

  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width / dpr, h);

  // ---- Draw edges ----
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];

      // Distance in x-y space
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.maxDist) {
        const ay = wrapY(a.y + flowOffset);
        const by = wrapY(b.y + flowOffset);

        // Skip edges whose drawn endpoints cross the wrap boundary (would draw a long diagonal)
        if (Math.abs(ay - by) >= CONFIG.maxDist) continue;

        const velocityBoost = Math.min(1, Math.abs(velocity) / 8);
        const alpha =
          CONFIG.lineOpacity * (1 - dist / CONFIG.maxDist) * drawProgress * (1 + velocityBoost);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = COLORS.line;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, ay);
        ctx.lineTo(b.x, by);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // ---- Draw nodes ----
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const ny = wrapY(node.y + flowOffset);
    const radius = node.baseR + node.pulse;

    ctx.save();
    ctx.globalAlpha = CONFIG.nodeOpacity;
    ctx.fillStyle = COLORS.node;
    ctx.beginPath();
    ctx.arc(node.x, ny, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ---- Cursor lines + glow ----
  if (mouse.active) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const ny = wrapY(node.y + flowOffset);

      const dx = node.x - mouse.x;
      const dy = ny - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.proximityRadius) {
        // Draw faint line
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = COLORS.line;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(node.x, ny);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
        ctx.restore();

        // Brighten the node
        const brightenedAlpha = Math.min(1, CONFIG.nodeOpacity * 1.6);
        ctx.save();
        ctx.globalAlpha = brightenedAlpha;
        ctx.fillStyle = COLORS.node;
        ctx.beginPath();
        ctx.arc(node.x, ny, node.baseR + node.pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // ---- Velocity sparks ----
  if (Math.abs(velocity) >= 0.5) {
    // Pick ~5 random edge pairs
    const sparkCount = 5;
    for (let s = 0; s < sparkCount; s++) {
      const i = Math.floor(Math.random() * nodes.length);
      let j = Math.floor(Math.random() * nodes.length);
      if (i === j) {
        j = (j + 1) % nodes.length;
      }

      const a = nodes[i];
      const b = nodes[j];

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.maxDist) {
        const ay = wrapY(a.y + flowOffset);
        const by = wrapY(b.y + flowOffset);

        // Skip sparks on wrap-crossing edges
        if (Math.abs(ay - by) >= CONFIG.maxDist) continue;

        // Interpolate along edge; stagger by index so sparks don't travel in lockstep
        const t = (Date.now() * 0.001 * Math.abs(velocity) * 0.3 + s * 0.2) % 1;
        const sparkX = a.x + (b.x - a.x) * t;
        const sparkY = ay + (by - ay) * t;

        const sparkAlpha = 0.6 * Math.min(1, Math.abs(velocity) / 8);

        ctx.save();
        ctx.globalAlpha = sparkAlpha;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
}
