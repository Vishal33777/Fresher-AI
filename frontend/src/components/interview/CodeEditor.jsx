import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiTerminal, FiX } from "react-icons/fi";
import Editor from "@monaco-editor/react";

const LANG_OPTIONS = ["javascript", "python", "java", "cpp"];

const DEFAULT_CODE = {
  javascript: `// Write your solution here
function solution() {
  // Your code
}`,
  python: `# Write your solution here
def solution():
    pass`,
  java: `// Write your solution here
public class Solution {
    public static void main(String[] args) {
        // Your code
    }
}`,
  cpp: `// Write your solution here
#include <iostream>
using namespace std;

int main() {
    // Your code
    return 0;
}`,
};

function CodeEditor({ onClose, onSubmitCode }) {
  const [lang, setLang] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    setCode(DEFAULT_CODE[newLang]);
  };

  const handleSubmit = () => {
    if (typeof onSubmitCode === "function") {
      onSubmitCode(code);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="code-editor-modal"
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Background overlay */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Editor window */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Code Editor"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 m-3 flex h-[calc(100%-2rem)] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0E1016] shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:m-6 md:m-8"
        >
          {/* Header */}
          <div className="relative flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="flex shrink-0 items-center gap-3">
              <FiTerminal className="text-white/50" size={15} />
              <span className="text-sm font-semibold text-white">
                Code Editor
              </span>
            </div>

            {/* Language buttons */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {LANG_OPTIONS.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => handleLanguageChange(language)}
                  className={`rounded-lg px-2.5 py-1 text-xs capitalize transition-all ${
                    lang === language
                      ? "bg-white font-semibold text-[#0A0A0A]"
                      : "text-white/40 hover:bg-white/10 hover:text-white/70"
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close code editor"
              className="shrink-0 text-white/35 transition-colors hover:text-white"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Monaco editor */}
          <div className="relative min-h-0 flex-1">
            <Editor
              height="100%"
              language={lang}
              value={code}
              onChange={(value) => setCode(value ?? "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                padding: { top: 12 },
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
                renderLineHighlight: "line",
                cursorBlinking: "smooth",
                automaticLayout: true,
              }}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end border-t border-white/10 px-4 py-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#0A0A0A] transition-all hover:bg-white/90"
            >
              Add To Answer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CodeEditor;
