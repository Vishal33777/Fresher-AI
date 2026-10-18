import React from "react";

function ATSTemplate({ data = {} }) {
  const {
    name = "",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    github = "",
    summary = "",
    skills = "",
    experience = [],
    projects = [],
    education = [],
  } = data;

  // Convert comma-separated skills into an array
  const skillsList = Array.isArray(skills)
    ? skills.filter(Boolean)
    : skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

  // Divide skills into two columns
  const halfList = Math.ceil(skillsList.length / 2);

  const skillsCol1 = skillsList.slice(0, halfList);
  const skillsCol2 = skillsList.slice(halfList);

  // Render multiline descriptions as bullet points
  const renderDes = (text) => {
    if (!text) {
      return null;
    }

    const lines = Array.isArray(text)
      ? text
      : text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

    return (
      <ul className="mt-1 ml-4 list-disc p-0">
        {lines.map((line, index) => (
          <li
            key={index}
            className="mb-[1px] text-[11px] leading-[1.6] text-black"
          >
            {String(line).replace(/^[-•]\s*/, "")}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div
      className="box-border w-[210mm] min-h-[297mm] bg-white px-[10mm] py-[15mm] text-black"
      style={{
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* Header */}
      <div className="mb-[10px] border-b-2 border-black pb-[10px] text-center">
        <h2 className="m-0 mb-[7px] text-[28px] font-bold uppercase tracking-[0.08em]">
          {name || "Your Name"}
        </h2>

        <div className="flex flex-wrap justify-center text-[10.5px] text-black">
          {[
            email,
            phone,
            location,
            linkedin
              ? linkedin.startsWith("http")
                ? linkedin
                : `linkedin.com/in/${linkedin}`
              : null,
            github
              ? github.startsWith("http")
                ? github
                : `github.com/${github}`
              : null,
          ]
            .filter(Boolean)
            .map((value, index, array) => (
              <span key={index} className="whitespace-nowrap">
                {value}

                {index < array.length - 1 && (
                  <span className="mx-[7px] text-black">|</span>
                )}
              </span>
            ))}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-[13px]">
          <h2 className="mt-0 mb-[9px] border-b-[1.5px] border-black pb-[3px] text-[10.5px] font-bold uppercase tracking-[0.14em]">
            Professional Summary
          </h2>

          <p className="m-0 text-[11px] leading-[1.65]">{summary}</p>
        </section>
      )}

      {/* Technical Skills */}
      {skillsList.length > 0 && (
        <section className="mb-[13px]">
          <h2 className="mt-0 mb-[9px] border-b-[1.5px] border-black pb-[3px] text-[10.5px] font-bold uppercase tracking-[0.14em]">
            Technical Skills
          </h2>

          <div className="grid grid-cols-2 gap-x-[20px] gap-y-[2px]">
            <ul className="m-0 list-disc pl-4">
              {skillsCol1.map((skill, index) => (
                <li
                  key={index}
                  className="text-[11px] leading-[1.7] text-black capitalize"
                >
                  {skill}
                </li>
              ))}
            </ul>

            <ul className="m-0 list-disc pl-4">
              {skillsCol2.map((skill, index) => (
                <li
                  key={index}
                  className="text-[11px] leading-[1.7] text-black capitalize"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-[13px]">
          <h2 className="mt-0 mb-[9px] border-b-[1.5px] border-black pb-[3px] text-[10.5px] font-bold uppercase tracking-[0.14em]">
            Work Experience
          </h2>

          {experience.map((exp, index) => (
            <div
              key={index}
              className="mb-[11px] break-inside-avoid print:break-inside-avoid"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] font-bold">{exp?.role || ""}</span>

                {exp?.duration && (
                  <span className="ml-2 whitespace-nowrap text-[10.5px]">
                    {exp.duration}
                  </span>
                )}
              </div>

              {exp?.company && (
                <div className="mb-[2px] text-[11px] italic">{exp.company}</div>
              )}

              {renderDes(exp?.description)}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-[13px]">
          <h2 className="mt-0 mb-[9px] border-b-[1.5px] border-black pb-[3px] text-[10.5px] font-bold uppercase tracking-[0.14em]">
            Projects
          </h2>

          {projects.map((project, index) => (
            <div
              key={index}
              className="mb-[11px] break-inside-avoid print:break-inside-avoid"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] font-bold">
                  {project?.name || ""}
                </span>

                {project?.github && (
                  <span className="ml-2 whitespace-nowrap text-[10.5px]">
                    {project.github}
                  </span>
                )}
              </div>

              {project?.techStack && (
                <div className="mb-[2px] text-[11px] italic">
                  <span className="font-bold">Tech Stack:</span>{" "}
                  {project.techStack}
                </div>
              )}

              {renderDes(project?.description)}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-[13px]">
          <h2 className="mt-0 mb-[9px] border-b-[1.5px] border-black pb-[3px] text-[10.5px] font-bold uppercase tracking-[0.14em]">
            Education
          </h2>

          {education.map((edu, index) => (
            <div
              key={index}
              className="mb-[11px] break-inside-avoid print:break-inside-avoid"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] font-bold">
                  {edu?.degree || ""}

                  {edu?.branch ? ` in ${edu.branch}` : ""}
                </span>

                {edu?.year && (
                  <span className="ml-2 whitespace-nowrap text-[10.5px]">
                    {edu.year}
                  </span>
                )}
              </div>

              {edu?.college && (
                <div className="mb-[2px] text-[11px] italic">
                  {edu.college}

                  {edu?.cgpa && (
                    <span className="ml-[6px]">
                      | CGPA: <strong>{edu.cgpa}</strong>
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default ATSTemplate;
