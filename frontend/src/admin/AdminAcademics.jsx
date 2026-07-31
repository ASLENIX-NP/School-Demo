import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Eye,
  GraduationCap,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  Academics,
  defaultAcademicsContent,
  mergeAcademicsContent,
} from "../app/components/Academics";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const cardColors = [
  "#4B2E83",
  "#168A3A",
  "#D71920",
  "#38BDF8",
  "#F97316",
  "#FACC15",
  "#14B8A6",
  "#8B5CF6",
];

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function cleanText(value) {
  return String(value ?? "").trim();
}

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");

  if (!token) return null;

  return {
    Authorization: `Bearer ${token}`,
  };
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  textarea = false,
  type = "text",
  rows = 4,
}) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(75,46,131,0.16)",
            color: colors.dark,
          }}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
          style={{
            background: type === "color" ? "#FFFFFF" : "rgba(255,255,255,0.92)",
            border: "1px solid rgba(75,46,131,0.16)",
            color: colors.dark,
            minHeight: type === "color" ? "48px" : "auto",
          }}
        />
      )}
    </div>
  );
}

function getDeleteName(target) {
  if (!target) return "this item";

  if (target.type === "program") return "this academic program and its curriculum";
  if (target.type === "feature") return "this academic feature";
  if (target.type === "stat") return "this statistic";
  if (target.type === "timeline") return "this exam term";

  return "this item";
}

function sanitizeGrades(grades = []) {
  return grades.map((grade) => ({
    grade: cleanText(grade?.grade),
    books: Array.isArray(grade?.books)
      ? grade.books.map((book) => ({
          subject: cleanText(book?.subject),
          publication: cleanText(book?.publication),
        }))
      : [],
  }));
}

function validateRequiredFields(fields) {
  const missing = fields.find(({ value }) => !cleanText(value));
  return missing ? `Please write ${missing.label} before saving.` : "";
}

function validateCurriculumGrades(grades = []) {
  if (!Array.isArray(grades) || grades.length === 0) {
    return "Please add at least one curriculum grade before saving.";
  }

  for (const [gradeIndex, grade] of grades.entries()) {
    if (!cleanText(grade?.grade)) {
      return `Please write the name for curriculum grade ${gradeIndex + 1}.`;
    }

    if (!Array.isArray(grade?.books) || grade.books.length === 0) {
      return `Please add at least one subject to ${cleanText(grade?.grade) || `grade ${gradeIndex + 1}`}.`;
    }

    for (const [bookIndex, book] of grade.books.entries()) {
      if (!cleanText(book?.subject)) {
        return `Please write subject ${bookIndex + 1} for ${cleanText(grade?.grade)}.`;
      }

      if (!cleanText(book?.publication)) {
        return `Please write the publication for ${cleanText(book?.subject)}.`;
      }
    }
  }

  return "";
}

function validateProgramModal(modalForm, form, editingTarget) {
  const error = validateRequiredFields([
    { label: "the program level", value: modalForm.level },
    { label: "the program span", value: modalForm.span },
    { label: "the program highlight", value: modalForm.highlight },
    { label: "the accent color", value: modalForm.badgeColor },
  ]);

  if (error) return error;

  const classes = cleanText(modalForm.classesText)
    .split("\n")
    .map((item) => cleanText(item))
    .filter(Boolean);

  if (classes.length === 0) {
    return "Please add at least one course or subject before saving.";
  }

  const duplicateLevel = (form.programs || []).some(
    (program, index) =>
      index !== editingTarget.index &&
      cleanText(program?.level).toLowerCase() ===
        cleanText(modalForm.level).toLowerCase()
  );

  if (duplicateLevel) {
    return "Another academic program already uses this program level.";
  }

  return validateCurriculumGrades(modalForm.curriculumGrades || []);
}

function validateAcademicsContent(content = {}) {
  const heroError = validateRequiredFields([
    { label: "the hero badge", value: content.heroBadge },
    { label: "the hero title", value: content.heroTitle },
    { label: "the highlighted hero word", value: content.heroHighlight },
    { label: "the hero description", value: content.heroDescription },
  ]);

  if (heroError) return heroError;

  if (
    !cleanText(content.heroTitle).includes(cleanText(content.heroHighlight))
  ) {
    return "The highlighted hero word must be part of the hero title.";
  }

  const programLevels = new Set();

  for (const [index, program] of (content.programs || []).entries()) {
    const programError = validateRequiredFields([
      { label: `program ${index + 1} level`, value: program?.level },
      { label: `program ${index + 1} span`, value: program?.span },
      { label: `program ${index + 1} highlight`, value: program?.highlight },
      { label: `program ${index + 1} accent color`, value: program?.badgeColor },
    ]);

    if (programError) return programError;

    const levelKey = cleanText(program.level).toLowerCase();

    if (programLevels.has(levelKey)) {
      return `The program level "${cleanText(program.level)}" is duplicated.`;
    }

    programLevels.add(levelKey);

    const classes = Array.isArray(program.classes)
      ? program.classes.map((item) => cleanText(item)).filter(Boolean)
      : [];

    if (classes.length === 0) {
      return `Please add at least one course or subject to ${cleanText(program.level)}.`;
    }

    const curriculumError = validateCurriculumGrades(
      content.curriculum?.[program.level] || []
    );

    if (curriculumError) {
      return `${cleanText(program.level)}: ${curriculumError}`;
    }
  }

  const featuresHeaderError = validateRequiredFields([
    { label: "the academic strengths title", value: content.featuresTitle },
    {
      label: "the academic strengths description",
      value: content.featuresDescription,
    },
  ]);

  if (featuresHeaderError) return featuresHeaderError;

  for (const [index, feature] of (content.features || []).entries()) {
    const featureError = validateRequiredFields([
      { label: `feature ${index + 1} title`, value: feature?.title },
      { label: `feature ${index + 1} description`, value: feature?.desc },
      { label: `feature ${index + 1} icon`, value: feature?.emoji },
      { label: `feature ${index + 1} accent color`, value: feature?.color },
    ]);

    if (featureError) return featureError;
  }

  for (const [index, stat] of (content.stats || []).entries()) {
    const statError = validateRequiredFields([
      { label: `statistic ${index + 1} value`, value: stat?.value },
      { label: `statistic ${index + 1} label`, value: stat?.label },
      { label: `statistic ${index + 1} accent color`, value: stat?.color },
    ]);

    if (statError) return statError;
  }

  const examHeaderError = validateRequiredFields([
    { label: "the examination title", value: content.examTitle },
    {
      label: "the examination description",
      value: content.examDescription,
    },
  ]);

  if (examHeaderError) return examHeaderError;

  for (const [index, term] of (content.timelineTerms || []).entries()) {
    const termError = validateRequiredFields([
      { label: `exam term ${index + 1}`, value: term?.term },
      { label: `exam term ${index + 1} timeframe`, value: term?.timeframe },
    ]);

    if (termError) return termError;
  }

  const continuousError = validateRequiredFields([
    {
      label: "the continuous evaluation title",
      value: content.continuousTitle,
    },
    {
      label: "the continuous evaluation description",
      value: content.continuousDescription,
    },
  ]);

  if (continuousError) return continuousError;

  const assessments = Array.isArray(content.ongoingAssessments)
    ? content.ongoingAssessments
        .map((item) => cleanText(item))
        .filter(Boolean)
    : [];

  if (assessments.length === 0) {
    return "Please add at least one continuous assessment item.";
  }

  const ctaError = validateRequiredFields([
    { label: "the CTA title", value: content.ctaTitle },
    { label: "the CTA description", value: content.ctaDescription },
    { label: "the primary button text", value: content.primaryButtonText },
    { label: "the primary button link", value: content.primaryButtonLink },
    { label: "the secondary button text", value: content.secondaryButtonText },
    { label: "the secondary button link", value: content.secondaryButtonLink },
  ]);

  if (ctaError) return ctaError;

  if (
    !cleanText(content.primaryButtonLink).startsWith("/") ||
    !cleanText(content.secondaryButtonLink).startsWith("/")
  ) {
    return "Academic CTA button links must start with /.";
  }

  return "";
}

function validateAcademicsModal(editingTarget, modalForm, form) {
  if (!editingTarget) return "No Academics item is selected.";

  if (editingTarget.type === "hero") {
    const error = validateRequiredFields([
      { label: "the hero badge", value: modalForm.heroBadge },
      { label: "the hero title", value: modalForm.heroTitle },
      { label: "the highlighted hero word", value: modalForm.heroHighlight },
      { label: "the hero description", value: modalForm.heroDescription },
    ]);

    if (error) return error;

    return cleanText(modalForm.heroTitle).includes(
      cleanText(modalForm.heroHighlight)
    )
      ? ""
      : "The highlighted hero word must be part of the hero title.";
  }

  if (editingTarget.type === "program") {
    return validateProgramModal(modalForm, form, editingTarget);
  }

  if (editingTarget.type === "featuresHeader") {
    return validateRequiredFields([
      { label: "the academic strengths title", value: modalForm.featuresTitle },
      {
        label: "the academic strengths description",
        value: modalForm.featuresDescription,
      },
    ]);
  }

  if (editingTarget.type === "feature") {
    return validateRequiredFields([
      { label: "the feature title", value: modalForm.title },
      { label: "the feature description", value: modalForm.desc },
      { label: "the feature icon", value: modalForm.emoji },
      { label: "the accent color", value: modalForm.color },
    ]);
  }

  if (editingTarget.type === "stat") {
    return validateRequiredFields([
      { label: "the statistic value", value: modalForm.value },
      { label: "the statistic label", value: modalForm.label },
      { label: "the accent color", value: modalForm.color },
    ]);
  }

  if (editingTarget.type === "examHeader") {
    return validateRequiredFields([
      { label: "the examination title", value: modalForm.examTitle },
      {
        label: "the examination description",
        value: modalForm.examDescription,
      },
    ]);
  }

  if (editingTarget.type === "timeline") {
    return validateRequiredFields([
      { label: "the exam term", value: modalForm.term },
      { label: "the exam timeframe", value: modalForm.timeframe },
    ]);
  }

  if (editingTarget.type === "continuous") {
    const error = validateRequiredFields([
      {
        label: "the continuous evaluation title",
        value: modalForm.continuousTitle,
      },
      {
        label: "the continuous evaluation description",
        value: modalForm.continuousDescription,
      },
    ]);

    if (error) return error;

    const assessments = cleanText(modalForm.ongoingAssessmentsText)
      .split("\n")
      .map((item) => cleanText(item))
      .filter(Boolean);

    return assessments.length === 0
      ? "Please add at least one continuous assessment item."
      : "";
  }

  if (editingTarget.type === "cta") {
    const error = validateRequiredFields([
      { label: "the CTA title", value: modalForm.ctaTitle },
      { label: "the CTA description", value: modalForm.ctaDescription },
      { label: "the primary button text", value: modalForm.primaryButtonText },
      { label: "the primary button link", value: modalForm.primaryButtonLink },
      {
        label: "the secondary button text",
        value: modalForm.secondaryButtonText,
      },
      {
        label: "the secondary button link",
        value: modalForm.secondaryButtonLink,
      },
    ]);

    if (error) return error;

    return cleanText(modalForm.primaryButtonLink).startsWith("/") &&
      cleanText(modalForm.secondaryButtonLink).startsWith("/")
      ? ""
      : "Academic CTA button links must start with /.";
  }

  return "";
}

export default function AdminAcademics() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultAcademicsContent);
  const [loading, setLoading] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    const loadAcademicsContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/academics",
          {
            timeout: 12000,
          }
        );

        const savedContent = res.data?.data?.content || {};
        setForm(mergeAcademicsContent(savedContent));
      } catch (err) {
        console.error("Load academics content error:", err);
        setError("Could not load saved academics content. Default content shown.");
      } finally {
        setLoading(false);
      }
    };

    loadAcademicsContent();
  }, []);

  const updateModalField = (name, value) => {
    setModalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setModalError("");
  };

  const saveContentToBackend = async (nextForm, message) => {
    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      const message = "Admin login expired. Please logout and login again.";
      setError(message);
      setModalError(message);
      return false;
    }

    const candidateContent = {
      ...nextForm,
      _contentVersion: 2,
    };
    const validationError = validateAcademicsContent(candidateContent);

    if (validationError) {
      setError(validationError);
      setModalError(validationError);
      return false;
    }

    const cleanContent = mergeAcademicsContent(candidateContent);

    await axios.put(
      "https://school-website-backend-ixx2.onrender.com/api/site-content/academics",
      { content: cleanContent },
      { headers: authHeaders }
    );

    setForm(cleanContent);
    setSuccess(message || "Academics page updated successfully.");
    return true;
  };

  const openEditor = (target) => {
    setSuccess("");
    setError("");
    setModalError("");
    setEditingTarget(target);

    if (target.type === "hero") {
      setModalForm({
        heroBadge: form.heroBadge || "",
        heroTitle: form.heroTitle || "",
        heroHighlight: form.heroHighlight || "",
        heroDescription: form.heroDescription || "",
      });
      return;
    }

    if (target.type === "program") {
      const item = form.programs?.[target.index] || {};
      const curriculumGrades = Array.isArray(form.curriculum?.[item.level])
        ? cloneJson(form.curriculum[item.level])
        : [
            {
              grade: "New Grade",
              books: [
                { subject: "New Subject", publication: "New Publication" },
              ],
            },
          ];

      setModalForm({
        oldLevel: item.level || "",
        level: item.level || "",
        span: item.span || "",
        badgeColor: item.badgeColor || colors.green,
        highlight: item.highlight || "",
        classesText: Array.isArray(item.classes) ? item.classes.join("\n") : "",
        curriculumGrades,
      });
      return;
    }

    if (target.type === "featuresHeader") {
      setModalForm({
        featuresTitle: form.featuresTitle || "",
        featuresDescription: form.featuresDescription || "",
      });
      return;
    }

    if (target.type === "feature") {
      const item = form.features?.[target.index] || {};

      setModalForm({
        title: item.title || "",
        desc: item.desc || "",
        emoji: item.emoji || "📘",
        color: item.color || colors.green,
      });
      return;
    }

    if (target.type === "stat") {
      const item = form.stats?.[target.index] || {};

      setModalForm({
        value: item.value || "",
        label: item.label || "",
        icon: item.icon || "users",
        color: item.color || colors.green,
      });
      return;
    }

    if (target.type === "examHeader") {
      setModalForm({
        examTitle: form.examTitle || "",
        examDescription: form.examDescription || "",
      });
      return;
    }

    if (target.type === "timeline") {
      const item = form.timelineTerms?.[target.index] || {};

      setModalForm({
        term: item.term || "",
        timeframe: item.timeframe || "",
      });
      return;
    }

    if (target.type === "continuous") {
      setModalForm({
        continuousTitle: form.continuousTitle || "",
        continuousDescription: form.continuousDescription || "",
        ongoingAssessmentsText: Array.isArray(form.ongoingAssessments)
          ? form.ongoingAssessments.join("\n")
          : "",
      });
      return;
    }

    if (target.type === "cta") {
      setModalForm({
        ctaTitle: form.ctaTitle || "",
        ctaDescription: form.ctaDescription || "",
        primaryButtonText: form.primaryButtonText || "",
        primaryButtonLink: form.primaryButtonLink || "",
        secondaryButtonText: form.secondaryButtonText || "",
        secondaryButtonLink: form.secondaryButtonLink || "",
      });
    }
  };

  const closeEditor = () => {
    if (saving) return;
    setEditingTarget(null);
    setModalForm({});
    setModalError("");
  };

  const updateModalGrade = (gradeIndex, field, value) => {
    setModalError("");
    setModalForm((prev) => {
      const grades = Array.isArray(prev.curriculumGrades)
        ? [...prev.curriculumGrades]
        : [];

      grades[gradeIndex] = {
        ...grades[gradeIndex],
        [field]: value,
      };

      return {
        ...prev,
        curriculumGrades: grades,
      };
    });
  };

  const addModalGrade = () => {
    setModalError("");
    setModalForm((prev) => ({
      ...prev,
      curriculumGrades: [
        ...(Array.isArray(prev.curriculumGrades) ? prev.curriculumGrades : []),
        {
          grade: "New Grade",
          books: [
            { subject: "New Subject", publication: "New Publication" },
          ],
        },
      ],
    }));
  };

  const removeModalGrade = (gradeIndex) => {
    setModalError("");
    setModalForm((prev) => ({
      ...prev,
      curriculumGrades: (prev.curriculumGrades || []).filter(
        (_, index) => index !== gradeIndex
      ),
    }));
  };

  const moveModalGrade = (gradeIndex, direction) => {
    setModalError("");
    setModalForm((prev) => {
      const grades = Array.isArray(prev.curriculumGrades)
        ? [...prev.curriculumGrades]
        : [];
      const targetIndex = gradeIndex + direction;

      if (targetIndex < 0 || targetIndex >= grades.length) return prev;

      const temp = grades[gradeIndex];
      grades[gradeIndex] = grades[targetIndex];
      grades[targetIndex] = temp;

      return {
        ...prev,
        curriculumGrades: grades,
      };
    });
  };

  const addModalBook = (gradeIndex) => {
    setModalError("");
    setModalForm((prev) => {
      const grades = Array.isArray(prev.curriculumGrades)
        ? [...prev.curriculumGrades]
        : [];

      grades[gradeIndex] = {
        ...grades[gradeIndex],
        books: [
          ...(Array.isArray(grades[gradeIndex]?.books)
            ? grades[gradeIndex].books
            : []),
          { subject: "New Subject", publication: "New Publication" },
        ],
      };

      return {
        ...prev,
        curriculumGrades: grades,
      };
    });
  };

  const updateModalBook = (gradeIndex, bookIndex, field, value) => {
    setModalError("");
    setModalForm((prev) => {
      const grades = Array.isArray(prev.curriculumGrades)
        ? [...prev.curriculumGrades]
        : [];
      const books = Array.isArray(grades[gradeIndex]?.books)
        ? [...grades[gradeIndex].books]
        : [];

      books[bookIndex] = {
        ...books[bookIndex],
        [field]: value,
      };

      grades[gradeIndex] = {
        ...grades[gradeIndex],
        books,
      };

      return {
        ...prev,
        curriculumGrades: grades,
      };
    });
  };

  const removeModalBook = (gradeIndex, bookIndex) => {
    setModalError("");
    setModalForm((prev) => {
      const grades = Array.isArray(prev.curriculumGrades)
        ? [...prev.curriculumGrades]
        : [];

      grades[gradeIndex] = {
        ...grades[gradeIndex],
        books: (grades[gradeIndex]?.books || []).filter(
          (_, index) => index !== bookIndex
        ),
      };

      return {
        ...prev,
        curriculumGrades: grades,
      };
    });
  };

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    const validationError = validateAcademicsModal(
      editingTarget,
      modalForm,
      form
    );

    if (validationError) {
      setModalError(validationError);
      return;
    }

    setSaving(true);
    setSuccess("");
    setError("");
    setModalError("");

    try {
      let nextForm = mergeAcademicsContent(form);

      if (editingTarget.type === "hero") {
        nextForm = {
          ...nextForm,
          heroBadge: cleanText(modalForm.heroBadge),
          heroTitle: cleanText(modalForm.heroTitle),
          heroHighlight: cleanText(modalForm.heroHighlight),
          heroDescription: cleanText(modalForm.heroDescription),
        };
      }

      if (editingTarget.type === "program") {
        const oldLevel =
          modalForm.oldLevel ||
          nextForm.programs[editingTarget.index]?.level;
        const nextLevel = cleanText(modalForm.level);
        const nextCurriculum = { ...(nextForm.curriculum || {}) };

        if (oldLevel && oldLevel !== nextLevel) {
          delete nextCurriculum[oldLevel];
        }

        nextCurriculum[nextLevel] = sanitizeGrades(
          modalForm.curriculumGrades || []
        );

        const nextProgram = {
          id:
            editingTarget.id ||
            nextForm.programs[editingTarget.index]?.id ||
            Date.now(),
          level: nextLevel,
          span: cleanText(modalForm.span),
          badgeColor: modalForm.badgeColor || colors.green,
          border: `${modalForm.badgeColor || colors.green}24`,
          highlight: cleanText(modalForm.highlight),
          classes: cleanText(modalForm.classesText)
            .split("\n")
            .map((subject) => cleanText(subject))
            .filter(Boolean),
          visible: true,
        };

        nextForm = {
          ...nextForm,
          programs: editingTarget.isNew
            ? [...nextForm.programs, nextProgram]
            : nextForm.programs.map((item, index) =>
                index === editingTarget.index
                  ? {
                      ...item,
                      ...nextProgram,
                    }
                  : item
              ),
          curriculum: nextCurriculum,
        };
      }

      if (editingTarget.type === "featuresHeader") {
        nextForm = {
          ...nextForm,
          featuresTitle: cleanText(modalForm.featuresTitle),
          featuresDescription: cleanText(modalForm.featuresDescription),
        };
      }

      if (editingTarget.type === "feature") {
        const nextFeature = {
          id:
            editingTarget.id ||
            nextForm.features[editingTarget.index]?.id ||
            Date.now(),
          title: cleanText(modalForm.title),
          desc: cleanText(modalForm.desc),
          emoji: cleanText(modalForm.emoji),
          color: modalForm.color || colors.green,
          visible: true,
        };

        nextForm = {
          ...nextForm,
          features: editingTarget.isNew
            ? [...nextForm.features, nextFeature]
            : nextForm.features.map((item, index) =>
                index === editingTarget.index
                  ? {
                      ...item,
                      ...nextFeature,
                    }
                  : item
              ),
        };
      }

      if (editingTarget.type === "stat") {
        const nextStat = {
          id:
            editingTarget.id ||
            nextForm.stats[editingTarget.index]?.id ||
            Date.now(),
          value: cleanText(modalForm.value),
          label: cleanText(modalForm.label),
          icon:
            nextForm.stats[editingTarget.index]?.icon || "users",
          color: modalForm.color || colors.green,
          visible: true,
        };

        nextForm = {
          ...nextForm,
          stats: editingTarget.isNew
            ? [...nextForm.stats, nextStat]
            : nextForm.stats.map((item, index) =>
                index === editingTarget.index
                  ? {
                      ...item,
                      ...nextStat,
                    }
                  : item
              ),
        };
      }

      if (editingTarget.type === "examHeader") {
        nextForm = {
          ...nextForm,
          examTitle: cleanText(modalForm.examTitle),
          examDescription: cleanText(modalForm.examDescription),
        };
      }

      if (editingTarget.type === "timeline") {
        const nextTerm = {
          id:
            editingTarget.id ||
            nextForm.timelineTerms[editingTarget.index]?.id ||
            Date.now(),
          term: cleanText(modalForm.term),
          timeframe: cleanText(modalForm.timeframe),
          visible: true,
        };

        nextForm = {
          ...nextForm,
          timelineTerms: editingTarget.isNew
            ? [...nextForm.timelineTerms, nextTerm]
            : nextForm.timelineTerms.map((item, index) =>
                index === editingTarget.index
                  ? {
                      ...item,
                      ...nextTerm,
                    }
                  : item
              ),
        };
      }

      if (editingTarget.type === "continuous") {
        nextForm = {
          ...nextForm,
          continuousTitle: cleanText(modalForm.continuousTitle),
          continuousDescription: cleanText(modalForm.continuousDescription),
          ongoingAssessments: (modalForm.ongoingAssessmentsText || "")
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        };
      }

      if (editingTarget.type === "cta") {
        nextForm = {
          ...nextForm,
          ctaTitle: cleanText(modalForm.ctaTitle),
          ctaDescription: cleanText(modalForm.ctaDescription),
          primaryButtonText: cleanText(modalForm.primaryButtonText),
          primaryButtonLink: cleanText(modalForm.primaryButtonLink),
          secondaryButtonText: cleanText(modalForm.secondaryButtonText),
          secondaryButtonLink: cleanText(modalForm.secondaryButtonLink),
        };
      }

      const saved = await saveContentToBackend(
        nextForm,
        editingTarget.isNew
          ? "New academics item added successfully."
          : "Selected academics item saved successfully."
      );

      if (!saved) return;

      setEditingTarget(null);
      setModalForm({});
      setModalError("");
    } catch (err) {
      console.error("Save selected academics item error:", err);

      if (err.response?.status === 401) {
        setModalError(
          "Admin login expired or token is invalid. Please login again."
        );
      } else {
        setModalError(
          err.response?.data?.message || "Could not save selected item."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const addItem = (type) => {
    const newId = Date.now();

    setSuccess("");
    setError("");
    setModalError("");

    if (type === "program") {
      const nextColor =
        cardColors[(form.programs || []).length % cardColors.length];

      setEditingTarget({
        type: "program",
        index: (form.programs || []).length,
        id: newId,
        isNew: true,
      });
      setModalForm({
        oldLevel: "",
        level: "",
        span: "",
        badgeColor: nextColor,
        highlight: "",
        classesText: "",
        curriculumGrades: [
          {
            grade: "",
            books: [{ subject: "", publication: "" }],
          },
        ],
      });
      return;
    }

    if (type === "feature") {
      const nextColor =
        cardColors[(form.features || []).length % cardColors.length];

      setEditingTarget({
        type: "feature",
        index: (form.features || []).length,
        id: newId,
        isNew: true,
      });
      setModalForm({
        title: "",
        desc: "",
        emoji: "📘",
        color: nextColor,
      });
      return;
    }

    if (type === "stat") {
      const nextColor =
        cardColors[(form.stats || []).length % cardColors.length];

      setEditingTarget({
        type: "stat",
        index: (form.stats || []).length,
        id: newId,
        isNew: true,
      });
      setModalForm({
        value: "",
        label: "",
        color: nextColor,
      });
      return;
    }

    if (type === "timeline") {
      setEditingTarget({
        type: "timeline",
        index: (form.timelineTerms || []).length,
        id: newId,
        isNew: true,
      });
      setModalForm({
        term: "",
        timeframe: "",
      });
    }
  };

  const deleteTargetItem = async (target) => {
    if (!target) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeAcademicsContent(form);

      if (target.type === "program") {
        const program = nextForm.programs[target.index];
        const nextCurriculum = { ...nextForm.curriculum };

        if (program?.level) {
          delete nextCurriculum[program.level];
        }

        nextForm = {
          ...nextForm,
          programs: nextForm.programs.filter((_, index) => index !== target.index),
          curriculum: nextCurriculum,
        };
      }

      if (target.type === "feature") {
        nextForm = {
          ...nextForm,
          features: nextForm.features.filter((_, index) => index !== target.index),
        };
      }

      if (target.type === "stat") {
        nextForm = {
          ...nextForm,
          stats: nextForm.stats.filter((_, index) => index !== target.index),
        };
      }

      if (target.type === "timeline") {
        nextForm = {
          ...nextForm,
          timelineTerms: nextForm.timelineTerms.filter(
            (_, index) => index !== target.index
          ),
        };
      }

      const saved = await saveContentToBackend(
        nextForm,
        "Selected item deleted successfully."
      );

      if (!saved) return;

      setDeleteTarget(null);
      setEditingTarget(null);
      setModalForm({});
      setModalError("");
    } catch (err) {
      console.error("Delete academics item error:", err);
      setError(err.response?.data?.message || "Could not delete selected item.");
    } finally {
      setSaving(false);
    }
  };

  async function saveWholePage() {
    setSaving(true);
    setSuccess("");
    setError("");
    setModalError("");

    try {
      await saveContentToBackend(form, "Academics page content saved successfully.");
    } catch (err) {
      console.error("Save academics content error:", err);
      setError(err.response?.data?.message || "Could not save academics content.");
    } finally {
      setSaving(false);
    }
  }

  const modalTitle = useMemo(() => {
    if (!editingTarget) return "";

    const titles = {
      hero: "Edit Academics Hero",
      program: "Edit Academic Program + Curriculum",
      featuresHeader: "Edit Academic Strengths Heading",
      feature: "Edit Academic Feature",
      stat: "Edit Statistic",
      examHeader: "Edit Examination Heading",
      timeline: "Edit Exam Term",
      continuous: "Edit Continuous Evaluation",
      cta: "Edit Bottom CTA",
    };

    return titles[editingTarget.type] || "Edit Academics Page";
  }, [editingTarget]);

  const canDeleteSelected = useMemo(() => {
    if (!editingTarget || editingTarget.isNew) return false;
    return ["program", "feature", "stat", "timeline"].includes(editingTarget.type);
  }, [editingTarget]);
  return (
    <div className="space-y-6">

      <style>
        {`
          /* Mobile fix: Only make admin edit/delete buttons visible on mobile */
          @media (max-width: 767px) {
            .admin-academics-preview-frame .group button[class*="absolute"],
            .admin-academics-preview-frame .group [class*="absolute"] button,
            .admin-academics-preview-frame .group .opacity-0,
            .admin-academics-preview-frame .group [class*="opacity-0"],
            .admin-academics-preview-frame .group [class*="group-hover:opacity"],
            .admin-academics-preview-frame [class*="group-hover:opacity"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-academics-preview-frame .group button {
              min-width: 2rem !important;
              min-height: 2rem !important;
            }
          }
        `}
      </style>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] p-4 sm:p-5 md:p-6"
        style={{
          background:
            "linear-gradient(135deg, #E8EDF5 0%, #DCE3EF 50%, #E8E0F0 100%)",
          border: "1px solid rgba(15,23,42,0.06)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 bg-purple-50 text-purple-700 border border-purple-100">
              <Eye className="w-3.5 h-3.5" />
              Visual Academics Editor
            </div>

            <h2
              className="text-2xl md:text-3xl font-black text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}
            >
              Hover and Edit Academics Page
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Hover sections to edit. Program cards include curriculum books, grade reorder, add grade, and delete with confirmation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-black bg-white text-slate-700 border border-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>

            <a
              href="/academics"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-black bg-white text-slate-700 border border-slate-100"
            >
              <ExternalLink className="w-4 h-4" />
              View Page
            </a>

            <button
              type="button"
              onClick={saveWholePage}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                color: colors.dark,
                boxShadow: "0 16px 38px rgba(56,189,248,0.22)",
              }}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save All"}
            </button>
          </div>
        </div>

        {success && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-green-50 text-green-700 border border-green-100">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-red-50 text-red-700 border border-red-100">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div
          className="admin-academics-preview-frame rounded-[2rem] overflow-x-auto"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <div className="w-full min-w-0 bg-white">
            <Academics
              editMode
              contentOverride={form}
              onEditTarget={openEditor}
              onDeleteTarget={(target) => setDeleteTarget(target)}
              onAddTarget={addItem}
            />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editingTarget && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
            style={{
              background: "rgba(2,6,23,0.55)",
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditor}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 130, damping: 16 }}
              className="w-full max-w-3xl rounded-[28px] overflow-hidden max-h-[92vh] overflow-y-auto"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "0 42px 110px rgba(0,0,0,0.28)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="h-1"
                style={{
                  background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan}, ${colors.green})`,
                }}
              />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(56,189,248,0.18))",
                        color: colors.dark,
                      }}
                    >
                      {editingTarget.type === "program" ? (
                        <GraduationCap className="w-5 h-5" />
                      ) : (
                        <Pencil className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-950">
                        {modalTitle}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Save only this selected Academics page item.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeEditor}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {modalError && (
                  <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-700">
                    <div className="flex items-start gap-2 font-semibold">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>{modalError}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  {editingTarget.type === "hero" && (
                    <>
                      <Field
                        label="Hero Badge"
                        value={modalForm.heroBadge}
                        onChange={(value) => updateModalField("heroBadge", value)}
                      />
                      <Field
                        label="Hero Title"
                        value={modalForm.heroTitle}
                        onChange={(value) => updateModalField("heroTitle", value)}
                      />
                      <Field
                        label="Red Highlight Word"
                        value={modalForm.heroHighlight}
                        onChange={(value) => updateModalField("heroHighlight", value)}
                      />
                      <Field
                        label="Hero Description"
                        value={modalForm.heroDescription}
                        onChange={(value) => updateModalField("heroDescription", value)}
                        textarea
                        rows={5}
                      />
                    </>
                  )}

                  {editingTarget.type === "program" && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Field
                          label="Program Level"
                          value={modalForm.level}
                          onChange={(value) => updateModalField("level", value)}
                        />
                        <Field
                          label="Span"
                          value={modalForm.span}
                          onChange={(value) => updateModalField("span", value)}
                        />
                      </div>

                      <Field
                        label="Accent Color"
                        value={modalForm.badgeColor}
                        onChange={(value) => updateModalField("badgeColor", value)}
                        type="color"
                      />

                      <Field
                        label="Highlight"
                        value={modalForm.highlight}
                        onChange={(value) => updateModalField("highlight", value)}
                        textarea
                        rows={3}
                      />

                      <Field
                        label="Course Structure / Subjects - one per line"
                        value={modalForm.classesText}
                        onChange={(value) => updateModalField("classesText", value)}
                        textarea
                        rows={5}
                      />

                      <div
                        className="rounded-3xl p-5 space-y-4"
                        style={{
                          background: "rgba(75,46,131,0.04)",
                          border: "1px solid rgba(75,46,131,0.12)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="inline-flex items-center gap-2 text-sm font-black text-purple-700">
                              <BookOpen className="w-4 h-4" />
                              Curriculum & Books
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              This controls the popup opened when users click this academic program.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={addModalGrade}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black"
                            style={{
                              background: "rgba(22,138,58,0.08)",
                              color: colors.green,
                              border: "1px solid rgba(22,138,58,0.18)",
                            }}
                          >
                            <Plus className="w-4 h-4" />
                            Add Grade
                          </button>
                        </div>

                        <div className="space-y-4">
                          {(modalForm.curriculumGrades || []).map((grade, gradeIndex) => (
                            <div
                              key={`modal-grade-${gradeIndex}`}
                              className="rounded-2xl p-4 space-y-4"
                              style={{
                                background: "rgba(255,255,255,0.82)",
                                border: "1px solid rgba(15,23,42,0.08)",
                              }}
                            >
                              <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
                                <Field
                                  label={`Grade ${gradeIndex + 1}`}
                                  value={grade.grade}
                                  onChange={(value) =>
                                    updateModalGrade(gradeIndex, "grade", value)
                                  }
                                />

                                <div className="flex items-center gap-2 pb-0.5">
                                  <button
                                    type="button"
                                    onClick={() => moveModalGrade(gradeIndex, -1)}
                                    disabled={gradeIndex === 0}
                                    className="p-3 rounded-xl disabled:opacity-35"
                                    style={{
                                      background: "rgba(75,46,131,0.08)",
                                      color: colors.purple,
                                      border: "1px solid rgba(75,46,131,0.16)",
                                    }}
                                  >
                                    <ArrowUp className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => moveModalGrade(gradeIndex, 1)}
                                    disabled={gradeIndex === (modalForm.curriculumGrades || []).length - 1}
                                    className="p-3 rounded-xl disabled:opacity-35"
                                    style={{
                                      background: "rgba(22,138,58,0.08)",
                                      color: colors.green,
                                      border: "1px solid rgba(22,138,58,0.16)",
                                    }}
                                  >
                                    <ArrowDown className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => removeModalGrade(gradeIndex)}
                                    className="p-3 rounded-xl"
                                    style={{
                                      background: "rgba(215,25,32,0.08)",
                                      color: colors.red,
                                      border: "1px solid rgba(215,25,32,0.16)",
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-3">
                                {(grade.books || []).map((book, bookIndex) => (
                                  <div
                                    key={`modal-grade-${gradeIndex}-book-${bookIndex}`}
                                    className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end rounded-2xl p-3"
                                    style={{
                                      background: "rgba(248,250,252,0.95)",
                                      border: "1px solid rgba(15,23,42,0.06)",
                                    }}
                                  >
                                    <Field
                                      label="Subject"
                                      value={book.subject}
                                      onChange={(value) =>
                                        updateModalBook(
                                          gradeIndex,
                                          bookIndex,
                                          "subject",
                                          value
                                        )
                                      }
                                    />

                                    <Field
                                      label="Publication"
                                      value={book.publication}
                                      onChange={(value) =>
                                        updateModalBook(
                                          gradeIndex,
                                          bookIndex,
                                          "publication",
                                          value
                                        )
                                      }
                                    />

                                    <button
                                      type="button"
                                      onClick={() => removeModalBook(gradeIndex, bookIndex)}
                                      className="p-3 rounded-xl"
                                      style={{
                                        background: "rgba(215,25,32,0.08)",
                                        color: colors.red,
                                        border: "1px solid rgba(215,25,32,0.16)",
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}

                                <button
                                  type="button"
                                  onClick={() => addModalBook(gradeIndex)}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black"
                                  style={{
                                    background: "rgba(75,46,131,0.08)",
                                    color: colors.purple,
                                    border: "1px dashed rgba(75,46,131,0.3)",
                                  }}
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Subject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {editingTarget.type === "featuresHeader" && (
                    <>
                      <Field
                        label="Features Title"
                        value={modalForm.featuresTitle}
                        onChange={(value) => updateModalField("featuresTitle", value)}
                      />
                      <Field
                        label="Features Description"
                        value={modalForm.featuresDescription}
                        onChange={(value) => updateModalField("featuresDescription", value)}
                        textarea
                        rows={4}
                      />
                    </>
                  )}

                  {editingTarget.type === "feature" && (
                    <>
                      <Field
                        label="Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />
                      <Field
                        label="Description"
                        value={modalForm.desc}
                        onChange={(value) => updateModalField("desc", value)}
                        textarea
                        rows={4}
                      />
                      <Field
                        label="Emoji / Icon Text"
                        value={modalForm.emoji}
                        onChange={(value) => updateModalField("emoji", value)}
                      />
                      <Field
                        label="Accent Color"
                        value={modalForm.color}
                        onChange={(value) => updateModalField("color", value)}
                        type="color"
                      />
                    </>
                  )}

                  {editingTarget.type === "stat" && (
                    <>
                      <Field
                        label="Value"
                        value={modalForm.value}
                        onChange={(value) => updateModalField("value", value)}
                      />
                      <Field
                        label="Label"
                        value={modalForm.label}
                        onChange={(value) => updateModalField("label", value)}
                      />
                      <Field
                        label="Accent Color"
                        value={modalForm.color}
                        onChange={(value) => updateModalField("color", value)}
                        type="color"
                      />
                    </>
                  )}

                  {editingTarget.type === "examHeader" && (
                    <>
                      <Field
                        label="Exam Title"
                        value={modalForm.examTitle}
                        onChange={(value) => updateModalField("examTitle", value)}
                      />
                      <Field
                        label="Exam Description"
                        value={modalForm.examDescription}
                        onChange={(value) => updateModalField("examDescription", value)}
                        textarea
                        rows={4}
                      />
                    </>
                  )}

                  {editingTarget.type === "timeline" && (
                    <>
                      <Field
                        label="Term"
                        value={modalForm.term}
                        onChange={(value) => updateModalField("term", value)}
                      />
                      <Field
                        label="Timeframe"
                        value={modalForm.timeframe}
                        onChange={(value) => updateModalField("timeframe", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "continuous" && (
                    <>
                      <Field
                        label="Continuous Evaluation Title"
                        value={modalForm.continuousTitle}
                        onChange={(value) => updateModalField("continuousTitle", value)}
                      />
                      <Field
                        label="Continuous Evaluation Description"
                        value={modalForm.continuousDescription}
                        onChange={(value) => updateModalField("continuousDescription", value)}
                        textarea
                        rows={4}
                      />
                      <Field
                        label="Assessment Items - one per line"
                        value={modalForm.ongoingAssessmentsText}
                        onChange={(value) =>
                          updateModalField("ongoingAssessmentsText", value)
                        }
                        textarea
                        rows={5}
                      />
                    </>
                  )}

                  {editingTarget.type === "cta" && (
                    <>
                      <Field
                        label="CTA Title"
                        value={modalForm.ctaTitle}
                        onChange={(value) => updateModalField("ctaTitle", value)}
                      />
                      <Field
                        label="CTA Description"
                        value={modalForm.ctaDescription}
                        onChange={(value) => updateModalField("ctaDescription", value)}
                        textarea
                        rows={4}
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <Field
                          label="Primary Button Text"
                          value={modalForm.primaryButtonText}
                          onChange={(value) => updateModalField("primaryButtonText", value)}
                        />
                        <Field
                          label="Primary Button Link"
                          value={modalForm.primaryButtonLink}
                          onChange={(value) => updateModalField("primaryButtonLink", value)}
                        />
                        <Field
                          label="Secondary Button Text"
                          value={modalForm.secondaryButtonText}
                          onChange={(value) => updateModalField("secondaryButtonText", value)}
                        />
                        <Field
                          label="Secondary Button Link"
                          value={modalForm.secondaryButtonLink}
                          onChange={(value) => updateModalField("secondaryButtonLink", value)}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-7">
                  {canDeleteSelected && (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(editingTarget)}
                      disabled={saving}
                      className="sm:w-auto px-5 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                      style={{
                        background: "rgba(215,25,32,0.08)",
                        color: colors.red,
                        border: "1px solid rgba(215,25,32,0.18)",
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={closeEditor}
                    disabled={saving}
                    className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60"
                    style={{
                      background: "rgba(15,23,42,0.06)",
                      color: "rgba(15,23,42,0.65)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveSelectedPart}
                    disabled={saving}
                    className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                      color: "#020617",
                      boxShadow: "0 16px 38px rgba(56,189,248,0.24)",
                    }}
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save This Item"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5"
            style={{
              background: "rgba(2,6,23,0.62)",
              backdropFilter: "blur(14px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!saving) setDeleteTarget(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-full max-w-md rounded-[28px] bg-white overflow-hidden"
              style={{
                boxShadow: "0 42px 110px rgba(0,0,0,0.32)",
                border: "1px solid rgba(255,255,255,0.75)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
                  <Trash2 className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-black text-slate-950 mb-2">
                  Are you sure?
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  This will permanently delete {getDeleteName(deleteTarget)} from the Academics page.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-60"
                    style={{
                      background: "rgba(15,23,42,0.06)",
                      color: "rgba(15,23,42,0.68)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => deleteTargetItem(deleteTarget)}
                    className="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.red}, #991B1B)`,
                      color: "#FFFFFF",
                      boxShadow: "0 16px 38px rgba(215,25,32,0.24)",
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    {saving ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}