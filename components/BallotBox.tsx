"use client";

import { motion } from "framer-motion";

/**
 * Stilisierte Wahlurne als SVG.
 * Wird hinter dem Wahlzettel platziert; der Zettel "gleitet" in den Schlitz.
 */
export function BallotBox({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 20 }}
      transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
      className="mx-auto w-full max-w-md"
      aria-hidden
    >
      <svg viewBox="0 0 360 220" className="w-full h-auto drop-shadow-md">
        {/* Schatten unter Urne */}
        <ellipse cx="180" cy="208" rx="130" ry="6" fill="rgba(20,25,35,0.12)" />

        {/* Hauptkörper */}
        <defs>
          <linearGradient id="boxBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBF8F1" />
            <stop offset="100%" stopColor="#E9E2CD" />
          </linearGradient>
          <linearGradient id="boxLid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F2530" />
            <stop offset="100%" stopColor="#0F141C" />
          </linearGradient>
        </defs>

        <rect
          x="60"
          y="80"
          width="240"
          height="120"
          rx="6"
          fill="url(#boxBody)"
          stroke="#D5D3CB"
          strokeWidth="1.2"
        />

        {/* Vorderseite mit Beschriftung */}
        <rect x="80" y="120" width="200" height="60" rx="2" fill="rgba(0,0,0,0.02)" />
        <text
          x="180"
          y="158"
          textAnchor="middle"
          fontFamily="ui-serif, Georgia, serif"
          fontSize="13"
          letterSpacing="3"
          fill="#3A4150"
          opacity="0.7"
        >
          MODELLURNE
        </text>

        {/* Deckel */}
        <rect
          x="50"
          y="68"
          width="260"
          height="22"
          rx="4"
          fill="url(#boxLid)"
        />

        {/* Schlitz */}
        <rect x="150" y="76" width="60" height="6" rx="3" fill="#000" opacity="0.55" />
      </svg>
    </motion.div>
  );
}
