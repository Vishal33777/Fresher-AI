import React from "react";
import { motion } from "motion/react";
import { FiCheckCircle, FiClock, FiMap, FiTarget, FiX } from "react-icons/fi";
import ModuleCard from "./ModuleCard";

function RoadmapResult({ roadmap, onClear }) {
  const modules = roadmap?.modules || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Roadmap Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 mb-5 shadow-[0_8px_32px_rgba(0,0,0,0.22)]"
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />

        <div className="relative flex items-start justify-between mb-4">
          {/* Roadmap Information */}
          <div className="min-w-0">
            <p className="text-xs text-white/35 tracking-widest uppercase mb-1">
              Your Roadmap
            </p>

            <h2 className="text-lg font-bold text-white truncate">
              {roadmap?.title || "Learning Roadmap"}
            </h2>

            <p className="text-sm text-white/45 mt-0.5">
              Target:{" "}
              <span className="text-violet-400 font-medium">
                {roadmap?.targetPackage || "Not specified"}
              </span>
            </p>
          </div>

          {/* Clear Button */}
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear roadmap"
            className="text-white/30 hover:text-white/70 transition-colors mt-1 ml-3 shrink-0"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Roadmap Stats */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            {
              Icon: FiTarget,
              label: "Difficulty",
              value: roadmap?.level || "Not specified",
            },
            {
              Icon: FiClock,
              label: "Duration",
              value: roadmap?.duration || "Not specified",
            },
            {
              Icon: FiCheckCircle,
              label: "Modules",
              value: `${modules.length} topics`,
            },
          ].map(({ Icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl p-3 bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={11} className="text-white/30" />

                <span className="text-xs text-white/30">{label}</span>
              </div>

              <p className="text-sm font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Learning Modules */}
      <div className="mb-4">
        <p className="text-xs text-black/40 font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
          <FiMap size={12} />
          Learning Modules
        </p>

        {modules.length > 0 ? (
          <div className="flex flex-col gap-2">
            {modules.map((module, index) => (
              <ModuleCard
                key={`${module.title}-${index}`}
                mod={module}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/5 p-4 text-sm text-black/40">
            No learning modules available.
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default RoadmapResult;
