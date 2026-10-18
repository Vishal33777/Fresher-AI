import { useEffect, useRef, useState } from "react";

import maleVideo from "../../assets/male-ai.mp4";
import femaleVideo from "../../assets/female-ai.mp4";

import { AnimatePresence, motion } from "motion/react";

import {
  FiArrowRight,
  FiCamera,
  FiCameraOff,
  FiClock,
  FiCode,
  FiMessageSquare,
  FiMic,
  FiMicOff,
} from "react-icons/fi";

import CodeEditor from "./CodeEditor";
import Timer from "./Timer";

import { submitAnswer } from "../../apis/interview.api";
import { useNavigate } from "react-router-dom";

function Step2interview({ interviewData, user }) {
  const navigate = useNavigate();

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [question, setQuestion] = useState(interviewData?.question);
  const [currentIndex, setCurrentIndex] = useState(
    interviewData?.currentQuestion || 0,
  );

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(
    interviewData?.question?.timer || 60,
  );

  const [timeActive, setTimeActive] = useState(true);

  // UI toggles
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  // Speech
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");
  const [introSpoken, setIntroSpoken] = useState(false);

  // Prevent timer from submitting multiple times
  const [timeSubmitted, setTimeSubmitted] = useState(false);

  // --------------------------------------------------
  // REFS
  // --------------------------------------------------

  const aiVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  // --------------------------------------------------
  // DERIVED VALUES
  // --------------------------------------------------

  const videoSource = voiceGender === "female" ? femaleVideo : maleVideo;

  const totalQuestions = interviewData?.totalQuestions || 1;

  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const showMicOn = micOn && !isAIPlaying;

  // --------------------------------------------------
  // SPEECH RECOGNITION
  // --------------------------------------------------

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("Speech recognition is not supported.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];

      if (!lastResult) return;

      const transcript = lastResult[0]?.transcript;

      if (!transcript) return;

      setAnswer((prev) => (prev.trim() ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      /*
       * Chrome may automatically stop recognition.
       * Restart it if the user still wants the microphone on
       * and AI is not speaking.
       */
      if (micOn && !isAIPlaying) {
        try {
          recognition.start();
        } catch {
          // Recognition may already be running.
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore cleanup errors.
      }

      recognitionRef.current = null;
    };
  }, []);

  // --------------------------------------------------
  // MICROPHONE
  // --------------------------------------------------

  const startMic = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.start();
    } catch {
      // Recognition might already be running.
    }
  };

  const stopMic = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
    } catch {
      // Ignore stop errors.
    }
  };

  const toggleMic = () => {
    if (micOn) {
      stopMic();
      setMicOn(false);
    } else {
      startMic();
      setMicOn(true);
    }
  };

  // --------------------------------------------------
  // CAMERA
  // --------------------------------------------------

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;

      if (userVideoRef.current) {
        userVideoRef.current.srcObject = null;
      }

      setCameraOn(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      streamRef.current = stream;

      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }

      setCameraOn(true);
    } catch (error) {
      console.error("Camera permission error:", error);

      setCameraOn(false);

      alert("Unable to access your camera. Please allow camera permission.");
    }
  };

  // --------------------------------------------------
  // CODE EDITOR
  // --------------------------------------------------

  const handleSubmitCode = (code) => {
    setAnswer((prev) => {
      const separator = prev.trim() ? "\n\n--- Code ---\n" : "--- Code ---\n";

      return `${prev}${separator}${code}`;
    });

    setCodeOpen(false);
  };

  // --------------------------------------------------
  // TIMER
  // --------------------------------------------------

  useEffect(() => {
    if (!timeActive || timeLeft <= 0 || loading) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => (previous > 0 ? previous - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeActive, timeLeft, loading]);

  // --------------------------------------------------
  // LOAD SPEECH VOICES
  // --------------------------------------------------

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis is not supported.");
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      if (!voices.length) return;

      const female = voices.find((voice) =>
        /zira|samantha|female/i.test(voice.name),
      );

      const male = voices.find((voice) => /david|mark|male/i.test(voice.name));

      if (female) {
        setSelectedVoice(female);
        setVoiceGender("female");
      } else if (male) {
        setSelectedVoice(male);
        setVoiceGender("male");
      } else {
        setSelectedVoice(voices[0]);
        setVoiceGender("female");
      }
    };

    loadVoices();

    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  // --------------------------------------------------
  // SPEAK TEXT
  // --------------------------------------------------

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window) || !selectedVoice || !text?.trim()) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(
        text.replace(/,/g, ", ... ").replace(/\./g, ". ... "),
      );

      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);

        stopMic();

        if (aiVideoRef.current) {
          aiVideoRef.current.play().catch(() => {});
        }
      };

      utterance.onend = () => {
        if (aiVideoRef.current) {
          aiVideoRef.current.pause();
        }

        setIsAIPlaying(false);

        if (micOn) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      utterance.onerror = () => {
        setIsAIPlaying(false);
        setSubtitle("");
        resolve();
      };

      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };

  // --------------------------------------------------
  // INTRO
  // --------------------------------------------------

  useEffect(() => {
    if (!selectedVoice || introSpoken || !question?.question) {
      return;
    }

    let cancelled = false;

    const runIntro = async () => {
      const userName = user?.name?.split(" ")[0] || "Candidate";

      setIntroSpoken(true);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (cancelled) return;

      await speakText(`Welcome ${userName}! Let's begin your interview.`);

      await new Promise((resolve) => setTimeout(resolve, 900));

      if (cancelled) return;

      await speakText(question.question);
    };

    runIntro();

    return () => {
      cancelled = true;
    };
  }, [selectedVoice]);

  // --------------------------------------------------
  // UPDATE QUESTION FROM INTERVIEW DATA
  // --------------------------------------------------

  useEffect(() => {
    if (!interviewData?.question) return;

    setQuestion(interviewData.question);

    setCurrentIndex(interviewData.currentQuestion || 0);

    setTimeLeft(interviewData.question.timer || 60);

    setTimeActive(true);
    setTimeSubmitted(false);
    setAnswer("");
    setFeedback(null);
  }, [interviewData]);

  // --------------------------------------------------
  // SPEAK NEW QUESTION
  // --------------------------------------------------

  useEffect(() => {
    /*
     * Don't speak the first question here.
     * The intro effect already speaks it.
     */
    if (!selectedVoice || !introSpoken || !question?.question) {
      return;
    }

    // First question is already handled by intro.
    if (currentIndex === 0) {
      return;
    }

    let cancelled = false;

    const speakQuestion = async () => {
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (cancelled) return;

      await speakText(question.question);
    };

    speakQuestion();

    return () => {
      cancelled = true;
    };
  }, [question]);

  // --------------------------------------------------
  // RESET TIMER WHEN QUESTION CHANGES
  // --------------------------------------------------

  useEffect(() => {
    if (!question) return;

    setTimeLeft(question.timer || 60);
    setTimeActive(true);
    setTimeSubmitted(false);
  }, [question]);

  // --------------------------------------------------
  // SUBMIT ANSWER
  // --------------------------------------------------

  const submit = async (isTimeUp = false) => {
    if (loading) return;

    if (!isTimeUp && !answer.trim()) {
      return;
    }

    setTimeActive(false);
    setLoading(true);

    stopMic();
    setMicOn(false);

    try {
      const finalAnswer = isTimeUp
        ? answer.trim() || "No answer provided. Time over."
        : answer.trim();

      const response = await submitAnswer({
        interviewId: interviewData.interviewId,
        answer: finalAnswer,
      });

      console.log("Submit answer response:", response);

      if (response?.completed) {
        setFeedback(response.feedback);

        await new Promise((resolve) => setTimeout(resolve, 700));

        await speakText(
          response.feedback?.feedback ||
            "Great job! Your interview is complete. Preparing your report now.",
        );

        navigate(`/interview/${interviewData.interviewId}/report`);

        return;
      }

      setFeedback(response?.feedback);

      await new Promise((resolve) => setTimeout(resolve, 700));

      await speakText(
        response?.feedback?.feedback ||
          "Noted your answer. Let's move to the next question.",
      );

      setQuestion(response.question);

      setCurrentIndex(response.currentQuestion);

      setAnswer("");
      setFeedback(null);
      setTimeLeft(response.question?.timer || 60);
      setTimeSubmitted(false);
      setTimeActive(true);
    } catch (error) {
      console.error("Submit answer error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit answer",
      );

      setTimeActive(true);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // AUTO SUBMIT WHEN TIME IS UP
  // --------------------------------------------------

  useEffect(() => {
    if (timeLeft !== 0 || !timeActive || timeSubmitted || loading) {
      return;
    }

    setTimeSubmitted(true);

    const autoSubmit = async () => {
      await speakText("Time is up. Submitting your answer now.");

      await submit(true);
    };

    autoSubmit();
  }, [timeLeft, timeActive, timeSubmitted, loading]);

  // --------------------------------------------------
  // CLEANUP
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      // Stop speech
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      // Stop microphone
      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore
      }

      // Stop camera
      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    };
  }, []);

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  if (!question) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">Loading interview...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-5">
      {/* CODE EDITOR */}
      {codeOpen && (
        <CodeEditor
          onClose={() => setCodeOpen(false)}
          onSubmitCode={handleSubmitCode}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl bg-[#0E1016] border border-white/10 rounded-2xl sm:rounded-[24px] overflow-hidden shadow-[0_0_60px_rgba(255,255,255,.03)] grid lg:grid-cols-[36%_64%]"
      >
        {/* LEFT */}
        <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/8 p-4 sm:p-5 gap-3">
          {/* AI VIDEO */}
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
            <video
              src={videoSource}
              ref={aiVideoRef}
              muted
              playsInline
              preload="auto"
              loop
              className="w-full h-full object-cover"
            />

            {isAIPlaying && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                <div className="flex gap-0.5 items-end h-3">
                  {[1, 2, 3].map((item) => (
                    <motion.div
                      key={item}
                      className="w-0.5 bg-white rounded-full"
                      animate={{
                        height: ["4px", "12px", "4px"],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: item * 0.15,
                      }}
                    />
                  ))}
                </div>

                <span className="text-[10px] text-white/80">AI Speaking</span>
              </div>
            )}
          </div>

          {/* SUBTITLE */}
          <div className="min-h-[52px] flex items-center">
            <AnimatePresence>
              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full rounded-xl bg-white/5 border border-white/8 px-3 py-2"
                >
                  <p className="text-xs text-white/65 leading-relaxed text-center">
                    {subtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* USER VIDEO */}
          <div className="relative rounded-xl overflow-hidden bg-[#17181E] border border-white/8 aspect-video flex items-center justify-center">
            {cameraOn ? (
              <>
                <video
                  ref={userVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />

                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
                  <span className="text-[10px] text-white/70">You</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>

                <span className="text-xs text-white/35">
                  {user?.name?.split(" ")[0] || "You"}
                </span>
              </div>
            )}
          </div>

          {/* CONTROLS */}
          <div className="flex flex-col items-center gap-1.5 pt-1">
            <div className="flex items-center justify-center gap-3">
              {/* MIC */}
              <motion.button
                type="button"
                onClick={toggleMic}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  showMicOn
                    ? "bg-white/10 border-white/15 text-white"
                    : "bg-red-500/20 border-red-500/30 text-red-400"
                }`}
              >
                {showMicOn ? <FiMic size={15} /> : <FiMicOff size={15} />}
              </motion.button>

              {/* CAMERA */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={toggleCamera}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  cameraOn
                    ? "bg-white/10 border-white/15 text-white"
                    : "bg-white/5 border-white/10 text-white/45 hover:text-white/70"
                }`}
              >
                {cameraOn ? <FiCamera size={15} /> : <FiCameraOff size={15} />}
              </motion.button>

              {/* CODE */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setCodeOpen(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center border bg-white/5 border-white/10 text-white/45 hover:text-white hover:border-white/20 transition-all"
              >
                <FiCode size={15} />
              </motion.button>
            </div>

            <div className="min-h-[14px] flex items-center justify-center">
              {micOn && isAIPlaying && (
                <span className="text-[10px] text-red-400/80">
                  Mic Paused - AI is speaking
                </span>
              )}
            </div>

            <span className="text-[10px] text-white/35 text-center">
              Coding question? Use{" "}
              <FiCode size={9} className="inline -mt-0.5" /> to write &amp; add
              code
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col p-4 sm:p-6">
          {/* HEADER */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white">
                AI Interview
              </h2>

              <div className="flex items-center gap-2 text-zinc-500 text-xs mt-0.5">
                <FiClock size={11} />

                <span>{question.difficulty || "Medium"}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 min-w-[110px]">
              <Timer timeLeft={timeLeft} totalTime={question.timer || 60} />
            </div>
          </div>

          {/* QUESTION */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative overflow-hidden rounded-xl bg-[#17181E] border border-white/8 p-4 sm:p-5 mb-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />

            <div className="relative flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center shrink-0">
                <FiMessageSquare size={14} />
              </div>

              <p className="text-xs text-zinc-500">
                Question {currentIndex + 1}
              </p>
            </div>

            <p className="relative text-white text-sm sm:text-base leading-7">
              {question.question}
            </p>
          </motion.div>

          {/* PROGRESS */}
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-white/35 mb-1">
              <span>Progress</span>

              <span>
                {currentIndex + 1}/{totalQuestions}
              </span>
            </div>

            <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* ANSWER */}
          <div className="flex-1 flex flex-col min-h-0">
            <label className="text-xs font-medium text-zinc-400 mb-1.5">
              Your Answer
            </label>

            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              rows={5}
              onKeyDown={(event) => {
                if (event.ctrlKey && event.key === "Enter") {
                  event.preventDefault();
                  submit();
                }
              }}
              placeholder="Write your answer here... or speak if mic is on"
              className="flex-1 w-full rounded-xl bg-[#17181E] border border-white/8 p-4 text-sm text-white outline-none resize-none focus:border-white/25 transition placeholder-white/20"
            />
          </div>

          {/* FEEDBACK */}
          <div className="mt-3">
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 max-h-40 overflow-y-auto"
                >
                  <p className="text-xs uppercase tracking-widest text-green-400 mb-2">
                    AI Feedback
                  </p>

                  <p className="text-sm text-zinc-300 leading-6">
                    {feedback.feedback}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SUBMIT */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/8">
            <span className="text-xs text-zinc-600 hidden sm:block">
              Press{" "}
              <span className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-white text-[10px]">
                Ctrl+Enter
              </span>{" "}
              to Submit
            </span>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => submit(false)}
              disabled={loading || !answer.trim()}
              className="ml-auto h-10 min-w-[150px] justify-center px-5 rounded-xl bg-white text-black text-sm font-semibold flex items-center gap-2 disabled:opacity-40 transition"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Answer
                  <FiArrowRight size={15} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Step2interview;
