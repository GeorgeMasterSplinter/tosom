/* ═══════════════════════════════════════════
   Tosom — Social Graph Visualization
   Lightweight canvas-basert visualisering av relasjonsdynamikk
   ═══════════════════════════════════════════ */

"use client";

import { useEffect, useRef, useState } from "react";
import { isFlagEnabled } from "@/utils/flags";

interface GraphNode {
  id: string;
  label: string;
  type: "user" | "match" | "memory" | "journey" | "message";
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pinned?: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  color: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface SocialGraphProps {
  conversationId: string;
  matchCount: number;
  messageCount: number;
  journeySteps: number;
  resonanceHistory: number[];
}

const NODE_COLORS: Record<string, string> = {
  user: "#D4AF37",
  match: "#FF8C6C",
  memory: "#64B4FF",
  journey: "#64FFB4",
  message: "#FFD700",
};

export function SocialGraph({
  conversationId,
  matchCount,
  messageCount,
  journeySteps,
  resonanceHistory,
}: SocialGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const hasAccess = isFlagEnabled("enableSocialGraph");

  useEffect(() => {
    if (!hasAccess || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ctx is guaranteed to exist from above check
    const safeCtx = ctx as CanvasRenderingContext2D;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate graph data
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // Center node (the relationship)
    const centerNode: GraphNode = {
      id: "center",
      label: "Dere to",
      type: "user",
      x: w / 2,
      y: h / 2,
      vx: 0,
      vy: 0,
      radius: 30,
      color: NODE_COLORS.user,
      pinned: true,
    };
    nodes.push(centerNode);

    // Match nodes
    for (let i = 0; i < Math.min(matchCount, 8); i++) {
      const angle = (i / Math.max(matchCount, 1)) * Math.PI * 2;
      const dist = 120 + Math.random() * 40;
      nodes.push({
        id: `match-${i}`,
        label: `Match ${i + 1}`,
        type: "match",
        x: w / 2 + Math.cos(angle) * dist,
        y: h / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 12 + Math.random() * 6,
        color: NODE_COLORS.match,
      });
      edges.push({
        from: "center",
        to: `match-${i}`,
        weight: 0.3 + Math.random() * 0.4,
        color: `${NODE_COLORS.match}66`,
      });
    }

    // Memory nodes
    for (let i = 0; i < Math.min(5, 3 + Math.floor(messageCount / 10)); i++) {
      const angle = Math.PI * 0.5 + (i / 5) * Math.PI;
      const dist = 100 + Math.random() * 50;
      nodes.push({
        id: `memory-${i}`,
        label: `Minne ${i + 1}`,
        type: "memory",
        x: w / 2 + Math.cos(angle) * dist,
        y: h / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 10 + Math.random() * 5,
        color: NODE_COLORS.memory,
      });
      edges.push({
        from: "center",
        to: `memory-${i}`,
        weight: 0.2 + Math.random() * 0.3,
        color: `${NODE_COLORS.memory}66`,
      });
    }

    // Journey nodes
    for (let i = 0; i < Math.min(journeySteps, 6); i++) {
      const angle = -Math.PI * 0.5 + (i / 6) * Math.PI * 0.8;
      const dist = 130 + Math.random() * 30;
      nodes.push({
        id: `journey-${i}`,
        label: `Steg ${i + 1}`,
        type: "journey",
        x: w / 2 + Math.cos(angle) * dist,
        y: h / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 10 + Math.random() * 4,
        color: NODE_COLORS.journey,
      });
      edges.push({
        from: "center",
        to: `journey-${i}`,
        weight: 0.2 + Math.random() * 0.3,
        color: `${NODE_COLORS.journey}66`,
      });
    }

    // Message cluster (large circle of small nodes)
    const msgCount = Math.min(20, Math.max(5, Math.floor(messageCount / 5)));
    for (let i = 0; i < msgCount; i++) {
      const angle = (i / msgCount) * Math.PI * 2;
      const dist = 160 + Math.sin(angle * 3) * 20;
      nodes.push({
        id: `msg-${i}`,
        label: "",
        type: "message",
        x: w / 2 + Math.cos(angle) * dist,
        y: h / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 3 + Math.random() * 2,
        color: NODE_COLORS.message,
      });
      // Connect to nearest match or center
      const nearestMatch = nodes.find((n) => n.id.startsWith("match-"));
      if (nearestMatch) {
        edges.push({
          from: `msg-${i}`,
          to: nearestMatch.id,
          weight: 0.1,
          color: `${NODE_COLORS.message}33`,
        });
      }
    }

    // Simulation state
    let simNodes = [...nodes];
    let simEdges = [...edges];

    // Physics simulation
    function simulate() {
      // Repulsion between all nodes
      for (let i = 0; i < simNodes.length; i++) {
        for (let j = i + 1; j < simNodes.length; j++) {
          const dx = simNodes[j].x - simNodes[i].x;
          const dy = simNodes[j].y - simNodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 200) {
            const force = (200 - dist) / dist * 0.1;
            simNodes[i].vx -= dx * force;
            simNodes[i].vy -= dy * force;
            simNodes[j].vx += dx * force;
            simNodes[j].vy += dy * force;
          }
        }
      }

      // Center gravity
      for (const node of simNodes) {
        if (node.pinned) continue;
        const dx = w / 2 - node.x;
        const dy = h / 2 - node.y;
        node.vx += dx * 0.001;
        node.vy += dy * 0.001;
      }

      // Update positions
      for (const node of simNodes) {
        if (node.pinned) continue;
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.95;
        node.vy *= 0.95;

        // Boundary constraints
        node.x = Math.max(node.radius, Math.min(w - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(h - node.radius, node.y));
      }
    }

    // Render
    function render() {
      safeCtx.clearRect(0, 0, w, h);

      // Draw edges
      for (const edge of simEdges) {
        const fromNode = simNodes.find((n) => n.id === edge.from);
        const toNode = simNodes.find((n) => n.id === edge.to);
        if (!fromNode || !toNode) continue;

        safeCtx.beginPath();
        safeCtx.moveTo(fromNode.x, fromNode.y);
        safeCtx.lineTo(toNode.x, toNode.y);
        safeCtx.strokeStyle = edge.color;
        safeCtx.lineWidth = edge.weight * 3;
        safeCtx.stroke();
      }

      // Draw nodes
      for (const node of simNodes) {
        safeCtx.beginPath();
        safeCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        safeCtx.fillStyle = node.color;
        safeCtx.globalAlpha = node.id === hoveredNode ? 1 : 0.7;
        safeCtx.fill();
        safeCtx.globalAlpha = 1;

        // Glow for center node
        if (node.pinned) {
          safeCtx.beginPath();
          safeCtx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
          safeCtx.strokeStyle = node.color + "33";
          safeCtx.lineWidth = 2;
          safeCtx.stroke();
        }

        // Label
        if (node.label && node.radius > 8) {
          safeCtx.fillStyle = "rgba(255,255,255,0.6)";
          safeCtx.font = "10px Inter, sans-serif";
          safeCtx.textAlign = "center";
          safeCtx.fillText(node.label, node.x, node.y + node.radius + 14);
        }
      }

      // Resonance indicator (small chart at bottom)
      if (resonanceHistory.length > 1) {
        const chartY = h - 40;
        const chartW = 120;
        const chartH = 20;
        const startX = w - chartW - 20;

        safeCtx.beginPath();
        safeCtx.strokeStyle = "#D4AF37";
        safeCtx.lineWidth = 1.5;
        for (let i = 0; i < resonanceHistory.length; i++) {
          const x = startX + (i / (resonanceHistory.length - 1)) * chartW;
          const y = chartY + chartH - (resonanceHistory[i] / 100) * chartH;
          i === 0 ? safeCtx.moveTo(x, y) : safeCtx.lineTo(x, y);
        }
        safeCtx.stroke();

        safeCtx.fillStyle = "rgba(255,255,255,0.4)";
        safeCtx.font = "9px Inter, sans-serif";
        safeCtx.textAlign = "right";
        safeCtx.fillText("Resonans", w - 20, chartY - 4);
      }
    }

    // Animation loop
    function animate() {
      simulate();
      render();
      animFrameRef.current = requestAnimationFrame(animate);
    }
    animate();

    // Hover detection
    function handleMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let found: string | null = null;
      for (const node of simNodes) {
        const dx = mx - node.x;
        const dy = my - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 5) {
          found = node.id;
          break;
        }
      }
      setHoveredNode(found);
    }
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hasAccess, conversationId, matchCount, messageCount, journeySteps, resonanceHistory, hoveredNode]);

  if (!hasAccess) return null;

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
      <div className="p-4">
        <h3 className="text-sm font-medium text-white/80 mb-2">Relasjonskart</h3>
        <p className="text-xs text-white/40 mb-3">Interaktiv visualisering av deres relasjonsdynamikk</p>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-80"
        style={{ display: "block" }}
      />
      <div className="p-3 flex flex-wrap gap-2 text-xs">
        <span className="flex items-center gap-1 text-white/50">
          <span className="w-2 h-2 rounded-full" style={{ background: NODE_COLORS.user }} /> Dere
        </span>
        <span className="flex items-center gap-1 text-white/50">
          <span className="w-2 h-2 rounded-full" style={{ background: NODE_COLORS.match }} /> Match
        </span>
        <span className="flex items-center gap-1 text-white/50">
          <span className="w-2 h-2 rounded-full" style={{ background: NODE_COLORS.memory }} /> Minne
        </span>
        <span className="flex items-center gap-1 text-white/50">
          <span className="w-2 h-2 rounded-full" style={{ background: NODE_COLORS.journey }} /> Journey
        </span>
        <span className="flex items-center gap-1 text-white/50">
          <span className="w-2 h-2 rounded-full" style={{ background: NODE_COLORS.message }} /> Melding
        </span>
      </div>
    </div>
  );
}

export default SocialGraph;