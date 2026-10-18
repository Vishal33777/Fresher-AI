import React from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

function Input({ label, value = "", onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-black/70 uppercase tracking-wider">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        className="bg-white border-2 border-black/25 text-[#0A0A0A] text-xs rounded-lg px-2.5 py-2 outline-none focus:border-black/60 transition-colors placeholder-black/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      />
    </div>
  );
}

function TextArea({ label, value = "", onChange, placeholder, rows = 3 }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-black/70 uppercase tracking-wider">
        {label}
      </label>

      <textarea
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        rows={rows}
        className="bg-white border-2 border-black/25 text-[#0A0A0A] text-xs rounded-lg px-2.5 py-2 outline-none focus:border-black/60 transition-colors placeholder-black/30 resize-none shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      />
    </div>
  );
}

function EntryCard({ children, onRemove }) {
  return (
    <div className="relative overflow-hidden bg-[#F8F9FA] border-2 border-black/15 rounded-xl p-3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2.5 right-2.5 z-10 text-black/35 hover:text-red-500 transition-colors"
      >
        <FiTrash2 size={13} />
      </button>

      <div className="relative flex flex-col gap-2.5 pr-6">{children}</div>
    </div>
  );
}

function ResumeForm({ step, data, setData }) {
  // Safe defaults
  const experience = data?.experience || [];
  const projects = data?.projects || [];
  const education = data?.education || [];

  // =========================
  // STEP 1 - PERSONAL DETAILS
  // =========================
  if (step === 1) {
    return (
      <div className="flex flex-col gap-3">
        <Input
          label="Full Name"
          placeholder="Vishal"
          value={data?.name || ""}
          onChange={(value) =>
            setData((prev) => ({
              ...prev,
              name: value,
            }))
          }
        />

        <Input
          label="Email"
          placeholder="vishal@email.com"
          type="email"
          value={data?.email || ""}
          onChange={(value) =>
            setData((prev) => ({
              ...prev,
              email: value,
            }))
          }
        />

        <Input
          label="Phone"
          placeholder="+91 1234567890"
          type="tel"
          value={data?.phone || ""}
          onChange={(value) =>
            setData((prev) => ({
              ...prev,
              phone: value,
            }))
          }
        />

        <Input
          label="Location"
          placeholder="Noida"
          value={data?.location || ""}
          onChange={(value) =>
            setData((prev) => ({
              ...prev,
              location: value,
            }))
          }
        />

        <Input
          label="LinkedIn URL"
          placeholder="linkedin.com/in/vishal"
          value={data?.linkedin || ""}
          onChange={(value) =>
            setData((prev) => ({
              ...prev,
              linkedin: value,
            }))
          }
        />

        <Input
          label="GitHub URL"
          placeholder="github.com/vishal"
          value={data?.github || ""}
          onChange={(value) =>
            setData((prev) => ({
              ...prev,
              github: value,
            }))
          }
        />
      </div>
    );
  }

  // =========================
  // STEP 2 - SUMMARY
  // =========================
  if (step === 2) {
    return (
      <div className="flex flex-col gap-3">
        <TextArea
          label="Professional Summary"
          placeholder="Backend Developer with 2+ years of experience building scalable Node.js and MongoDB applications..."
          rows={5}
          value={data?.summary || ""}
          onChange={(value) =>
            setData((prev) => ({
              ...prev,
              summary: value,
            }))
          }
        />

        <p className="text-[10px] text-black/40">
          Leave empty to skip this section.
        </p>
      </div>
    );
  }

  // =========================
  // STEP 3 - SKILLS
  // =========================
  if (step === 3) {
    return (
      <div className="flex flex-col gap-3">
        <TextArea
          label="Skills (comma separated)"
          placeholder="JavaScript, TypeScript, React, Node.js, Express, MongoDB, Redis, Docker, AWS, Git"
          rows={4}
          value={data?.skills || ""}
          onChange={(value) =>
            setData((prev) => ({
              ...prev,
              skills: value,
            }))
          }
        />

        <p className="text-[10px] text-black/40">
          Separate each skill with a comma.
        </p>
      </div>
    );
  }

  // =========================
  // STEP 4 - EXPERIENCE
  // =========================
  if (step === 4) {
    const addExp = () => {
      setData((prev) => ({
        ...prev,
        experience: [
          ...(prev.experience || []),
          {
            company: "",
            role: "",
            duration: "",
            description: "",
          },
        ],
      }));
    };

    const removeExp = (index) => {
      setData((prev) => ({
        ...prev,
        experience: (prev.experience || []).filter((_, i) => i !== index),
      }));
    };

    const updateExp = (index, field, value) => {
      setData((prev) => ({
        ...prev,
        experience: (prev.experience || []).map((exp, i) =>
          i === index
            ? {
                ...exp,
                [field]: value,
              }
            : exp,
        ),
      }));
    };

    return (
      <div className="flex flex-col gap-3">
        {experience.length === 0 && (
          <p className="text-xs text-black/40 text-center py-3">
            No experience added yet. Click below to add.
          </p>
        )}

        {experience.map((exp, index) => (
          <EntryCard key={index} onRemove={() => removeExp(index)}>
            <Input
              label="Company"
              placeholder="ABC Technologies"
              value={exp?.company || ""}
              onChange={(value) => updateExp(index, "company", value)}
            />

            <Input
              label="Role"
              placeholder="Backend Developer"
              value={exp?.role || ""}
              onChange={(value) => updateExp(index, "role", value)}
            />

            <Input
              label="Duration"
              placeholder="Jan 2023 - Dec 2024"
              value={exp?.duration || ""}
              onChange={(value) => updateExp(index, "duration", value)}
            />

            <TextArea
              label="Description"
              placeholder={"• Built REST APIs\n• Improved performance by 40%"}
              value={exp?.description || ""}
              onChange={(value) => updateExp(index, "description", value)}
            />
          </EntryCard>
        ))}

        <button
          type="button"
          onClick={addExp}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-dashed border-black/20 rounded-xl text-xs text-black/45 hover:border-black/40 hover:text-[#0A0A0A] transition-all"
        >
          <FiPlus size={13} />
          Add Experience
        </button>
      </div>
    );
  }

  // =========================
  // STEP 5 - PROJECTS
  // =========================
  if (step === 5) {
    const addPro = () => {
      setData((prev) => ({
        ...prev,
        projects: [
          ...(prev.projects || []),
          {
            name: "",
            techStack: "",
            github: "",
            description: "",
          },
        ],
      }));
    };

    const removePro = (index) => {
      setData((prev) => ({
        ...prev,
        projects: (prev.projects || []).filter((_, i) => i !== index),
      }));
    };

    const updatePro = (index, field, value) => {
      setData((prev) => ({
        ...prev,
        projects: (prev.projects || []).map((project, i) =>
          i === index
            ? {
                ...project,
                [field]: value,
              }
            : project,
        ),
      }));
    };

    return (
      <div className="flex flex-col gap-3">
        {projects.length === 0 && (
          <p className="text-xs text-black/40 text-center py-3">
            No project added yet. Click below to add.
          </p>
        )}

        {projects.map((project, index) => (
          <EntryCard key={index} onRemove={() => removePro(index)}>
            <Input
              label="Project Name"
              placeholder="InterviewIQ"
              value={project?.name || ""}
              onChange={(value) => updatePro(index, "name", value)}
            />

            <Input
              label="Tech Stack"
              placeholder="React, Node.js, MongoDB"
              value={project?.techStack || ""}
              onChange={(value) => updatePro(index, "techStack", value)}
            />

            <Input
              label="GitHub Link"
              placeholder="github.com/vishal/interviewiq"
              value={project?.github || ""}
              onChange={(value) => updatePro(index, "github", value)}
            />

            <TextArea
              label="Description"
              placeholder="AI-powered interview preparation platform with mock interviews and resume builder."
              value={project?.description || ""}
              onChange={(value) => updatePro(index, "description", value)}
            />
          </EntryCard>
        ))}

        <button
          type="button"
          onClick={addPro}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-dashed border-black/20 rounded-xl text-xs text-black/45 hover:border-black/40 hover:text-[#0A0A0A] transition-all"
        >
          <FiPlus size={13} />
          Add Project
        </button>
      </div>
    );
  }

  // =========================
  // STEP 6 - EDUCATION
  // =========================
  if (step === 6) {
    const addEdu = () => {
      setData((prev) => ({
        ...prev,
        education: [
          ...(prev.education || []),
          {
            college: "",
            degree: "",
            branch: "",
            cgpa: "",
            year: "",
          },
        ],
      }));
    };

    const removeEdu = (index) => {
      setData((prev) => ({
        ...prev,
        education: (prev.education || []).filter((_, i) => i !== index),
      }));
    };

    const updateEdu = (index, field, value) => {
      setData((prev) => ({
        ...prev,
        education: (prev.education || []).map((education, i) =>
          i === index
            ? {
                ...education,
                [field]: value,
              }
            : education,
        ),
      }));
    };

    return (
      <div className="flex flex-col gap-3">
        {education.length === 0 && (
          <p className="text-xs text-black/40 text-center py-3">
            No education added yet. Click below to add.
          </p>
        )}

        {education.map((edu, index) => (
          <EntryCard key={index} onRemove={() => removeEdu(index)}>
            <Input
              label="College / University"
              placeholder="GL Bajaj"
              value={edu?.college || ""}
              onChange={(value) => updateEdu(index, "college", value)}
            />

            <Input
              label="Degree"
              placeholder="B.Tech"
              value={edu?.degree || ""}
              onChange={(value) => updateEdu(index, "degree", value)}
            />

            <Input
              label="Branch"
              placeholder="CSE"
              value={edu?.branch || ""}
              onChange={(value) => updateEdu(index, "branch", value)}
            />

            <Input
              label="CGPA"
              placeholder="8.6"
              value={edu?.cgpa || ""}
              onChange={(value) => updateEdu(index, "cgpa", value)}
            />

            <Input
              label="Year"
              placeholder="2022 - 2026"
              value={edu?.year || ""}
              onChange={(value) => updateEdu(index, "year", value)}
            />
          </EntryCard>
        ))}

        <button
          type="button"
          onClick={addEdu}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-dashed border-black/20 rounded-xl text-xs text-black/45 hover:border-black/40 hover:text-[#0A0A0A] transition-all"
        >
          <FiPlus size={13} />
          Add Education
        </button>
      </div>
    );
  }

  return null;
}

export default ResumeForm;
