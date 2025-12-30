import React from "react";
import { Sparkles, Star, Hexagon, Circle } from "lucide-react";

/**
 * Template preview thumbnails
 * Shows a visual representation of each template
 */
export default function TemplatePreviews({ templateId, color = "#0EA5E9" }) {
  const previews = {
    luxury: (
      <div
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ backgroundColor: "#1F2937" }}
      >
        <div
          className="h-8"
          style={{
            background: `linear-gradient(135deg, ${color}33 0%, ${color}66 100%)`,
          }}
        />
        <div className="flex flex-col items-center -mt-4 px-3">
          <div
            className="w-12 h-12 rounded-full border-2"
            style={{ borderColor: color, backgroundColor: "#1F2937" }}
          />
          <div className="w-16 h-2 bg-white/20 rounded mt-2" />
          <div className="w-12 h-1.5 bg-white/10 rounded mt-1" />

          <div className="w-full space-y-1.5 mt-3">
            <div
              className="w-full h-6 rounded border"
              style={{
                borderColor: `${color}55`,
                backgroundColor: `${color}11`,
              }}
            />
            <div
              className="w-full h-6 rounded border"
              style={{
                borderColor: `${color}55`,
                backgroundColor: `${color}11`,
              }}
            />
          </div>

          <div
            className="w-full h-6 rounded mt-2"
            style={{
              background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
            }}
          />
        </div>
      </div>
    ),

    pastel: (
      <div
        className="w-full h-full rounded-lg overflow-hidden relative"
        style={{
          background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
        }}
      >
        <Sparkles
          className="absolute top-1 right-1 w-3 h-3 opacity-30"
          style={{ color }}
        />
        <Star
          className="absolute bottom-1 left-1 w-2.5 h-2.5 opacity-20"
          style={{ color }}
        />

        <div className="flex flex-col items-center pt-4 px-3">
          <div
            className="w-12 h-12 rounded-full border-2 bg-white"
            style={{ borderColor: `${color}66` }}
          />
          <div
            className="w-16 h-2 rounded mt-2"
            style={{ backgroundColor: color }}
          />
          <div className="w-12 h-1.5 bg-gray-400 rounded mt-1" />

          <div className="w-full bg-white/60 backdrop-blur-sm rounded-lg p-2 mt-3">
            <div className="w-full h-1 bg-gray-300 rounded" />
            <div className="w-3/4 h-1 bg-gray-300 rounded mt-1" />
          </div>

          <div className="flex gap-1 mt-2">
            <div className="w-6 h-6 bg-white rounded" />
            <div className="w-6 h-6 bg-white rounded" />
            <div className="w-6 h-6 bg-white rounded" />
          </div>
        </div>
      </div>
    ),

    modern: (
      <div
        className="w-full h-full rounded-lg overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${color}DD 0%, ${color} 100%)`,
        }}
      >
        <div className="flex flex-col items-center pt-2 px-3">
          <div
            className="w-10 h-10 rounded-full bg-white border-2"
            style={{ borderColor: color }}
          />
          <div className="w-14 h-1.5 bg-white rounded mt-2" />

          <div className="w-full space-y-1.5 mt-3">
            <div className="w-full h-7 bg-white/90 rounded-lg" />
            <div className="w-full h-7 bg-white/90 rounded-lg" />
            <div className="w-full h-7 bg-white/90 rounded-lg" />
          </div>

          <div className="flex gap-1 mt-2">
            <div className="w-5 h-5 bg-white/80 rounded-lg" />
            <div className="w-5 h-5 bg-white/80 rounded-lg" />
            <div className="w-5 h-5 bg-white/80 rounded-lg" />
          </div>
        </div>
      </div>
    ),

    cosmic: (
      <div
        className="w-full h-full rounded-lg overflow-hidden relative"
        style={{
          background: `linear-gradient(180deg, ${color}EE 0%, ${color} 100%)`,
        }}
      >
        {/* Starfield */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}

        <div className="flex flex-col items-center pt-3 px-3 relative z-10">
          <div className="w-14 h-1.5 bg-white rounded mb-2" />

          {/* Orbital setup */}
          <div className="relative w-16 h-16 my-2">
            <div className="absolute inset-0 rounded-full border border-white/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm" />
            </div>
            {/* Orbital icons */}
            <Circle className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white/60" />
            <Circle className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 text-white/60" />
          </div>

          {/* Hexagons */}
          <div className="grid grid-cols-2 gap-1 w-full mt-2">
            <Hexagon className="w-full h-6 text-white/30" />
            <Hexagon className="w-full h-6 text-white/30" />
          </div>
        </div>
      </div>
    ),

    minimal: (
      <div className="w-full h-full bg-white rounded-lg overflow-hidden p-3">
        <div className="flex flex-col items-center">
          <div
            className="w-12 h-12 rounded-full border-2"
            style={{ borderColor: color }}
          />
          <div className="w-16 h-2 bg-gray-900 rounded mt-2" />
          <div className="w-8 h-0.5 mt-2" style={{ backgroundColor: color }} />

          <div className="w-full space-y-0 mt-4">
            <div className="w-full h-6 border-t border-gray-200 flex items-center justify-between px-2">
              <div className="w-8 h-1 bg-gray-300 rounded" />
              <div
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="w-full h-6 border-t border-gray-200 flex items-center justify-between px-2">
              <div className="w-8 h-1 bg-gray-300 rounded" />
              <div
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="w-full h-6 border-t border-gray-200 flex items-center justify-between px-2">
              <div className="w-8 h-1 bg-gray-300 rounded" />
              <div
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="w-full border-t border-gray-200" />
          </div>

          <div
            className="w-full h-6 border mt-3"
            style={{ borderColor: color }}
          />
        </div>
      </div>
    ),

    glass: (
      <div
        className="w-full h-full rounded-lg overflow-hidden relative"
        style={{
          background: `linear-gradient(135deg, ${color}33 0%, ${color}55 100%)`,
        }}
      >
        {/* Floating blobs */}
        <div
          className="absolute top-2 left-2 w-16 h-16 rounded-full blur-xl opacity-30"
          style={{ backgroundColor: color }}
        />
        <div
          className="absolute bottom-2 right-2 w-20 h-20 rounded-full blur-xl opacity-20"
          style={{ backgroundColor: color }}
        />

        <div className="flex flex-col items-center pt-3 px-3 relative z-10">
          <div className="w-11 h-11 rounded-full bg-white/40 backdrop-blur-md border border-white/50" />
          <div className="w-14 h-1.5 bg-white/50 backdrop-blur-sm rounded mt-2" />

          <div className="w-full space-y-1.5 mt-3">
            <div className="w-full h-6 bg-white/30 backdrop-blur-md rounded-lg border border-white/40" />
            <div className="w-full h-6 bg-white/30 backdrop-blur-md rounded-lg border border-white/40" />
            <div className="w-full h-6 bg-white/30 backdrop-blur-md rounded-lg border border-white/40" />
          </div>

          <div className="flex gap-1 mt-2">
            <div className="w-5 h-5 bg-white/40 backdrop-blur-md rounded-lg border border-white/50" />
            <div className="w-5 h-5 bg-white/40 backdrop-blur-md rounded-lg border border-white/50" />
            <div className="w-5 h-5 bg-white/40 backdrop-blur-md rounded-lg border border-white/50" />
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full h-full">
      {previews[templateId] || previews.modern}
    </div>
  );
}

// Export individual preview components if needed
export function LuxuryPreview({ color }) {
  return <TemplatePreviews templateId="luxury" color={color} />;
}

export function PastelPreview({ color }) {
  return <TemplatePreviews templateId="pastel" color={color} />;
}

export function ModernPreview({ color }) {
  return <TemplatePreviews templateId="modern" color={color} />;
}

export function CosmicPreview({ color }) {
  return <TemplatePreviews templateId="cosmic" color={color} />;
}

export function MinimalPreview({ color }) {
  return <TemplatePreviews templateId="minimal" color={color} />;
}

export function GlassPreview({ color }) {
  return <TemplatePreviews templateId="glass" color={color} />;
}
