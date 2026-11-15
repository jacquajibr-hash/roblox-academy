
import { useEffect, useState } from "react";
import Grades from "./Grades.jsx";

const iconPaths = {
  home: ["M3 10.5 12 3l9 7.5", "M5.5 9.5V21h13V9.5", "M9 21v-7h6v7"],
  users: ["M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8", "M20 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  book: ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"],
  clipboard: ["M9 5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2", "M9 3h6v4H9z", "M9 12h6", "M9 16h6"],
  chart: ["M3 3v18h18", "M8 16V9", "M13 16V5", "M18 16v-4"],
  settings: ["M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z", "M19.4 15.4a2 2 0 0 0 .4 2.2 2 2 0 1 1-2.8 2.8 2 2 0 0 0-2.2-.4 2 2 0 0 0-1.2 1.8 2 2 0 1 1-4 0 2 2 0 0 0-1.2-1.8 2 2 0 0 0-2.2.4 2 2 0 1 1-2.8-2.8 2 2 0 0 0 .4-2.2A2 2 0 0 0 2 14.2a2 2 0 1 1 0-4 2 2 0 0 0 1.8-1.2 2 2 0 0 0-.4-2.2 2 2 0 1 1 2.8-2.8 2 2 0 0 0 2.2.4A2 2 0 0 0 9.6 2a2 2 0 1 1 4 0 2 2 0 0 0 1.2 1.8 2 2 0 0 0 2.2-.4 2 2 0 1 1 2.8 2.8 2 2 0 0 0-.4 2.2 2 2 0 0 0 1.8 1.2 2 2 0 1 1 0 4 2 2 0 0 0-1.8 1.8Z"],
  target: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"],
  paperclip: ["m21.4 11.6-9.9 9.9a6 6 0 0 1-8.5-8.5l10.6-10.6a4 4 0 0 1 5.7 5.7L8.7 18.7a2 2 0 0 1-2.8-2.8l9.9-9.9"],
  file: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z", "M14 2v6h6", "M8 13h8", "M8 17h8"],
  video: ["m22 8-6 4 6 4V8Z", "M2 6h14v12H2z"],
  image: ["M3 3h18v18H3z", "m3 16 5-5 4 4 3-3 6 6", "M8.5 8.5h.01"],
  music: ["M9 18V5l12-2v13", "M9 18a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3Z", "M21 16a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3Z"],
  pdf: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z", "M14 2v6h6", "M8 13h8", "M8 17h5"],
  pencil: ["m16 4 4 4", "M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15l-.8 5Z"],
  graduation: ["M2 10 12 5l10 5-10 5-10-5Z", "M6 12.5V17c3.5 3 8.5 3 12 0v-4.5", "M22 10v6"],
  bell: ["M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9", "M10 21h4"],
  search: ["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z", "m21 21-4.3-4.3"],
  crown: ["m2 8 5 4 5-8 5 8 5-4-2 12H4L2 8Z"],
  key: ["M7 14a5 5 0 1 1 4.9-6", "m11 8 10 0", "m18 8v3", "m15 8v2"],
  check: ["m5 12 4 4L19 6"],
  ban: ["M18.4 5.6a9 9 0 1 0 0 12.8 9 9 0 0 0 0-12.8Z", "m5.6 5.6 12.8 12.8"],
  shield: ["M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z", "m9 12 2 2 4-4"],
  user: ["M20 21a8 8 0 0 0-16 0", "M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"],
  lock: ["M5 11h14v10H5z", "M8 11V7a4 4 0 1 1 8 0v4", "M12 15v2"],
  palette: ["M12 22a10 10 0 1 1 10-10c0 2-1 3-3 3h-2a2 2 0 0 0-2 2c0 3-1 5-3 5Z", "M7.5 10h.01", "M10 6.5h.01", "M15 6.5h.01", "M17 10h.01"],
  school: ["m2 10 10-6 10 6-10 6-10-6Z", "M6 12v5c4 3 8 3 12 0v-5", "M22 10v6"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 6v6l4 2"],
  database: ["M12 2c5 0 9 1.6 9 3.5S17 9 12 9 3 7.4 3 5.5 7 2 12 2Z", "M3 5.5v13C3 20.4 7 22 12 22s9-1.6 9-3.5v-13", "M3 12c0 2 4 3.5 9 3.5s9-1.5 9-3.5"],
  construction: ["m14.5 6.5 3-3 4 4-3 3", "m12 9 3 3", "m3 21 9-9", "M5 7l4-4 5 5-4 4"],
  calendar: ["M4 4h16v17H4z", "M8 2v4", "M16 2v4", "M4 9h16"],
  trash: ["M3 6h18", "M8 6V4h8v2", "m19 6-1 15H6L5 6", "M10 11v6", "M14 11v6"],
  shieldLock: ["M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z", "M9 11V8a3 3 0 0 1 6 0v3", "M8 11h8v6H8z"]
};
function AppIcon({ name, size = 18, className = "" }) {
  const paths = iconPaths[name] || iconPaths.file;
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths.map((d, index) => <path d={d} key={index} />)}</svg>;
}


const navigation = [
  { id: "overview", icon: "home", label: "Vue générale" },
  { id: "users", icon: "users", label: "Gestion des comptes" },
  { id: "courses", icon: "book", label: "Cours" },
  { id: "assignments", icon: "clipboard", label: "Travail à faire" },
  { id: "grades", icon: "chart", label: "Notes et résultats" },
  { id: "settings", icon: "settings", label: "Paramètres" },
  { id: "server", icon: "school", label: "Éditeur du site" }
];

const roleLabels = {
  fondateur: "Fondateur",
  administrateur: "Administrateur",
  professeur: "Professeur",
  eleve: "Élève"
};

function App() {
  const [page, setPage] = useState("home");
  const [activeSection, setActiveSection] = useState("overview");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);
  const [apiStatus, setApiStatus] = useState("Vérification...");

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("tous");
  const [statusFilter, setStatusFilter] = useState("tous");

  const [modal, setModal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("eleve");

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [courseEditorOpen, setCourseEditorOpen] = useState(false);
  const [courseSaving, setCourseSaving] = useState(false);
  const [courseFormError, setCourseFormError] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseCategory, setCourseCategory] = useState("Programmation");
  const [courseLevel, setCourseLevel] = useState("Débutant");
  const [courseChapters, setCourseChapters] = useState([
    { title: "Introduction", content: "" }
  ]);
  const [courseFiles, setCourseFiles] = useState([]);
  const [pendingCourseFiles, setPendingCourseFiles] = useState([]);
  const [filesBusy, setFilesBusy] = useState(false);

  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState("");
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [assignmentSaving, setAssignmentSaving] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentSubject, setAssignmentSubject] = useState("Programmation");
  const [assignmentTarget, setAssignmentTarget] = useState("class");
  const [assignmentType, setAssignmentType] = useState("normal");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("tous");

  const [settingsCompact, setSettingsCompact] = useState(() => {
    try { return localStorage.getItem("ra-settings-compact") === "true"; }
    catch { return false; }
  });
  const [settingsAccent, setSettingsAccent] = useState(() => {
    try { return localStorage.getItem("ra-settings-accent") || "violet"; }
    catch { return "violet"; }
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [profileUsername, setProfileUsername] = useState("");
  const [profileAvatarFile, setProfileAvatarFile] = useState(null);
  const [profileFileInputKey, setProfileFileInputKey] = useState(0);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState("");
  const [backups, setBackups] = useState([]);
  const [backupsLoading, setBackupsLoading] = useState(false);
  const [backupsError, setBackupsError] = useState("");
  const [backupCreating, setBackupCreating] = useState(false);
  const [backupRestoring, setBackupRestoring] = useState("");

  // Paramètres du serveur chargés depuis le backend et partagés entre les utilisateurs.
  const [serverConfig, setServerConfig] = useState({
    siteName: "Roblox Academy",
    headerName: "Roblox Academy",
    logoText: "RA",
    description: "La plateforme scolaire de Roblox Academy.",
    welcomeTitle: "Bienvenue sur Roblox Academy",
    welcomeText: "Apprends, progresse et retrouve tes cours au même endroit.",
    welcomeMessage: "Connecte-toi pour accéder à ton espace personnel.",
    logoUrl: "",
    faviconUrl: "",
    primaryColor: "#7662d8",
    secondaryColor: "#25213f",
    accentColor: "#a78bfa",
    backgroundColor: "#0b1020",
    theme: "dark",
    dashboardWelcomeTitle: "Bienvenue",
    dashboardWelcomeText: "Voici un aperçu de ton établissement Roblox Academy.",
    dashboardOverviewTitle: "Vue d’ensemble",
    dashboardQuickTitle: "Accès rapides"
  });
  const [serverPreview, setServerPreview] = useState(false);
  const [serverDraftMessage, setServerDraftMessage] = useState("");
  const [serverLoading, setServerLoading] = useState(true);
  const [serverSaving, setServerSaving] = useState(false);
  const [serverAssetUploading, setServerAssetUploading] = useState({ logo: false, icon: false });

  const canManageCourses = ["fondateur", "administrateur", "professeur"].includes(user?.role);
  const canManageAssignments = ["fondateur", "administrateur", "professeur"].includes(user?.role);

  useEffect(() => {
    loadServerSettings();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.title = serverConfig.siteName || "Roblox Academy";

    if (serverConfig.faviconUrl) {
      let favicon = document.querySelector('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.href = serverConfig.faviconUrl;
    }
  }, [serverConfig.siteName, serverConfig.faviconUrl]);

  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then((data) => setApiStatus(data.message))
      .catch(() => setApiStatus("Serveur indisponible"));

    fetch("/api/auth/me", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (data?.success) {
          setUser(data.user);
          setPage("dashboard");
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (page === "dashboard" && activeSection === "users") {
      loadUsers();
    }
  }, [page, activeSection]);

  useEffect(() => {
    if (user?.username) setProfileUsername(user.username);
  }, [user?.username]);

  useEffect(() => {
    if (page === "dashboard" && activeSection === "settings" && user?.role === "fondateur") {
      loadAdminSettingsData();
    }
  }, [page, activeSection, user?.role]);

  useEffect(() => {
    if (page === "dashboard" && activeSection === "courses") {
      loadCourses();
    }
    if (page === "dashboard" && activeSection === "assignments") {
      loadAssignments();
      if (canManageAssignments) loadUsers();
    }
  }, [page, activeSection]);


  async function loadUsers() {
    setUsersLoading(true);
    setUsersError("");

    try {
      const response = await fetch("/api/users", {
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de charger les comptes.");
      }

      setUsers(data.users || []);
    } catch (err) {
      setUsersError(err.message || "Erreur lors du chargement.");
    } finally {
      setUsersLoading(false);
    }
  }


  async function loadAssignments() {
    setAssignmentsLoading(true);
    setAssignmentsError("");

    try {
      const response = await fetch("/api/assignments", {
        credentials: "include"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de charger les devoirs.");
      }

      setAssignments(data.assignments || []);
    } catch (err) {
      setAssignmentsError(err.message || "Erreur lors du chargement des devoirs.");
    } finally {
      setAssignmentsLoading(false);
    }
  }

  function openAssignmentModal() {
    setEditingAssignment(null);
    setAssignmentTitle("");
    setAssignmentDescription("");
    setAssignmentSubject("Programmation");
    setAssignmentTarget("class");
    setAssignmentType("normal");
    setAssignmentDueDate("");
    setAssignmentsError("");
    setAssignmentModalOpen(true);
  }

  function openEditAssignment(assignment) {
    setEditingAssignment(assignment);
    setAssignmentTitle(assignment.title || "");
    setAssignmentDescription(assignment.description || "");
    setAssignmentSubject(assignment.subject || "Programmation");
    setAssignmentTarget(assignment.targetStudentId || "class");
    setAssignmentType(assignment.type || "normal");
    setAssignmentDueDate(assignment.dueDate ? String(assignment.dueDate).slice(0, 10) : "");
    setAssignmentsError("");
    setAssignmentModalOpen(true);
  }

  async function deleteAssignment(assignment) {
    const confirmed = window.confirm(`Supprimer le devoir « ${assignment.title} » ? Cette action est définitive.`);
    if (!confirmed) return;

    setAssignmentsError("");
    try {
      const response = await fetch(`/api/assignments/${encodeURIComponent(assignment.id)}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Impossible de supprimer le devoir.");
      await loadAssignments();
    } catch (err) {
      setAssignmentsError(err.message || "Une erreur est survenue lors de la suppression.");
    }
  }

  async function saveAssignment(event) {
    event.preventDefault();
    setAssignmentsError("");

    if (assignmentTarget !== "class" && !users.some((account) => account.id === assignmentTarget && account.role === "eleve")) {
      setAssignmentsError("Sélectionne un élève valide.");
      return;
    }

    setAssignmentSaving(true);
    try {
      const response = await fetch(
        editingAssignment ? `/api/assignments/${encodeURIComponent(editingAssignment.id)}` : "/api/assignments",
        {
          method: editingAssignment ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: assignmentTitle.trim(),
            description: assignmentDescription.trim(),
            subject: assignmentSubject,
            targetStudentId: assignmentTarget === "class" ? null : assignmentTarget,
            type: assignmentType,
            dueDate: assignmentDueDate || null
          })
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible d'enregistrer le devoir.");
      }

      setAssignmentModalOpen(false);
      setEditingAssignment(null);
      await loadAssignments();
    } catch (err) {
      setAssignmentsError(err.message || "Une erreur est survenue.");
    } finally {
      setAssignmentSaving(false);
    }
  }

  async function loadCourses() {
    setCoursesLoading(true);
    setCoursesError("");

    try {
      const response = await fetch("/api/courses", {
        credentials: "include"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de charger les cours.");
      }

      setCourses(data.courses || []);
    } catch (err) {
      setCoursesError(err.message || "Erreur lors du chargement des cours.");
    } finally {
      setCoursesLoading(false);
    }
  }

  function openCourseEditor(course = null) {
    setEditingCourse(course);
    setCourseFormError("");
    setCourseTitle(course?.title || "");
    setCourseDescription(course?.description || "");
    setCourseCategory(course?.category || "Programmation");
    setCourseLevel(course?.level || "Débutant");
    setCourseChapters(
      course?.chapters?.length
        ? course.chapters.map((chapter) => ({
            id: chapter.id,
            title: chapter.title || "",
            content: chapter.content || ""
          }))
        : [{ title: "Introduction", content: "" }]
    );
    setCourseFiles(course?.files || course?.documents || []);
    setPendingCourseFiles([]);
    setCourseEditorOpen(true);
  }

  function closeCourseEditor() {
    if (courseSaving) return;
    setCourseEditorOpen(false);
    setEditingCourse(null);
    setCourseFormError("");
    setCourseFiles([]);
    setPendingCourseFiles([]);
  }

  function updateChapter(index, field, value) {
    setCourseChapters((current) =>
      current.map((chapter, chapterIndex) =>
        chapterIndex === index ? { ...chapter, [field]: value } : chapter
      )
    );
  }

  function addChapter() {
    if (courseChapters.length >= 50) {
      setCourseFormError("Un cours ne peut pas dépasser 50 chapitres.");
      return;
    }
    setCourseChapters((current) => [
      ...current,
      { title: `Chapitre ${current.length + 1}`, content: "" }
    ]);
  }

  function removeChapter(index) {
    if (courseChapters.length === 1) {
      setCourseFormError("Un cours doit conserver au moins un chapitre.");
      return;
    }
    setCourseChapters((current) =>
      current.filter((_, chapterIndex) => chapterIndex !== index)
    );
  }

  async function saveCourse(event) {
    event.preventDefault();
    setCourseFormError("");

    const payload = {
      title: courseTitle,
      description: courseDescription,
      category: courseCategory,
      level: courseLevel,
      chapters: courseChapters
    };

    setCourseSaving(true);

    try {
      const response = await fetch(
        editingCourse ? `/api/courses/${editingCourse.id}` : "/api/courses",
        {
          method: editingCourse ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible d'enregistrer le cours.");
      }

      const savedCourse = data.course;
      const courseId = savedCourse?.id || editingCourse?.id;

      if (!courseId) {
        throw new Error("Le cours est enregistré, mais son identifiant est introuvable.");
      }

      if (pendingCourseFiles.length > 0) {
        setFilesBusy(true);
        const uploadedFiles = [...courseFiles];

        for (const file of pendingCourseFiles) {
          const formData = new FormData();
          formData.append("file", file);

          const uploadResponse = await fetch(`/api/courses/${courseId}/files`, {
            method: "POST",
            credentials: "include",
            body: formData
          });
          const uploadData = await uploadResponse.json();

          if (!uploadResponse.ok) {
            throw new Error(uploadData.message || `Échec de l'envoi de ${file.name}.`);
          }

          if (uploadData.file) uploadedFiles.push(uploadData.file);
          setCourseFiles([...uploadedFiles]);
          setPendingCourseFiles((current) => current.filter((item) => item !== file));
        }
      }

      setCourseEditorOpen(false);
      setEditingCourse(null);
      setCourseFiles([]);
      setPendingCourseFiles([]);
      await loadCourses();
    } catch (err) {
      setCourseFormError(err.message || "Une erreur est survenue.");
    } finally {
      setCourseSaving(false);
      setFilesBusy(false);
    }
  }

  function getCourseFileUrl(file) {
    return `/api/courses/files/${encodeURIComponent(file.id)}`;
  }

  function getCourseFileKind(file) {
    const extension = (file.extension || file.originalName?.split(".").pop() || "").toLowerCase();
    const mime = (file.mimeType || "").toLowerCase();

    if (mime.startsWith("video/") || ["mp4", "webm", "mov"].includes(extension)) return "video";
    if (mime.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(extension)) return "image";
    if (mime.startsWith("audio/") || ["mp3", "wav", "ogg"].includes(extension)) return "audio";
    if (extension === "pdf" || mime === "application/pdf") return "pdf";
    return "document";
  }

  function formatFileSize(bytes) {
    if (!Number.isFinite(bytes)) return "Taille inconnue";
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
    return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
  }

  async function changeCourseStatus(course, status) {
    const labels = {
      published: "publier",
      archived: "archiver",
      draft: "remettre en brouillon"
    };

    if (!window.confirm(`Veux-tu vraiment ${labels[status]} le cours « ${course.title} » ?`)) {
      return;
    }

    setCoursesError("");

    try {
      const response = await fetch(`/api/courses/${course.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de modifier le statut.");
      }

      await loadCourses();
    } catch (err) {
      setCoursesError(err.message || "Une erreur est survenue.");
    }
  }

  function openCourse(course) {
    setSelectedCourse(course);
    setSelectedChapterIndex(0);
  }

  function renderCourseDetail() {
    if (!selectedCourse) return null;

    const currentCourse = courses.find((course) => course.id === selectedCourse.id) || selectedCourse;
    const chapters = currentCourse.chapters || [];
    const currentChapter = chapters[selectedChapterIndex] || null;
    const files = currentCourse.files || currentCourse.documents || [];

    return (
      <div className="course-detail-page">
        <button className="refresh-button course-back-button" onClick={() => setSelectedCourse(null)}>
          ← Retour au catalogue
        </button>

        <section className="course-detail-hero">
          <span className="course-category">{currentCourse.category}</span>
          <h2>{currentCourse.title}</h2>
          <p>{currentCourse.description}</p>
          <div className="course-meta">
            <span><AppIcon name="target" /> Niveau : {currentCourse.level}</span>
            <span><AppIcon name="book" /> {chapters.length} chapitre(s)</span>
            <span><AppIcon name="paperclip" /> {files.length} ressource(s)</span>
          </div>
        </section>

        <div className="course-detail-layout">
          <aside className="course-chapter-list">
            <h3>Programme du cours</h3>
            {chapters.length === 0 ? (
              <p className="course-detail-muted">Aucun chapitre n'a encore été ajouté.</p>
            ) : chapters.map((chapter, index) => (
              <button
                key={chapter.id || index}
                className={selectedChapterIndex === index ? "course-chapter-button active" : "course-chapter-button"}
                onClick={() => setSelectedChapterIndex(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{chapter.title || `Chapitre ${index + 1}`}</strong>
                <small>{selectedChapterIndex === index ? "En cours" : "Consulter"}</small>
              </button>
            ))}
          </aside>

          <article className="course-lesson-panel">
            {currentChapter ? (
              <>
                <span className="eyebrow">CHAPITRE {selectedChapterIndex + 1} / {chapters.length}</span>
                <h3>{currentChapter.title || `Chapitre ${selectedChapterIndex + 1}`}</h3>
                <div className="course-lesson-content">
                  {currentChapter.content?.trim()
                    ? currentChapter.content.split("\n").map((paragraph, index) => (
                        <p key={index}>{paragraph || " "}</p>
                      ))
                    : <p className="course-detail-muted">Le contenu de ce chapitre n'a pas encore été renseigné.</p>}
                </div>
                <div className="course-lesson-navigation">
                  <button
                    className="refresh-button"
                    disabled={selectedChapterIndex === 0}
                    onClick={() => setSelectedChapterIndex((index) => Math.max(0, index - 1))}
                  >
                    ← Précédent
                  </button>
                  <span>{selectedChapterIndex + 1} / {chapters.length}</span>
                  <button
                    className="course-action-primary"
                    disabled={selectedChapterIndex >= chapters.length - 1}
                    onClick={() => setSelectedChapterIndex((index) => Math.min(chapters.length - 1, index + 1))}
                  >
                    Suivant →
                  </button>
                </div>
              </>
            ) : (
              <div className="course-detail-empty"><AppIcon name="book" /> Aucun chapitre disponible pour le moment.</div>
            )}
          </article>
        </div>

        <section className="course-detail-resources">
          <div>
            <h3><AppIcon name="paperclip" /> Documents et ressources</h3>
            <p>Retrouve ici les fichiers ajoutés par le professeur.</p>
          </div>
          {files.length === 0 ? (
            <p className="course-detail-muted">Aucune ressource n'est associée à ce cours.</p>
          ) : (
            <div className="course-resource-grid">
              {files.map((file) => {
                const kind = getCourseFileKind(file);
                const url = getCourseFileUrl(file);
                return (
                  <div className="course-detail-resource" key={file.id}>
                    <div className="course-resource-name">
                      <span><AppIcon name={kind === "video" ? "video" : kind === "image" ? "image" : kind === "audio" ? "music" : kind === "pdf" ? "pdf" : "file"} /></span>
                      <span>{file.originalName || "Fichier"}<small>{formatFileSize(file.size)}</small></span>
                    </div>
                    {kind === "video" && (
                      <video className="course-video-player" controls preload="metadata" src={url}>
                        Ton navigateur ne peut pas lire cette vidéo.
                      </video>
                    )}
                    {kind === "image" && (
                      <a href={url} target="_blank" rel="noreferrer" className="course-image-link">
                        <img src={url} alt={file.originalName || "Image du cours"} loading="lazy" />
                      </a>
                    )}
                    {kind === "audio" && <audio className="course-audio-player" controls preload="metadata" src={url} />}
                    {(kind === "pdf" || kind === "document") && (
                      <a className="course-resource-link" href={url} target="_blank" rel="noreferrer">
                        {kind === "pdf" ? "Ouvrir / télécharger le PDF" : "Télécharger le fichier"}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  }

  function renderCourses() {
    if (selectedCourse) return renderCourseDetail();

    const statusLabels = {
      draft: "Brouillon",
      published: "Publié",
      archived: "Archivé"
    };

    const countStatus = (status) =>
      courses.filter((course) => course.status === status).length;

    return (
      <div className="courses-page">
        <div className="courses-heading">
          <div>
            <span className="eyebrow">{canManageCourses ? "ESPACE PÉDAGOGIQUE" : "APPRENTISSAGE"}</span>
            <h2>{canManageCourses ? "Gestion des cours" : "Mes cours"}</h2>
            <p>
              {canManageCourses
                ? "Crée, organise et publie les contenus pédagogiques."
                : "Retrouve les cours disponibles sur Roblox Academy."}
            </p>
          </div>
          {canManageCourses && (
            <button className="create-user-button" onClick={() => openCourseEditor()}>
              + Créer un cours
            </button>
          )}
        </div>

        {canManageCourses && (
          <div className="course-summary">
            <div><span>Total</span><strong>{courses.length}</strong></div>
            <div><span>Brouillons</span><strong>{countStatus("draft")}</strong></div>
            <div><span>Publiés</span><strong>{countStatus("published")}</strong></div>
            <div><span>Archivés</span><strong>{countStatus("archived")}</strong></div>
          </div>
        )}

        {coursesError && <div className="account-error">{coursesError}</div>}

        <div className="courses-toolbar">
          <div>
            <h3>Catalogue des cours</h3>
            <small>{courses.length} cours enregistré(s)</small>
          </div>
          <button className="refresh-button" onClick={loadCourses}>↻ Actualiser</button>
        </div>

        {coursesLoading ? (
          <div className="users-empty">Chargement des cours...</div>
        ) : courses.length === 0 ? (
          <div className="courses-empty">
            <span><AppIcon name="book" /></span>
            <strong>Aucun cours pour le moment</strong>
            <p>
              {canManageCourses
                ? "Crée ton premier cours pour commencer à remplir le catalogue."
                : "Les cours publiés apparaîtront ici."}
            </p>
            {canManageCourses && (
              <button className="create-user-button" onClick={() => openCourseEditor()}>
                Créer mon premier cours
              </button>
            )}
          </div>
        ) : (
          <div className="course-grid">
            {courses.map((course) => (
              <article className="course-card" key={course.id}>
                <div className="course-card-top">
                  <span className="course-category">{course.category}</span>
                  {canManageCourses && (
                    <span className={`course-status ${course.status}`}>
                      {statusLabels[course.status] || course.status}
                    </span>
                  )}
                </div>
                <h3>{course.title}</h3>
                <button className="course-open-button" onClick={() => openCourse(course)}>
                  <AppIcon name="book" /> Consulter le cours
                </button>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span><AppIcon name="target" /> {course.level}</span>
                  <span><AppIcon name="book" /> {course.chapters?.length || 0} chapitre(s)</span>
                </div>
                <div className="course-chapter-preview">
                  {(course.chapters || []).slice(0, 3).map((chapter, index) => (
                    <div key={chapter.id || index}>
                      <span>{index + 1}.</span> {chapter.title}
                    </div>
                  ))}
                  {(course.chapters || []).length > 3 && (
                    <small>+ {course.chapters.length - 3} autre(s) chapitre(s)</small>
                  )}
                </div>
                {(course.files || course.documents || []).length > 0 && (
                  <div className="course-resources-preview">
                    <strong><AppIcon name="paperclip" /> Ressources du cours ({(course.files || course.documents || []).length})</strong>
                    {(course.files || course.documents || []).map((file) => {
                      const kind = getCourseFileKind(file);
                      const url = getCourseFileUrl(file);
                      return (
                        <div className="course-resource" key={file.id}>
                          <div className="course-resource-name">
                            <span><AppIcon name={kind === "video" ? "video" : kind === "image" ? "image" : kind === "audio" ? "music" : kind === "pdf" ? "pdf" : "file"} /></span>
                            <span>{file.originalName} <small>{formatFileSize(file.size)}</small></span>
                          </div>
                          {kind === "video" && (
                            <video className="course-video-player" controls preload="metadata" src={url}>
                              Ton navigateur ne peut pas lire cette vidéo.
                            </video>
                          )}
                          {kind === "image" && (
                            <a href={url} target="_blank" rel="noreferrer" className="course-image-link">
                              <img src={url} alt={file.originalName} loading="lazy" />
                            </a>
                          )}
                          {kind === "audio" && <audio className="course-audio-player" controls preload="metadata" src={url} />}
                          {kind !== "video" && kind !== "image" && kind !== "audio" && (
                            <a className="course-resource-link" href={url} target="_blank" rel="noreferrer">
                              {kind === "pdf" ? "Ouvrir / télécharger le PDF" : "Télécharger le fichier"}
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {canManageCourses && (
                  <div className="course-actions">
                    <button className="refresh-button" onClick={() => openCourseEditor(course)}>
                      <AppIcon name="pencil" /> Modifier
                    </button>
                    {course.status === "draft" && (
                      <button className="course-action-primary" onClick={() => changeCourseStatus(course, "published")}>
                        Publier
                      </button>
                    )}
                    {course.status === "published" && (
                      <button className="refresh-button" onClick={() => changeCourseStatus(course, "archived")}>
                        Archiver
                      </button>
                    )}
                    {course.status === "archived" && (
                      <button className="course-action-primary" onClick={() => changeCourseStatus(course, "draft")}>
                        Restaurer
                      </button>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderCourseEditor() {
    if (!courseEditorOpen) return null;

    return (
      <div className="modal-overlay" onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeCourseEditor();
      }}>
        <div className="course-modal">
          <button className="modal-close" onClick={closeCourseEditor}>×</button>
          <span className="eyebrow">ÉDITEUR PÉDAGOGIQUE</span>
          <h2>{editingCourse ? "Modifier le cours" : "Créer un cours"}</h2>
          <p>Renseigne les informations du cours et ajoute son contenu chapitre par chapitre.</p>

          <form onSubmit={saveCourse}>
            <label htmlFor="course-title">Titre du cours</label>
            <input id="course-title" value={courseTitle} onChange={(event) => setCourseTitle(event.target.value)} minLength={3} maxLength={100} placeholder="Exemple : Les bases de Lua" required />

            <label htmlFor="course-description">Description</label>
            <textarea id="course-description" value={courseDescription} onChange={(event) => setCourseDescription(event.target.value)} minLength={5} maxLength={1000} rows={3} placeholder="Présente ce que les élèves vont apprendre..." required />

            <div className="course-form-row">
              <div>
                <label htmlFor="course-category">Catégorie</label>
                <select id="course-category" value={courseCategory} onChange={(event) => setCourseCategory(event.target.value)}>
                  <option>Programmation</option>
                  <option>Roblox Studio</option>
                  <option>Modélisation 3D</option>
                  <option>Game design</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label htmlFor="course-level">Niveau</label>
                <select id="course-level" value={courseLevel} onChange={(event) => setCourseLevel(event.target.value)}>
                  <option>Débutant</option>
                  <option>Intermédiaire</option>
                  <option>Avancé</option>
                </select>
              </div>
            </div>

            <div className="chapters-heading">
              <h3><AppIcon name="book" /> Chapitres ({courseChapters.length})</h3>
              <button type="button" className="refresh-button" onClick={addChapter}>+ Ajouter un chapitre</button>
            </div>

            {courseChapters.map((chapter, index) => (
              <div className="chapter-editor" key={chapter.id || index}>
                <div className="chapter-editor-heading">
                  <strong>Chapitre {index + 1}</strong>
                  <button type="button" onClick={() => removeChapter(index)} disabled={courseChapters.length === 1}>Supprimer</button>
                </div>
                <label htmlFor={`chapter-title-${index}`}>Titre du chapitre</label>
                <input id={`chapter-title-${index}`} value={chapter.title} onChange={(event) => updateChapter(index, "title", event.target.value)} maxLength={120} required />
                <label htmlFor={`chapter-content-${index}`}>Contenu du chapitre</label>
                <textarea id={`chapter-content-${index}`} value={chapter.content} onChange={(event) => updateChapter(index, "content", event.target.value)} maxLength={20000} rows={5} placeholder="Écris ici la leçon, les explications et les exemples..." />
              </div>
            ))}

            <section className="course-documents-editor">
              <div>
                <h3><AppIcon name="paperclip" /> Ressources du cours</h3>
                <p>Ajoute des documents, vidéos, images ou fichiers audio. 20 fichiers maximum par cours, 100 Mo maximum chacun.</p>
              </div>
              <label className="pdf-upload-label" htmlFor="course-resource-files">＋ Ajouter des fichiers</label>
              <input
                id="course-resource-files"
                className="pdf-file-input"
                type="file"
                accept=".pdf,.doc,.docx,.odt,.txt,.ppt,.pptx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.gif,.webp,.mp4,.webm,.mov,.mp3,.wav,.ogg,.zip"
                multiple
                onChange={(event) => {
                  const selected = Array.from(event.target.files || []);
                  const allowedExtensions = ["pdf", "doc", "docx", "odt", "txt", "ppt", "pptx", "xls", "xlsx", "csv", "png", "jpg", "jpeg", "gif", "webp", "mp4", "webm", "mov", "mp3", "wav", "ogg", "zip"];
                  const accepted = selected.filter((file) => {
                    const extension = file.name.split(".").pop()?.toLowerCase();
                    return allowedExtensions.includes(extension);
                  });
                  const withinSize = accepted.filter((file) => file.size <= 100 * 1024 * 1024);
                  const availableSlots = Math.max(0, 20 - courseFiles.length - pendingCourseFiles.length);

                  if (accepted.length !== selected.length) {
                    setCourseFormError("Certains fichiers ont un format non autorisé.");
                  } else if (withinSize.length !== accepted.length) {
                    setCourseFormError("Chaque fichier doit faire 100 Mo maximum.");
                  } else if (withinSize.length > availableSlots) {
                    setCourseFormError(`Il reste ${availableSlots} emplacement(s) disponible(s) pour ce cours.`);
                  } else {
                    setCourseFormError("");
                  }

                  setPendingCourseFiles((current) => [
                    ...current,
                    ...withinSize.slice(0, availableSlots)
                  ]);
                  event.target.value = "";
                }}
              />

              {courseFiles.length > 0 && (
                <div className="course-document-list">
                  <strong>Fichiers déjà enregistrés</strong>
                  {courseFiles.map((file) => (
                    <div className="course-document-row" key={file.id}>
                      <span><AppIcon name="paperclip" /> {file.originalName} <small>({formatFileSize(file.size)})</small></span>
                      <a href={getCourseFileUrl(file)} target="_blank" rel="noreferrer">Ouvrir</a>
                    </div>
                  ))}
                  <small>Les fichiers déjà enregistrés sont conservés lorsque tu modifies le cours.</small>
                </div>
              )}

              {pendingCourseFiles.length > 0 && (
                <div className="course-document-list">
                  <strong>Fichiers en attente d'envoi ({pendingCourseFiles.length})</strong>
                  {pendingCourseFiles.map((file, index) => (
                    <div className="course-document-row" key={`${file.name}-${index}`}>
                      <span><AppIcon name="paperclip" /> {file.name} <small>({formatFileSize(file.size)})</small></span>
                      <button type="button" onClick={() => setPendingCourseFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}>Retirer</button>
                    </div>
                  ))}
                </div>
              )}
              <small className="course-upload-note">Formats acceptés : PDF, Word, PowerPoint, Excel, TXT, CSV, images, MP4, WebM, MOV, MP3, WAV, OGG et ZIP.</small>
            </section>

            {courseFormError && <div className="account-error">{courseFormError}</div>}
            <button className="modal-submit" type="submit" disabled={courseSaving || filesBusy}>
              {courseSaving ? "Enregistrement..." : "Enregistrer le cours"}
            </button>
            <button className="modal-cancel" type="button" onClick={closeCourseEditor}>Annuler</button>
          </form>
        </div>
      </div>
    );
  }

  async function saveProfile(event) {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");
    setProfileSaving(true);

    try {
      const formData = new FormData();
      formData.append("username", profileUsername.trim());
      if (profileAvatarFile) formData.append("avatar", profileAvatarFile);

      const response = await fetch("/api/profile", {
        method: "PATCH",
        credentials: "include",
        body: formData
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Impossible de modifier le profil.");
      }

      setUser((current) => ({ ...current, ...data.user }));
      setProfileUsername(data.user?.username || profileUsername.trim());
      setProfileAvatarFile(null);
      setProfileFileInputKey((key) => key + 1);
      setProfileMessage(data.message || "Profil mis à jour.");
    } catch (err) {
      setProfileError(err.message || "Une erreur est survenue.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function loadAdminSettingsData() {
    setActivityLoading(true);
    setBackupsLoading(true);
    setActivityError("");
    setBackupsError("");

    const [activityResult, backupResult] = await Promise.allSettled([
      fetch("/api/activity", { credentials: "include" }).then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Impossible de charger le journal.");
        return data.activities || [];
      }),
      fetch("/api/backups", { credentials: "include" }).then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Impossible de charger les sauvegardes.");
        return data.backups || [];
      })
    ]);

    if (activityResult.status === "fulfilled") setActivity(activityResult.value);
    else setActivityError(activityResult.reason?.message || "Erreur de chargement du journal.");

    if (backupResult.status === "fulfilled") setBackups(backupResult.value);
    else setBackupsError(backupResult.reason?.message || "Erreur de chargement des sauvegardes.");

    setActivityLoading(false);
    setBackupsLoading(false);
  }

  async function createManualBackup() {
    setBackupsError("");
    setBackupCreating(true);
    try {
      const response = await fetch("/api/backups", {
        method: "POST",
        credentials: "include"
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Impossible de créer la sauvegarde.");
      await loadAdminSettingsData();
    } catch (err) {
      setBackupsError(err.message || "Erreur pendant la création de la sauvegarde.");
    } finally {
      setBackupCreating(false);
    }
  }

  async function restoreBackup(backup) {
    const confirmed = window.confirm(`Restaurer la sauvegarde « ${backup.id} » ? Les données actuelles seront remplacées.`);
    if (!confirmed) return;

    setBackupsError("");
    setBackupRestoring(backup.id);
    try {
      const response = await fetch(`/api/backups/${encodeURIComponent(backup.id)}/restore`, {
        method: "POST",
        credentials: "include"
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Impossible de restaurer cette sauvegarde.");
      await loadAdminSettingsData();
      window.alert(data.message || "Sauvegarde restaurée.");
    } catch (err) {
      setBackupsError(err.message || "Erreur pendant la restauration.");
    } finally {
      setBackupRestoring("");
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Connexion impossible.");
        return;
      }

      setUser(data.user);
      setPassword("");
      setActiveSection("overview");
      setPage("dashboard");
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });

      if (!response.ok) {
        setError("La déconnexion a échoué.");
        return;
      }

      setUser(null);
      setUsername("");
      setPassword("");
      setError("");
      setPage("home");
    } catch {
      setError("Erreur lors de la déconnexion.");
    }
  }

  function openModal(type, account = null) {
    setModalError("");
    setFormUsername(account?.username || "");
    setFormPassword("");
    setFormRole(account?.role || "eleve");

    setModal({ type, account });
  }

  function closeModal() {
    if (modalLoading) return;

    setModal(null);
    setModalError("");
    setFormPassword("");
  }

  async function handleModalSubmit(event) {
    event.preventDefault();
    setModalError("");
    setModalLoading(true);

    try {
      let url = "/api/users";
      let method = "POST";
      let body = {};

      if (modal.type === "create") {
        body = {
          username: formUsername,
          password: formPassword,
          role: formRole
        };
      }

      if (modal.type === "edit") {
        url = `/api/users/${modal.account.id}`;
        method = "PATCH";
        body = {
          username: formUsername,
          role: formRole
        };
      }

      if (modal.type === "password") {
        url = `/api/users/${modal.account.id}/password`;
        method = "PATCH";
        body = { password: formPassword };
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue.");
      }

      setModal(null);
      setFormPassword("");
      await loadUsers();
    } catch (err) {
      setModalError(err.message || "Impossible d'effectuer cette opération.");
    } finally {
      setModalLoading(false);
    }
  }

  async function toggleAccount(account) {
    const action = account.disabled ? "réactiver" : "désactiver";

    if (!window.confirm(`Veux-tu vraiment ${action} le compte ${account.username} ?`)) {
      return;
    }

    setUsersError("");

    try {
      const response = await fetch(`/api/users/${account.id}/status`, {
        method: "PATCH",
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de modifier le compte.");
      }

      await loadUsers();
    } catch (err) {
      setUsersError(err.message || "Une erreur est survenue.");
    }
  }

  function renderOverview() {
    const activeUsers = users.filter((account) => !account.disabled).length;

    return (
      <>
        <div className="welcome-panel">
          <div>
            <span className="eyebrow">ESPACE FONDATEUR</span>
            <h2>{serverConfig.dashboardWelcomeTitle || "Bienvenue"}, {user?.username} !</h2>
            <p>{serverConfig.dashboardWelcomeText || "Voici un aperçu de ton établissement Roblox Academy."}</p>
          </div>
          <div className="welcome-decoration"><AppIcon name="graduation" size={34} /></div>
        </div>

        <h3 className="section-heading">{serverConfig.dashboardOverviewTitle || "Vue d’ensemble"}</h3>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple"><AppIcon name="users" size={22} /></div>
            <span>Comptes</span>
            <strong>{users.length || "À consulter"}</strong>
            <small>{users.length ? `${activeUsers} comptes actifs` : "Gestion des utilisateurs"}</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue"><AppIcon name="book" size={22} /></div>
            <span>Cours</span>
            <strong>À configurer</strong>
            <small>Contenus pédagogiques</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon green"><AppIcon name="chart" size={22} /></div>
            <span>Notes</span>
            <strong>À configurer</strong>
            <small>Suivi des résultats</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange"><AppIcon name="bell" size={22} /></div>
            <span>Notifications</span>
            <strong>À configurer</strong>
            <small>Actualités de la plateforme</small>
          </div>
        </div>

        <h3 className="section-heading">{serverConfig.dashboardQuickTitle || "Accès rapides"}</h3>

        <div className="quick-grid">
          <button onClick={() => setActiveSection("users")}>
            <span><AppIcon name="users" /></span>
            <div>
              <strong>Gérer les comptes</strong>
              <small>Élèves, professeurs et administrateurs</small>
            </div>
            <b>→</b>
          </button>

          <button onClick={() => setActiveSection("courses")}>
            <span><AppIcon name="book" /></span>
            <div>
              <strong>Gérer les cours</strong>
              <small>Créer et organiser les cours</small>
            </div>
            <b>→</b>
          </button>
        </div>
      </>
    );
  }

  function renderUsers() {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredUsers = users.filter((account) => {
      const matchesSearch = account.username
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesRole =
        roleFilter === "tous" || account.role === roleFilter;

      const matchesStatus =
        statusFilter === "tous" ||
        (statusFilter === "actif" && !account.disabled) ||
        (statusFilter === "desactive" && account.disabled);

      return matchesSearch && matchesRole && matchesStatus;
    });

    const countRole = (role) =>
      users.filter((account) => account.role === role).length;

    return (
      <div className="users-page">
        <div className="users-heading">
          <div>
            <span className="eyebrow">ADMINISTRATION</span>
            <h2>Gestion des comptes</h2>
            <p>Retrouve et administre les utilisateurs de Roblox Academy.</p>
          </div>

          <button className="create-user-button" onClick={() => openModal("create")}>
            + Créer un compte
          </button>
        </div>

        <div className="user-summary">
          <div>
            <span>Total des comptes</span>
            <strong>{users.length}</strong>
          </div>
          <div>
            <span>Élèves</span>
            <strong>{countRole("eleve")}</strong>
          </div>
          <div>
            <span>Professeurs</span>
            <strong>{countRole("professeur")}</strong>
          </div>
          <div>
            <span>Administrateurs</span>
            <strong>{countRole("administrateur")}</strong>
          </div>
          <div>
            <span>Comptes actifs</span>
            <strong>{users.filter((account) => !account.disabled).length}</strong>
          </div>
          <div>
            <span>Comptes désactivés</span>
            <strong>{users.filter((account) => account.disabled).length}</strong>
          </div>
        </div>

        {usersError && <div className="account-error">{usersError}</div>}

        <div className="users-table-container">
          <div className="users-table-title">
            <div>
              <h3>Liste des utilisateurs</h3>
              <small>{filteredUsers.length} résultat(s) affiché(s)</small>
            </div>
            <button className="refresh-button" onClick={loadUsers}>
              ↻ Actualiser
            </button>
          </div>

          <div className="user-filters">
            <div className="search-wrapper">
              <span><AppIcon name="search" /></span>
              <input
                type="search"
                placeholder="Rechercher un identifiant..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              aria-label="Filtrer par rôle"
            >
              <option value="tous">Tous les rôles</option>
              <option value="fondateur">Fondateur</option>
              <option value="administrateur">Administrateurs</option>
              <option value="professeur">Professeurs</option>
              <option value="eleve">Élèves</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filtrer par statut"
            >
              <option value="tous">Tous les statuts</option>
              <option value="actif">Actifs</option>
              <option value="desactive">Désactivés</option>
            </select>
          </div>

          {usersLoading ? (
            <div className="users-empty">Chargement des comptes...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="users-empty">
              <span><AppIcon name="search" /></span>
              <strong>Aucun résultat</strong>
              <p>Essaie de modifier ta recherche ou tes filtres.</p>
              <button
                className="refresh-button"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("tous");
                  setStatusFilter("tous");
                }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="accounts-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((account) => (
                    <tr key={account.id}>
                      <td>
                        <button
                          className="account-name-button"
                          onClick={() => openModal("details", account)}
                        >
                          {account.username}
                        </button>
                        <small className="account-date">
                          Créé le{" "}
                          {account.createdAt
                            ? new Date(account.createdAt).toLocaleDateString("fr-FR")
                            : "Date inconnue"}
                        </small>
                      </td>

                      <td>
                        <span className={`role-badge ${account.role}`}>
                          {roleLabels[account.role] || account.role}
                        </span>
                      </td>

                      <td>
                        <span className={account.disabled ? "status-badge disabled" : "status-badge active"}>
                          {account.disabled ? "Désactivé" : "Actif"}
                        </span>
                      </td>

                      <td>
                        {account.role === "fondateur" ? (
                          <span className="protected-account">Compte protégé <AppIcon name="crown" size={14} /></span>
                        ) : (
                          <div className="account-actions">
                            <button
                              title="Modifier le compte"
                              onClick={() => openModal("edit", account)}
                            >
                              <AppIcon name="pencil" />
                            </button>

                            <button
                              title="Réinitialiser le mot de passe"
                              onClick={() => openModal("password", account)}
                            >
                              <AppIcon name="key" />
                            </button>

                            <button
                              title={account.disabled ? "Réactiver" : "Désactiver"}
                              onClick={() => toggleAccount(account)}
                            >
                              {account.disabled ? <AppIcon name="check" /> : <AppIcon name="ban" />}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="account-info">
          <span><AppIcon name="shieldLock" /></span>
          Les mots de passe ne sont jamais affichés. Ils sont enregistrés sous forme hachée.
        </div>
      </div>
    );
  }

  function renderModal() {
    if (!modal) return null;

    const isCreate = modal.type === "create";
    const isEdit = modal.type === "edit";
    const isPassword = modal.type === "password";
    const isDetails = modal.type === "details";
    const account = modal.account;

    return (
      <div
        className="modal-overlay"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}
      >
        <div className="account-modal">
          <button className="modal-close" onClick={closeModal}>×</button>

          <span className="eyebrow">GESTION DES COMPTES</span>

          <h2>
            {isCreate && "Créer un compte"}
            {isEdit && "Modifier le compte"}
            {isPassword && "Réinitialiser le mot de passe"}
            {isDetails && "Fiche utilisateur"}
          </h2>

          {isDetails ? (
            <>
              <div className="detail-avatar"><AppIcon name="user" size={30} /></div>

              <h3 className="detail-username">{account.username}</h3>

              <div className="detail-list">
                <div>
                  <span>Identifiant</span>
                  <strong>{account.username}</strong>
                </div>
                <div>
                  <span>Rôle</span>
                  <strong>{roleLabels[account.role] || account.role}</strong>
                </div>
                <div>
                  <span>Statut</span>
                  <strong>{account.disabled ? "Désactivé" : "Actif"}</strong>
                </div>
                <div>
                  <span>Date de création</span>
                  <strong>
                    {account.createdAt
                      ? new Date(account.createdAt).toLocaleString("fr-FR")
                      : "Inconnue"}
                  </strong>
                </div>
                <div>
                  <span>Identifiant technique</span>
                  <strong className="detail-id">{account.id}</strong>
                </div>
              </div>

              <p className="detail-security">
                <AppIcon name="lock" /> Aucune information de mot de passe n'est affichée dans cette fiche.
              </p>

              <button className="modal-submit" onClick={closeModal}>
                Fermer la fiche
              </button>
            </>
          ) : (
            <>
              <p>
                {isCreate && "Ajoute un nouvel utilisateur à Roblox Academy."}
                {isEdit && `Modification du compte ${account.username}.`}
                {isPassword && `Définis un nouveau mot de passe pour ${account.username}.`}
              </p>

              <form onSubmit={handleModalSubmit}>
                {!isPassword && (
                  <>
                    <label htmlFor="account-username">Identifiant</label>
                    <input
                      id="account-username"
                      value={formUsername}
                      onChange={(event) => setFormUsername(event.target.value)}
                      placeholder="Exemple : joueur123"
                      minLength={3}
                      maxLength={24}
                      pattern="[a-zA-Z0-9_-]+"
                      required
                    />

                    <label htmlFor="account-role">Rôle</label>
                    <select
                      id="account-role"
                      value={formRole}
                      onChange={(event) => setFormRole(event.target.value)}
                    >
                      <option value="eleve">Élève</option>
                      <option value="professeur">Professeur</option>
                      <option value="administrateur">Administrateur</option>
                    </select>
                  </>
                )}

                {(isCreate || isPassword) && (
                  <>
                    <label htmlFor="account-password">Mot de passe</label>
                    <input
                      id="account-password"
                      type="password"
                      value={formPassword}
                      onChange={(event) => setFormPassword(event.target.value)}
                      placeholder="12 caractères minimum"
                      minLength={12}
                      autoComplete="new-password"
                      required
                    />
                    <small className="form-help">
                      Le mot de passe doit contenir au moins 12 caractères.
                    </small>
                  </>
                )}

                {modalError && <div className="account-error">{modalError}</div>}

                <button className="modal-submit" type="submit" disabled={modalLoading}>
                  {modalLoading ? "Enregistrement..." : "Enregistrer"}
                </button>

                <button className="modal-cancel" type="button" onClick={closeModal}>
                  Annuler
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  function renderAssignments() {
    const students = users.filter((account) => account.role === "eleve" && !account.disabled);
    const visibleAssignments = assignments.filter((assignment) => {
      if (assignmentFilter !== "tous" && assignment.type !== assignmentFilter) return false;
      return true;
    });
    const typeLabels = {
      normal: "Devoir normal",
      supplementaire: "Travail supplémentaire",
      punition: "Punition"
    };

    return (
      <div className="assignments-page">
        <div className="users-heading">
          <div>
            <span className="eyebrow">{canManageAssignments ? "ESPACE PÉDAGOGIQUE" : "MON ESPACE"}</span>
            <h2>Travail à faire</h2>
            <p>{canManageAssignments ? "Crée et distribue des devoirs à toute la classe ou à un élève." : "Retrouve les devoirs qui te sont destinés."}</p>
          </div>
          {canManageAssignments && (
            <button className="create-user-button" onClick={openAssignmentModal}>＋ Créer un devoir</button>
          )}
        </div>

        {assignmentsError && <div className="account-error">{assignmentsError}</div>}

        <div className="assignments-toolbar">
          <div>
            <h3>Liste des devoirs</h3>
            <small>{visibleAssignments.length} devoir(s) affiché(s)</small>
          </div>
          <div className="assignments-toolbar-actions">
            <select value={assignmentFilter} onChange={(event) => setAssignmentFilter(event.target.value)} aria-label="Filtrer les devoirs">
              <option value="tous">Tous les types</option>
              <option value="normal">Devoirs normaux</option>
              <option value="supplementaire">Travaux supplémentaires</option>
              <option value="punition">Punitions</option>
            </select>
            <button className="refresh-button" onClick={loadAssignments}>↻ Actualiser</button>
          </div>
        </div>

        {assignmentsLoading ? (
          <div className="users-empty">Chargement des devoirs...</div>
        ) : visibleAssignments.length === 0 ? (
          <div className="courses-empty">
            <span><AppIcon name="clipboard" /></span>
            <strong>Aucun devoir pour le moment</strong>
            <p>{canManageAssignments ? "Crée un devoir pour le faire apparaître ici." : "Tes nouveaux devoirs apparaîtront ici."}</p>
          </div>
        ) : (
          <div className="assignment-grid">
            {visibleAssignments.map((assignment) => (
              <article className="assignment-card" key={assignment.id}>
                <div className="assignment-card-top">
                  <span className={`assignment-type ${assignment.type || "normal"}`}>{typeLabels[assignment.type] || "Devoir"}</span>
                  <span className="assignment-target">{assignment.targetUsername || (assignment.targetStudentId ? "Élève ciblé" : "Toute la classe")}</span>
                </div>
                <span className="assignment-subject">{assignment.subject || "Matière non précisée"}</span>
                <h3>{assignment.title}</h3>
                <p>{assignment.description || "Aucune consigne supplémentaire."}</p>
                <div className="assignment-due">
                  <span><AppIcon name="calendar" /> Date limite</span>
                  <strong>{assignment.dueDate ? new Date(`${assignment.dueDate}T00:00:00`).toLocaleDateString("fr-FR") : "Aucune date limite"}</strong>
                </div>
                {assignment.createdAt && (
                  <small className="assignment-created">Ajouté le {new Date(assignment.createdAt).toLocaleDateString("fr-FR")}</small>
                )}
                {canManageAssignments && (
                  <div className="assignment-actions">
                    <button type="button" className="assignment-edit-button" onClick={() => openEditAssignment(assignment)}><AppIcon name="pencil" /> Modifier</button>
                    <button type="button" className="assignment-delete-button" onClick={() => deleteAssignment(assignment)}><AppIcon name="trash" /> Supprimer</button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {assignmentModalOpen && (
          <div className="modal-overlay" onMouseDown={(event) => {
            if (event.target === event.currentTarget && !assignmentSaving) setAssignmentModalOpen(false);
          }}>
            <div className="assignment-modal">
              <button className="modal-close" onClick={() => !assignmentSaving && setAssignmentModalOpen(false)}>×</button>
              <span className="eyebrow">ESPACE PÉDAGOGIQUE</span>
              <h2>{editingAssignment ? "Modifier le devoir" : "Créer un devoir"}</h2>
              <p>Renseigne les consignes, le destinataire et la date limite.</p>
              <form onSubmit={saveAssignment}>
                <label htmlFor="assignment-title">Titre du devoir</label>
                <input id="assignment-title" value={assignmentTitle} onChange={(event) => setAssignmentTitle(event.target.value)} minLength={3} maxLength={120} placeholder="Exemple : Exercice sur les variables" required />

                <label htmlFor="assignment-subject">Matière</label>
                <select id="assignment-subject" value={assignmentSubject} onChange={(event) => setAssignmentSubject(event.target.value)} required>
                  <option>Programmation</option>
                  <option>Roblox Studio</option>
                  <option>Génie électrique</option>
                  <option>Mathématiques</option>
                  <option>Français</option>
                  <option>Anglais</option>
                  <option>Physique-chimie</option>
                  <option>Histoire-géographie</option>
                  <option>Économie-gestion</option>
                  <option>Autre</option>
                </select>

                <label htmlFor="assignment-description">Consignes</label>
                <textarea id="assignment-description" value={assignmentDescription} onChange={(event) => setAssignmentDescription(event.target.value)} minLength={3} maxLength={5000} rows={5} placeholder="Décris le travail à réaliser..." required />

                <label htmlFor="assignment-target">Destinataire</label>
                <select id="assignment-target" value={assignmentTarget} onChange={(event) => setAssignmentTarget(event.target.value)}>
                  <option value="class">Toute la classe</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>{student.username}</option>
                  ))}
                </select>

                <label htmlFor="assignment-type">Type de travail</label>
                <select id="assignment-type" value={assignmentType} onChange={(event) => setAssignmentType(event.target.value)}>
                  <option value="normal">Devoir normal</option>
                  <option value="supplementaire">Travail supplémentaire</option>
                  <option value="punition">Punition</option>
                </select>

                <label htmlFor="assignment-due-date">Date limite</label>
                <input id="assignment-due-date" type="date" value={assignmentDueDate} onChange={(event) => setAssignmentDueDate(event.target.value)} />

                {assignmentsError && <div className="account-error">{assignmentsError}</div>}
                <button className="modal-submit" type="submit" disabled={assignmentSaving}>
                  {assignmentSaving ? "Enregistrement..." : editingAssignment ? "Enregistrer les modifications" : "Créer le devoir"}
                </button>
                <button className="modal-cancel" type="button" onClick={() => setAssignmentModalOpen(false)} disabled={assignmentSaving}>Annuler</button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderSettings() {
    const permissions = [
      { role: "Fondateur", description: "Accès complet à la plateforme et à l'administration." },
      { role: "Administrateur", description: "Gestion des comptes et des contenus selon les autorisations accordées." },
      { role: "Professeur", description: "Gestion des cours, des devoirs et des notes de ses élèves." },
      { role: "Élève", description: "Consultation de ses cours, devoirs, notes et résultats personnels." }
    ];

    function savePreferences() {
      try {
        localStorage.setItem("ra-settings-compact", String(settingsCompact));
        localStorage.setItem("ra-settings-accent", settingsAccent);
        setSettingsSaved(true);
        window.setTimeout(() => setSettingsSaved(false), 2500);
      } catch {
        setSettingsSaved(false);
        window.alert("Le navigateur n'a pas pu enregistrer ces préférences.");
      }
    }

    return (
      <div className={`settings-page ${settingsCompact ? "settings-compact" : ""}`} data-accent={settingsAccent}>
        <div className="settings-heading">
          <div>
            <span className="eyebrow">CONFIGURATION</span>
            <h2>Paramètres</h2>
            <p>Gère les informations de ton compte et les préférences de Roblox Academy.</p>
          </div>
          <div className="settings-heading-icon"><AppIcon name="settings" size={26} /></div>
        </div>

        <section className="settings-card">
          <div className="settings-card-heading">
            <span className="settings-icon"><AppIcon name="user" /></span>
            <div><h3>Mon compte</h3><p>Informations de ta session actuelle.</p></div>
          </div>
          <div className="settings-profile-layout">
            <div className="settings-profile-avatar">
              {user?.avatarUrl ? <img src={user.avatarUrl} alt="Photo de profil" /> : <span><AppIcon name="user" size={32} /></span>}
            </div>
            <div className="settings-profile-details">
              <div className="settings-info-grid">
                <div><span>Identifiant actuel</span><strong>{user?.username || "Non renseigné"}</strong></div>
                <div><span>Rôle</span><strong>{roleLabels[user?.role] || user?.role || "Inconnu"}</strong></div>
                <div><span>État du compte</span><strong className="settings-status">● Connecté</strong></div>
              </div>
              <form className="settings-profile-form" onSubmit={saveProfile}>
                <label className="settings-field-label" htmlFor="profile-username">Modifier l'identifiant</label>
                <input id="profile-username" value={profileUsername} onChange={(event) => setProfileUsername(event.target.value)} minLength={3} maxLength={24} pattern="[a-zA-Z0-9_-]+" autoComplete="username" required />
                <label className="settings-field-label" htmlFor="profile-avatar">Photo de profil (PNG, JPG ou WEBP, 5 Mo maximum)</label>
                <input key={profileFileInputKey} id="profile-avatar" className="settings-file-input" type="file" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp" onChange={(event) => setProfileAvatarFile(event.target.files?.[0] || null)} />
                {profileAvatarFile && <small className="settings-note">Fichier choisi : {profileAvatarFile.name}</small>}
                {profileError && <div className="account-error">{profileError}</div>}
                {profileMessage && <div className="settings-success">{profileMessage}</div>}
                <div className="settings-actions">
                  <button className="settings-primary" type="submit" disabled={profileSaving}>{profileSaving ? "Enregistrement..." : "Enregistrer mon profil"}</button>
                </div>
              </form>
            </div>
          </div>
          <p className="settings-note">Ton mot de passe n'est jamais affiché ici. La modification de l'identifiant et de la photo est enregistrée sur le serveur.</p>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <span className="settings-icon"><AppIcon name="palette" /></span>
            <div><h3>Personnalisation</h3><p>Choisis l'apparence de ton espace sur cet appareil.</p></div>
          </div>
          <label className="settings-field-label" htmlFor="settings-accent">Couleur principale</label>
          <select id="settings-accent" value={settingsAccent} onChange={(event) => setSettingsAccent(event.target.value)}>
            <option value="violet">Violet</option>
            <option value="blue">Bleu</option>
            <option value="green">Vert</option>
          </select>
          <label className="settings-toggle">
            <span><strong>Affichage compact</strong><small>Réduit les espacements dans la page des paramètres.</small></span>
            <input type="checkbox" checked={settingsCompact} onChange={(event) => setSettingsCompact(event.target.checked)} />
          </label>
          <div className="settings-actions">
            <button className="settings-primary" type="button" onClick={savePreferences}>Enregistrer les préférences</button>
            {settingsSaved && <span className="settings-success">Préférences enregistrées sur cet appareil.</span>}
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <span className="settings-icon"><AppIcon name="shield" /></span>
            <div><h3>Rôles et permissions</h3><p>Récapitulatif des accès prévus dans la plateforme.</p></div>
          </div>
          <div className="settings-permissions">
            {permissions.map((item) => (
              <div className="settings-permission-row" key={item.role}>
                <strong>{item.role}</strong><span>{item.description}</span>
              </div>
            ))}
          </div>
          <p className="settings-note">Les permissions réelles restent contrôlées par le serveur. Cette page affiche leur répartition, elle ne permet pas de contourner les règles d'accès.</p>
        </section>

        <section className="settings-card settings-site-card">
          <div className="settings-card-heading">
            <span className="settings-icon"><AppIcon name="school" /></span>
            <div><h3>Informations de la plateforme</h3><p>Identité générale de ton espace éducatif.</p></div>
          </div>
          <div className="settings-info-grid">
            <div><span>Nom</span><strong>Roblox Academy</strong></div>
            <div><span>Type</span><strong>Plateforme éducative</strong></div>
            <div><span>Connexion API</span><strong>{apiStatus}</strong></div>
          </div>
        </section>

        {user?.role === "fondateur" && (
          <>
            <section className="settings-card">
              <div className="settings-card-heading">
                <span className="settings-icon"><AppIcon name="clock" /></span>
                <div><h3>Journal d'activité</h3><p>Historique des dernières actions réalisées sur la plateforme.</p></div>
              </div>
              <div className="settings-actions">
                <button className="refresh-button" type="button" onClick={loadAdminSettingsData} disabled={activityLoading || backupsLoading}>↻ Actualiser</button>
                <span className="settings-muted">Jusqu'à 300 événements récents</span>
              </div>
              {activityError && <div className="account-error">{activityError}</div>}
              {activityLoading ? <p className="settings-note">Chargement du journal...</p> : activity.length === 0 ? <p className="settings-note">Aucune activité enregistrée pour le moment.</p> : (
                <div className="settings-activity-list">
                  {activity.map((item, index) => (
                    <article className="settings-activity-item" key={item.id || item.timestamp || index}>
                      <div><strong>{item.action || "Action"}</strong><small>{item.username || "Utilisateur inconnu"} · {item.details || ""}</small></div>
                      <time>{item.createdAt || item.timestamp ? new Date(item.createdAt || item.timestamp).toLocaleString("fr-FR") : "Date inconnue"}</time>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="settings-card">
              <div className="settings-card-heading">
                <span className="settings-icon"><AppIcon name="database" /></span>
                <div><h3>Sauvegardes</h3><p>Crée une copie manuelle ou restaure une sauvegarde existante.</p></div>
              </div>
              <div className="settings-actions">
                <button className="settings-primary" type="button" onClick={createManualBackup} disabled={backupCreating}>{backupCreating ? "Création..." : "＋ Créer une sauvegarde"}</button>
                <button className="refresh-button" type="button" onClick={loadAdminSettingsData} disabled={backupsLoading}>↻ Actualiser</button>
              </div>
              {backupsError && <div className="account-error">{backupsError}</div>}
              {backupsLoading ? <p className="settings-note">Chargement des sauvegardes...</p> : backups.length === 0 ? <p className="settings-note">Aucune sauvegarde disponible pour le moment.</p> : (
                <div className="settings-backup-list">
                  {backups.map((backup, index) => (
                    <article className="settings-backup-item" key={backup.id || index}>
                      <div><strong>{backup.reason || "Sauvegarde"}</strong><small>{backup.createdAt || backup.timestamp ? new Date(backup.createdAt || backup.timestamp).toLocaleString("fr-FR") : backup.id}</small></div>
                      <button className="refresh-button" type="button" onClick={() => restoreBackup(backup)} disabled={Boolean(backupRestoring)}>{backupRestoring === backup.id ? "Restauration..." : "Restaurer"}</button>
                    </article>
                  ))}
                </div>
              )}
              <p className="settings-note">La restauration remplace les données actuelles. Une confirmation est demandée avant chaque restauration.</p>
            </section>
          </>
        )}

        <div className="settings-footer-note">
          <span><AppIcon name="lock" /></span>
          Les outils d'administration sont réservés au compte fondateur. Les sauvegardes et le journal sont servis par le backend.
        </div>
      </div>
    );
  }

  function mapServerSettingsFromApi(settings) {
    return {
      siteName: settings.siteName || "Roblox Academy",
      headerName: settings.headerName || settings.siteName || "Roblox Academy",
      logoText: settings.shortName || "RA",
      description: settings.description || "La plateforme scolaire de Roblox Academy.",
      welcomeTitle: settings.home?.title || "Bienvenue sur Roblox Academy",
      welcomeText: settings.home?.subtitle || "Apprends, progresse et retrouve tes cours au même endroit.",
      welcomeMessage: settings.home?.welcomeMessage || "Connecte-toi pour accéder à ton espace personnel.",
      logoUrl: settings.logoUrl || "",
      faviconUrl: settings.iconUrl || "",
      primaryColor: settings.colors?.primary || "#7662d8",
      secondaryColor: settings.colors?.secondary || "#25213f",
      accentColor: settings.colors?.accent || "#a78bfa",
      backgroundColor: settings.colors?.background || "#0b1020",
      theme: settings.theme === "light" ? "light" : "dark",
      dashboardWelcomeTitle: settings.dashboard?.welcomeTitle || "Bienvenue",
      dashboardWelcomeText: settings.dashboard?.welcomeText || "Voici un aperçu de ton établissement Roblox Academy.",
      dashboardOverviewTitle: settings.dashboard?.overviewTitle || "Vue d’ensemble",
      dashboardQuickTitle: settings.dashboard?.quickTitle || "Accès rapides"
    };
  }

  function mapServerSettingsToApi(config) {
    return {
      siteName: config.siteName,
      shortName: config.logoText,
      description: config.description,
      headerName: config.headerName,
      logoUrl: config.logoUrl,
      iconUrl: config.faviconUrl,
      theme: config.theme,
      colors: {
        primary: config.primaryColor,
        secondary: config.secondaryColor,
        accent: config.accentColor,
        background: config.backgroundColor
      },
      home: {
        title: config.welcomeTitle,
        subtitle: config.welcomeText,
        welcomeMessage: config.welcomeMessage
      },
      dashboard: {
        welcomeTitle: config.dashboardWelcomeTitle,
        welcomeText: config.dashboardWelcomeText,
        overviewTitle: config.dashboardOverviewTitle,
        quickTitle: config.dashboardQuickTitle
      }
    };
  }

  async function loadServerSettings() {
    setServerLoading(true);
    try {
      const response = await fetch("/api/server-settings", {
        credentials: "include"
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success || !data.settings) {
        throw new Error(data.message || "Impossible de charger les paramètres du serveur.");
      }
      setServerConfig(mapServerSettingsFromApi(data.settings));
      setServerDraftMessage("");
    } catch (err) {
      setServerDraftMessage(err.message || "Impossible de charger les paramètres du serveur.");
    } finally {
      setServerLoading(false);
    }
  }

  function updateServerConfig(field, value) {
    setServerConfig((current) => ({ ...current, [field]: value }));
    setServerDraftMessage("");
  }

  async function uploadServerAsset(type, file) {
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setServerDraftMessage("Format refusé. Utilise PNG, JPG, WEBP ou GIF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setServerDraftMessage("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setServerAssetUploading((current) => ({ ...current, [type]: true }));
    setServerDraftMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/server-settings/assets/${type}`, {
        method: "POST",
        credentials: "include",
        body: formData
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success || !data.url) {
        throw new Error(data.message || "Impossible d'importer cette image.");
      }

      updateServerConfig(type === "logo" ? "logoUrl" : "faviconUrl", data.url);
      setServerDraftMessage(type === "logo" ? "Logo importé. Pense à enregistrer les paramètres." : "Icône importée. Pense à enregistrer les paramètres.");
    } catch (error) {
      setServerDraftMessage(error.message || "Une erreur est survenue pendant l'importation.");
    } finally {
      setServerAssetUploading((current) => ({ ...current, [type]: false }));
    }
  }

  async function saveServerSettings() {
    setServerSaving(true);
    setServerDraftMessage("");

    try {
      const response = await fetch("/api/server-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(mapServerSettingsToApi(serverConfig))
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success || !data.settings) {
        throw new Error(data.message || "Impossible d'enregistrer les paramètres du serveur.");
      }

      setServerConfig(mapServerSettingsFromApi(data.settings));
      setServerDraftMessage("Paramètres enregistrés. Les changements sont maintenant partagés avec tous les utilisateurs.");
    } catch (err) {
      setServerDraftMessage(err.message || "Une erreur est survenue pendant l'enregistrement.");
    } finally {
      setServerSaving(false);
    }
  }

  function renderServerManagement() {
    if (user?.role !== "fondateur") {
      return <div className="settings-card"><h2>Accès réservé</h2><p>Cette rubrique est réservée au fondateur.</p></div>;
    }

    const field = (label, key, type = "text", help = "") => (
      <label className="server-field" key={key}>
        <span>{label}</span>
        <input type={type} value={serverConfig[key]} onChange={(event) => updateServerConfig(key, event.target.value)} />
        {help && <small>{help}</small>}
      </label>
    );

    return (
      <div className="settings-page server-management-page">
        <div className="settings-heading">
          <div><span className="eyebrow">ESPACE FONDATEUR</span><h2>Éditeur du site</h2><p>Personnalise l'identité, le tableau de bord, l'apparence et la page d'accueil de Roblox Academy.</p></div>
          <div className="settings-heading-icon"><AppIcon name="school" size={26} /></div>
        </div>

        <div className="server-status-note"><AppIcon name="shield" size={18} /><div><strong>{serverLoading ? "Chargement des paramètres" : "Paramètres synchronisés"}</strong><span>{serverLoading ? "Récupération de la configuration enregistrée sur le serveur..." : "Les paramètres sont enregistrés dans le backend et partagés avec tous les utilisateurs."}</span></div></div>

        <section className="settings-card">
          <div className="settings-card-heading"><span className="settings-icon"><AppIcon name="school" /></span><div><h3>Identité de la plateforme</h3><p>Nom affiché, logo et informations générales.</p></div></div>
          <div className="server-form-grid">
            {field("Nom du site", "siteName")}
            {field("Nom dans l'en-tête", "headerName")}
            {field("Texte du logo", "logoText")}
            <label className="server-field">
              <span>Logo de la plateforme</span>
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => { uploadServerAsset("logo", event.target.files?.[0]); event.target.value = ""; }} disabled={serverAssetUploading.logo} />
              <small>{serverAssetUploading.logo ? "Importation du logo..." : "Choisis une image depuis ton ordinateur (5 Mo maximum)."}</small>
              {serverConfig.logoUrl && <img src={serverConfig.logoUrl} alt="Logo sélectionné" style={{ maxWidth: "150px", maxHeight: "90px", objectFit: "contain", marginTop: "8px" }} />}
            </label>
            <label className="server-field">
              <span>Icône du site (favicon)</span>
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => { uploadServerAsset("icon", event.target.files?.[0]); event.target.value = ""; }} disabled={serverAssetUploading.icon} />
              <small>{serverAssetUploading.icon ? "Importation de l'icône..." : "Choisis l'icône affichée dans l'onglet du navigateur (5 Mo maximum)."}</small>
              {serverConfig.faviconUrl && <img src={serverConfig.faviconUrl} alt="Icône sélectionnée" style={{ width: "48px", height: "48px", objectFit: "contain", marginTop: "8px" }} />}
            </label>
          </div>
          <label className="server-field server-field-full"><span>Description de la plateforme</span><textarea rows="3" value={serverConfig.description} onChange={(event) => updateServerConfig("description", event.target.value)} /></label>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading"><span className="settings-icon"><AppIcon name="home" /></span><div><h3>Tableau de bord</h3><p>Modifie les textes visibles sur le tableau de bord des utilisateurs.</p></div></div>
          {field("Titre de bienvenue du tableau de bord", "dashboardWelcomeTitle")}
          <label className="server-field server-field-full"><span>Texte sous le titre</span><textarea rows="3" value={serverConfig.dashboardWelcomeText} onChange={(event) => updateServerConfig("dashboardWelcomeText", event.target.value)} /></label>
          {field("Titre de la vue d'ensemble", "dashboardOverviewTitle")}
          {field("Titre des accès rapides", "dashboardQuickTitle")}
          <p className="settings-note">Le logo affiché dans la barre latérale et sur la page de connexion utilise maintenant le logo importé dans « Identité de la plateforme ». Si aucun logo n'est importé, le texte du logo reste utilisé.</p>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading"><span className="settings-icon"><AppIcon name="palette" /></span><div><h3>Apparence</h3><p>Définis le thème et les couleurs principales.</p></div></div>
          <label className="server-field"><span>Thème du site</span><select value={serverConfig.theme} onChange={(event) => updateServerConfig("theme", event.target.value)}><option value="dark">Sombre</option><option value="light">Clair</option></select></label>
          <div className="server-color-grid">
            {[["Couleur principale", "primaryColor"], ["Couleur secondaire", "secondaryColor"], ["Couleur d'accentuation", "accentColor"], ["Couleur de fond", "backgroundColor"]].map(([label, key]) => (
              <label className="server-color-field" key={key}><span>{label}</span><div><input type="color" value={serverConfig[key]} onChange={(event) => updateServerConfig(key, event.target.value)} /><code>{serverConfig[key]}</code></div></label>
            ))}
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading"><span className="settings-icon"><AppIcon name="home" /></span><div><h3>Page d'accueil</h3><p>Modifie le message présenté aux visiteurs.</p></div></div>
          {field("Titre de bienvenue", "welcomeTitle")}
          <label className="server-field server-field-full"><span>Texte de présentation</span><textarea rows="3" value={serverConfig.welcomeText} onChange={(event) => updateServerConfig("welcomeText", event.target.value)} /></label>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading"><span className="settings-icon"><AppIcon name="image" /></span><div><h3>Aperçu du site</h3><p>Vérifie le rendu avant la future publication.</p></div></div>
          <div className={`server-live-preview ${serverConfig.theme}`} style={{ "--preview-primary": serverConfig.primaryColor, "--preview-secondary": serverConfig.secondaryColor, "--preview-accent": serverConfig.accentColor, "--preview-background": serverConfig.backgroundColor }}>
            <div className="server-preview-navbar"><div className="server-preview-logo">{serverConfig.logoUrl ? <img src={serverConfig.logoUrl} alt="Logo du site" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <b>{serverConfig.logoText || "RA"}</b>}<strong>{serverConfig.headerName || serverConfig.siteName}</strong></div><span>Aperçu visiteur</span></div>
            <div className="server-preview-hero"><small>PLATEFORME ÉDUCATIVE</small><h2>{serverConfig.welcomeTitle}</h2><p>{serverConfig.welcomeText}</p><button type="button" style={{ background: serverConfig.primaryColor }}>Découvrir la plateforme</button></div>
            <div className="server-preview-description">{serverConfig.description}</div>
          </div>
          <div className="settings-actions"><button className="refresh-button" type="button" onClick={() => setServerPreview((value) => !value)}>{serverPreview ? "Masquer l'aperçu détaillé" : "Actualiser l'aperçu"}</button><button className="settings-primary" type="button" onClick={saveServerSettings} disabled={serverSaving || serverLoading || serverAssetUploading.logo || serverAssetUploading.icon}>{serverSaving ? "Enregistrement..." : "Enregistrer les paramètres"}</button></div>
          {serverPreview && <p className="settings-note">L'aperçu ci-dessus reflète les valeurs actuellement saisies. Les changements deviennent publics après leur enregistrement.</p>}
          {serverDraftMessage && <div className="settings-success server-draft-message">{serverDraftMessage}</div>}
        </section>
      </div>
    );
  }

  function renderSection() {
    if (activeSection === "overview") {
      return renderOverview();
    }

    if (activeSection === "users") {
      return renderUsers();
    }

    if (activeSection === "courses") {
      return renderCourses();
    }

    if (activeSection === "assignments") {
      return renderAssignments();
    }

    if (activeSection === "grades") {
      return <Grades user={user} />;
    }

    if (activeSection === "settings") {
      return renderSettings();
    }

    if (activeSection === "server") {
      return renderServerManagement();
    }

    const sections = {
      grades: {
        icon: "chart",
        title: "Notes et résultats",
        description: "Prépare le suivi scolaire et les résultats des élèves.",
        items: ["Saisir des notes", "Consulter les résultats", "Gérer les coefficients", "Préparer les bulletins"]
      },
      settings: {
        icon: "settings",
        title: "Paramètres",
        description: "Configure les informations générales de la plateforme.",
        items: ["Informations du site", "Gestion des permissions", "Journal d'activité", "Sauvegardes"]
      }
    };

    const section = sections[activeSection];

    return (
      <div className="coming-section">
        <div className="coming-icon"><AppIcon name={section.icon} size={30} /></div>
        <span className="eyebrow">ESPACE FONDATEUR</span>
        <h2>{section.title}</h2>
        <p>{section.description}</p>

        <div className="feature-list">
          {section.items.map((item) => (
            <div className="feature-item" key={item}>
              <span>○</span>
              {item}
            </div>
          ))}
        </div>

        <div className="development-note">
          <span><AppIcon name="construction" /></span>
          Cette rubrique est en cours de développement.
        </div>
      </div>
    );
  }

  if (page === "login") {
    return (
      <main className="ra-login-screen">
        <style>{`
          .ra-login-screen {
            --login-primary: ${serverConfig.primaryColor || "#7662d8"};
            --login-secondary: ${serverConfig.secondaryColor || "#25213f"};
            --login-accent: ${serverConfig.accentColor || "#a78bfa"};
            --login-background: ${serverConfig.backgroundColor || "#0b1020"};
            min-height: 100vh; width: 100%; box-sizing: border-box;
            position: relative; overflow: hidden; display: flex; flex-direction: column;
            align-items: center; justify-content: center; padding: 82px 22px 36px;
            color: #f7f7ff; background:
              radial-gradient(ellipse at 50% 8%, color-mix(in srgb, var(--login-primary) 28%, transparent), transparent 42%),
              radial-gradient(ellipse at 12% 88%, color-mix(in srgb, var(--login-accent) 13%, transparent), transparent 34%),
              var(--login-background);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          .ra-login-screen::before,.ra-login-screen::after { content:""; position:absolute; border:1px solid rgba(255,255,255,.07); border-radius:50%; pointer-events:none; }
          .ra-login-screen::before { width:520px; height:520px; top:-330px; left:-180px; }
          .ra-login-screen::after { width:620px; height:620px; right:-360px; bottom:-410px; }
          .ra-login-back { position:absolute; top:25px; left:28px; z-index:2; border:1px solid rgba(255,255,255,.13); background:rgba(255,255,255,.055); color:#e6e5f3; border-radius:12px; padding:10px 14px; font-size:13px; cursor:pointer; transition:.2s ease; }
          .ra-login-back:hover { background:rgba(255,255,255,.11); transform:translateY(-1px); }
          .ra-login-brand { position:relative; z-index:1; width:min(100%, 460px); display:flex; flex-direction:column; align-items:center; text-align:center; margin-bottom:24px; }
          .ra-login-logo { width:104px; height:104px; display:grid; place-items:center; overflow:hidden; border-radius:27px; padding:12px; box-sizing:border-box; background:linear-gradient(145deg, rgba(255,255,255,.16), rgba(255,255,255,.045)); border:1px solid rgba(255,255,255,.19); box-shadow:0 18px 55px color-mix(in srgb, var(--login-primary) 30%, transparent), inset 0 1px 0 rgba(255,255,255,.17); color:#fff; font-size:30px; font-weight:850; letter-spacing:-2px; }
          .ra-login-logo img { width:100%; height:100%; object-fit:contain; display:block; }
          .ra-login-brand-name { margin:17px 0 0; font-size:clamp(23px,4vw,31px); line-height:1.15; font-weight:800; letter-spacing:-.8px; }
          .ra-login-brand-subtitle { margin:9px 0 0; max-width:390px; color:#aeb5ca; font-size:14px; line-height:1.65; }
          .ra-login-card { position:relative; z-index:1; width:min(100%, 420px); box-sizing:border-box; padding:30px; border:1px solid rgba(255,255,255,.13); border-radius:22px; background:linear-gradient(145deg, rgba(25,31,53,.94), rgba(15,21,39,.94)); box-shadow:0 28px 90px rgba(0,0,0,.34), inset 0 1px 0 rgba(255,255,255,.06); backdrop-filter:blur(18px); }
          .ra-login-card-heading { margin-bottom:23px; }
          .ra-login-card-heading span { display:inline-flex; align-items:center; gap:7px; color:var(--login-accent); font-size:10px; font-weight:800; letter-spacing:1.6px; text-transform:uppercase; }
          .ra-login-card-heading h2 { margin:9px 0 6px; color:#fff; font-size:25px; letter-spacing:-.5px; }
          .ra-login-card-heading p { margin:0; color:#aeb5ca; font-size:13px; line-height:1.55; }
          .ra-login-form { display:flex; flex-direction:column; gap:9px; }
          .ra-login-form label { margin-top:7px; color:#e0e3ef; font-size:12px; font-weight:650; }
          .ra-login-form input { width:100%; box-sizing:border-box; border:1px solid #39435d; border-radius:11px; outline:none; padding:13px 14px; background:#0e1528; color:#fff; font:inherit; font-size:14px; transition:border-color .2s, box-shadow .2s; }
          .ra-login-form input::placeholder { color:#69748d; }
          .ra-login-form input:focus { border-color:var(--login-accent); box-shadow:0 0 0 3px color-mix(in srgb, var(--login-accent) 18%, transparent); }
          .ra-login-submit { width:100%; margin-top:13px; border:0; border-radius:11px; padding:13px 16px; background:linear-gradient(100deg, var(--login-primary), color-mix(in srgb, var(--login-primary) 68%, var(--login-accent))); color:#fff; font-size:14px; font-weight:750; cursor:pointer; box-shadow:0 9px 24px color-mix(in srgb, var(--login-primary) 27%, transparent); transition:transform .2s, filter .2s; }
          .ra-login-submit:hover:not(:disabled) { transform:translateY(-1px); filter:brightness(1.1); }
          .ra-login-submit:disabled { opacity:.65; cursor:wait; }
          .ra-login-error { margin:7px 0 0; padding:10px 12px; border:1px solid rgba(248,113,113,.3); border-radius:10px; background:rgba(127,29,29,.2); color:#fecaca; font-size:12px; line-height:1.5; }
          .ra-login-footer { position:relative; z-index:1; margin-top:22px; color:#737e98; font-size:11px; text-align:center; }
          @media(max-width:520px) { .ra-login-screen { padding:76px 16px 28px; } .ra-login-back { top:15px; left:15px; } .ra-login-logo { width:86px; height:86px; border-radius:23px; } .ra-login-card { padding:23px 20px; border-radius:18px; } .ra-login-brand { margin-bottom:20px; } }
        `}</style>

        <button
          className="ra-login-back"
          type="button"
          onClick={() => {
            setError("");
            setPage("home");
          }}
        >
          ← Retour à l'accueil
        </button>

        <div className="ra-login-brand">
          <div className="ra-login-logo">
            {serverConfig.logoUrl
              ? <img src={serverConfig.logoUrl} alt={`Logo ${serverConfig.siteName}`} />
              : (serverConfig.logoText || "RA")}
          </div>
          <h1 className="ra-login-brand-name">{serverConfig.headerName || serverConfig.siteName}</h1>
          <p className="ra-login-brand-subtitle">
            {serverConfig.welcomeText || serverConfig.description || "Apprends, progresse et retrouve tes cours au même endroit."}
          </p>
        </div>

        <section className="ra-login-card">
          <div className="ra-login-card-heading">
            <span>✦ Espace personnel</span>
            <h2>Connexion</h2>
            <p>{serverConfig.welcomeMessage || `Connecte-toi à ton espace ${serverConfig.siteName}.`}</p>
          </div>

          <form className="ra-login-form" onSubmit={handleLogin}>
            <label htmlFor="username">Identifiant</label>
            <input
              id="username"
              type="text"
              placeholder="Ton identifiant"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />

            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="Ton mot de passe"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />

            {error && <p className="ra-login-error">{error}</p>}

            <button className="ra-login-submit" type="submit" disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>
        </section>

        <footer className="ra-login-footer">© {new Date().getFullYear()} {serverConfig.siteName} · Tous droits réservés</footer>
      </main>
    );
  }

  if (page === "dashboard" && user) {
    return (
      <>
        <main className="dashboard">
          <aside className="sidebar">
            <div className="sidebar-brand">
              <div className="logo-icon">{serverConfig.logoUrl ? <img src={serverConfig.logoUrl} alt="Logo de Roblox Academy" /> : (serverConfig.logoText || "RA")}</div>
              <div>
                <strong>{serverConfig.headerName || serverConfig.siteName}</strong>
                <small>{user.role === "eleve" ? "Espace élève" : user.role === "professeur" ? "Espace professeur" : "Administration"}</small>
              </div>
            </div>

            <div className="sidebar-label">MENU PRINCIPAL</div>

            <nav className="sidebar-nav">
              {navigation.filter((item) => item.id !== "server" || user?.role === "fondateur").map((item) => (
                <button
                  key={item.id}
                  className={activeSection === item.id ? "nav-item active" : "nav-item"}
                  onClick={() => setActiveSection(item.id)}
                >
                  <span><AppIcon name={item.icon} /></span>
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="sidebar-bottom">
              <div className="profile-mini">
                <div className="avatar">{user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <AppIcon name="user" size={20} />}</div>
                <div>
                  <strong>{user.username}</strong>
                  <small>{roleLabels[user.role] || user.role}</small>
                </div>
              </div>

              <button className="logout-button" onClick={handleLogout}>
                ↪ Déconnexion
              </button>
            </div>
          </aside>

          <section className="dashboard-main">
            <header className="dashboard-header">
              <div>
                <span className="eyebrow">{serverConfig.headerName || serverConfig.siteName}</span>
                <h1>Tableau de bord</h1>
              </div>

              <div className="header-user">
                <span className="online-dot"></span>
                {user.avatarUrl && <img className="header-avatar" src={user.avatarUrl} alt="" />}
                {user.username}
                <span className="crown"><AppIcon name="crown" size={15} /></span>
              </div>
            </header>

            <div className="dashboard-content">
              {renderSection()}
            </div>

            <footer className="dashboard-footer">
              {serverConfig.siteName} · {roleLabels[user.role] || "Espace personnel"}
            </footer>
          </section>
        </main>

        {renderModal()}
        {renderCourseEditor()}

        <style>{`
          :root {
            --ra-primary: ${serverConfig.primaryColor};
            --ra-secondary: ${serverConfig.secondaryColor};
            --ra-accent: ${serverConfig.accentColor};
            --ra-background: ${serverConfig.backgroundColor};
          }
          .login-button,.start-button,.submit-button,.settings-primary,.create-user-button { background:var(--ra-primary) !important; }
          .nav-item.active { border-color:var(--ra-primary) !important; }
          .logo-icon { background:var(--ra-secondary); overflow:hidden; display:grid; place-items:center; }
          .logo-icon img { width:100%; height:100%; object-fit:contain; display:block; }
          svg { display:inline-block; vertical-align:middle; flex-shrink:0; }
          .sidebar-nav .nav-item > span { display:inline-flex; align-items:center; justify-content:center; }
          .settings-heading-icon svg,.settings-icon svg,.stat-icon svg,.welcome-decoration svg,.coming-icon svg { display:block; }
          .settings-profile-layout { display:grid; grid-template-columns:104px minmax(0,1fr); gap:20px; align-items:start; }
          .settings-profile-avatar { width:96px; height:96px; border-radius:50%; overflow:hidden; display:grid; place-items:center; background:#25213f; border:2px solid #514477; color:#d6ceff; font-size:38px; }
          .settings-profile-avatar img { width:100%; height:100%; object-fit:cover; }
          .settings-profile-details { min-width:0; }
          .settings-profile-form { display:flex; flex-direction:column; gap:9px; margin-top:16px; max-width:520px; }
          .settings-profile-form input:not([type="file"]) { width:100%; box-sizing:border-box; padding:11px 12px; border:1px solid #3a4561; border-radius:9px; background:#101629; color:white; }
          .settings-file-input { color:#cbd2e2; font-size:13px; max-width:100%; }
          .settings-muted { color:#929db5; font-size:12px; }
          .settings-activity-list,.settings-backup-list { display:flex; flex-direction:column; margin-top:15px; }
          .settings-activity-item,.settings-backup-item { display:flex; justify-content:space-between; align-items:center; gap:15px; padding:13px 0; border-top:1px solid #293149; }
          .settings-activity-item > div,.settings-backup-item > div { display:flex; flex-direction:column; gap:5px; min-width:0; }
          .settings-activity-item strong,.settings-backup-item strong { color:#f2f3fa; font-size:13px; }
          .settings-activity-item small,.settings-backup-item small { color:#929db5; font-size:12px; overflow-wrap:anywhere; }
          .settings-activity-item time { color:#929db5; font-size:11px; text-align:right; flex-shrink:0; }
          .avatar img { width:100%; height:100%; object-fit:cover; border-radius:inherit; }
          .header-avatar { width:30px; height:30px; object-fit:cover; border-radius:50%; border:1px solid #514477; }
          .settings-page { width:100%; display:flex; flex-direction:column; gap:18px; }
          .settings-heading { display:flex; justify-content:space-between; align-items:center; gap:18px; margin-bottom:4px; }
          .settings-heading h2 { margin:8px 0; font-size:28px; }
          .settings-heading p { color:#9ca3b8; margin:0; }
          .settings-heading-icon { width:58px; height:58px; display:grid; place-items:center; border-radius:16px; background:#211d3c; font-size:27px; }
          .settings-card { background:#171d30; border:1px solid #293149; border-radius:14px; padding:21px; }
          .settings-card-heading { display:flex; align-items:center; gap:13px; margin-bottom:18px; }
          .settings-icon { width:42px; height:42px; display:grid; place-items:center; border-radius:12px; background:#25213f; font-size:20px; }
          .settings-card-heading h3 { margin:0 0 4px; color:#fff; font-size:17px; }
          .settings-card-heading p { margin:0; color:#929db5; font-size:13px; }
          .settings-info-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
          .settings-info-grid > div { display:flex; flex-direction:column; gap:7px; padding:14px; border-radius:10px; background:#11182a; min-width:0; }
          .settings-info-grid span,.settings-field-label { color:#9ca7c0; font-size:12px; }
          .settings-info-grid strong { color:#f2f3fa; overflow-wrap:anywhere; }
          .settings-status { color:#8be0ad !important; }
          .settings-note { margin:15px 0 0; color:#929db5; font-size:12px; line-height:1.6; }
          .settings-field-label { display:block; margin:0 0 8px; }
          .settings-card select { width:100%; max-width:340px; padding:11px 12px; border:1px solid #3a4561; border-radius:9px; background:#101629; color:white; }
          .settings-toggle { display:flex; justify-content:space-between; align-items:center; gap:16px; padding:16px 0; margin-top:8px; border-top:1px solid #293149; }
          .settings-toggle span { display:flex; flex-direction:column; gap:5px; }
          .settings-toggle strong { color:#f1f2fa; font-size:14px; }
          .settings-toggle small { color:#929db5; font-size:12px; }
          .settings-toggle input { width:19px; height:19px; accent-color:#7357ed; cursor:pointer; }
          .settings-actions { display:flex; flex-wrap:wrap; align-items:center; gap:12px; margin-top:7px; }
          .settings-primary { border:0; border-radius:9px; padding:11px 15px; background:#7357ed; color:#fff; font-weight:700; cursor:pointer; }
          .settings-primary:hover { filter:brightness(1.1); }
          .settings-page[data-accent="blue"] .settings-primary { background:#3478d4; }
          .settings-page[data-accent="green"] .settings-primary { background:#23865b; }
          .settings-success { color:#8be0ad; font-size:13px; }
          .settings-permissions { display:flex; flex-direction:column; }
          .settings-permission-row { display:grid; grid-template-columns:160px minmax(0,1fr); gap:15px; padding:13px 0; border-top:1px solid #293149; }
          .settings-permission-row strong { color:#d6ceff; }
          .settings-permission-row span { color:#b0b8cb; font-size:13px; line-height:1.5; }
          .settings-footer-note { display:flex; align-items:flex-start; gap:10px; padding:14px 16px; border:1px solid #3a4561; border-radius:11px; background:#121a2b; color:#aab4ca; font-size:12px; line-height:1.6; }
          .settings-compact .settings-card { padding:14px; }
          .settings-compact { gap:11px; }
          @media(max-width:700px) { .server-form-grid,.server-color-grid { grid-template-columns:1fr; } .server-preview-navbar { align-items:flex-start; flex-direction:column; } .settings-info-grid { grid-template-columns:1fr; } .settings-permission-row { grid-template-columns:1fr; gap:5px; } .settings-heading { align-items:flex-start; } .settings-heading-icon { width:46px; height:46px; } .settings-profile-layout { grid-template-columns:1fr; } .settings-profile-avatar { width:76px; height:76px; } .settings-activity-item,.settings-backup-item { align-items:flex-start; flex-direction:column; } .settings-activity-item time { text-align:left; } }
          .server-status-note { display:flex; gap:12px; align-items:flex-start; padding:15px 17px; border:1px solid #514477; border-radius:12px; background:#211d3c; color:#d8d1ff; }
          .server-status-note > div { display:flex; flex-direction:column; gap:5px; }
          .server-status-note span { color:#b9b2d8; font-size:12px; line-height:1.6; }
          .server-form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:15px; }
          .server-field { display:flex; flex-direction:column; gap:8px; margin:12px 0; color:#9ca7c0; font-size:12px; }
          .server-field input,.server-field textarea,.server-field select { width:100%; box-sizing:border-box; border:1px solid #3a4561; border-radius:9px; padding:11px 12px; background:#101629; color:#f2f3fa; font:inherit; font-size:13px; }
          .server-field textarea { resize:vertical; line-height:1.5; }
          .server-field small { color:#8994ac; font-size:11px; }
          .server-field-full { width:100%; }
          .server-color-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; margin-top:12px; }
          .server-color-field { display:flex; flex-direction:column; gap:9px; padding:13px; border:1px solid #293149; border-radius:10px; color:#aeb8cc; font-size:12px; }
          .server-color-field > div { display:flex; align-items:center; gap:12px; }
          .server-color-field input { width:44px; height:34px; padding:2px; border:1px solid #3a4561; border-radius:7px; background:#101629; cursor:pointer; }
          .server-color-field code { color:#f2f3fa; }
          .server-live-preview { overflow:hidden; border:1px solid #39445d; border-radius:13px; color:#f8f8ff; background:var(--preview-background); }
          .server-live-preview.light { color:#1b2233; background:#f5f7fc; }
          .server-preview-navbar { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:15px 18px; border-bottom:1px solid #ffffff22; background:var(--preview-secondary); color:#fff; }
          .server-preview-logo { display:flex; align-items:center; gap:10px; min-width:0; }
          .server-preview-logo b,.server-preview-logo img { width:34px; height:34px; border-radius:9px; object-fit:cover; display:grid; place-items:center; background:var(--preview-primary); color:white; }
          .server-preview-logo strong { overflow-wrap:anywhere; }
          .server-preview-navbar > span { font-size:11px; opacity:.75; }
          .server-preview-hero { max-width:680px; margin:auto; padding:38px 22px 28px; text-align:center; }
          .server-preview-hero small { color:var(--preview-accent); font-size:10px; font-weight:800; letter-spacing:1.4px; }
          .server-preview-hero h2 { margin:12px 0; font-size:clamp(22px,4vw,34px); }
          .server-preview-hero p { line-height:1.6; opacity:.78; }
          .server-preview-hero button { margin-top:12px; padding:11px 16px; border:0; border-radius:8px; color:white; font-weight:700; }
          .server-preview-description { padding:13px 18px; border-top:1px solid #ffffff22; font-size:12px; opacity:.75; }
          .server-live-preview.light .server-preview-description { border-color:#d8deea; }
          .server-draft-message { display:block; margin-top:13px; line-height:1.5; }
          .users-page { width:100%; }
          .users-heading { display:flex; justify-content:space-between; align-items:center; gap:20px; margin-bottom:26px; }
          .users-heading h2 { margin:8px 0; font-size:28px; }
          .users-heading p { color:#9ca3b8; margin:0; }
          .create-user-button,.modal-submit { border:0; border-radius:10px; padding:13px 18px; background:#7357ed; color:white; font-weight:700; cursor:pointer; }
          .create-user-button:hover,.modal-submit:hover { background:#6245d8; }
          .user-summary { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:15px; margin-bottom:22px; }
          .user-summary > div { background:#171d30; border:1px solid #293149; border-radius:13px; padding:18px; display:flex; flex-direction:column; gap:8px; }
          .user-summary span { color:#a6aec2; font-size:13px; }
          .user-summary strong { font-size:26px; color:#fff; }
          .users-table-container { background:#171d30; border:1px solid #293149; border-radius:14px; overflow:hidden; }
          .users-table-title { display:flex; justify-content:space-between; align-items:center; padding:18px 20px; border-bottom:1px solid #293149; }
          .users-table-title h3 { margin:0 0 5px; }
          .users-table-title small { color:#929db5; }
          .refresh-button { background:transparent; color:#b8aaff; border:1px solid #514477; border-radius:8px; padding:8px 12px; cursor:pointer; }
          .user-filters { display:flex; flex-wrap:wrap; gap:12px; padding:16px 20px; border-bottom:1px solid #293149; }
          .search-wrapper { flex:1; min-width:210px; display:flex; align-items:center; gap:10px; background:#101629; border:1px solid #3a4561; border-radius:9px; padding:0 12px; }
          .search-wrapper input { flex:1; min-width:0; padding:11px 0; border:0; outline:none; background:transparent; color:white; }
          .user-filters select { min-width:150px; padding:11px; border:1px solid #3a4561; border-radius:9px; background:#101629; color:white; }
          .table-scroll { overflow-x:auto; }
          .accounts-table { width:100%; border-collapse:collapse; text-align:left; min-width:650px; }
          .accounts-table th { color:#9ca7c0; font-size:12px; text-transform:uppercase; letter-spacing:.5px; padding:15px 18px; background:#13192a; }
          .accounts-table td { padding:16px 18px; border-top:1px solid #293149; color:#e8eaf3; }
          .account-name-button { padding:0; border:0; background:transparent; color:#c3b6ff; font-weight:700; cursor:pointer; text-align:left; }
          .account-name-button:hover { text-decoration:underline; }
          .account-date { display:block; margin-top:5px; color:#8791a9; font-size:12px; }
          .role-badge,.status-badge { display:inline-block; border-radius:20px; padding:6px 10px; font-size:12px; font-weight:700; white-space:nowrap; }
          .role-badge.eleve { background:#203c59; color:#8bc8ff; }
          .role-badge.professeur { background:#3d315d; color:#c9a9ff; }
          .role-badge.administrateur { background:#584022; color:#ffd18c; }
          .role-badge.fondateur { background:#55451e; color:#ffe18a; }
          .status-badge.active { background:#183f35; color:#72dfb2; }
          .status-badge.disabled { background:#49252e; color:#ff9ca8; }
          .account-actions { display:flex; gap:7px; }
          .account-actions button { background:#252d43; border:1px solid #38435d; border-radius:8px; padding:8px 10px; cursor:pointer; }
          .account-actions button:hover { background:#37415e; }
          .protected-account { color:#d9bd78; font-size:12px; }
          .users-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:9px; padding:45px 20px; color:#aab3c9; text-align:center; }
          .users-empty span { font-size:30px; }
          .users-empty strong { color:white; }
          .users-empty p { margin:0; font-size:13px; }
          .account-info { margin-top:16px; padding:14px; background:#172b35; border:1px solid #28505b; border-radius:10px; color:#a9d8dc; font-size:13px; }
          .account-error { padding:12px; margin:12px 0; border-radius:9px; background:#49252e; color:#ffb1ba; font-size:13px; }
          .modal-overlay { position:fixed; inset:0; z-index:1000; background:#050814c9; display:flex; justify-content:center; align-items:center; padding:20px; overflow-y:auto; }
          .account-modal { position:relative; width:100%; max-width:440px; max-height:90vh; overflow-y:auto; padding:30px; border:1px solid #35405c; border-radius:18px; background:#171d30; box-shadow:0 20px 70px #0008; }
          .account-modal h2 { margin:10px 0; color:white; }
          .account-modal p { color:#a6aec2; font-size:14px; line-height:1.5; }
          .modal-close { position:absolute; top:14px; right:16px; background:transparent; border:0; color:#aab3c9; font-size:27px; cursor:pointer; }
          .account-modal form { display:flex; flex-direction:column; gap:10px; margin-top:22px; }
          .account-modal label { color:#dce1ef; font-size:13px; font-weight:600; }
          .account-modal input,.account-modal select { width:100%; box-sizing:border-box; padding:12px; border-radius:9px; border:1px solid #3a4561; background:#101629; color:white; outline:none; }
          .account-modal input:focus,.account-modal select:focus { border-color:#8b75ff; }
          .form-help { color:#929db5; font-size:12px; margin-bottom:8px; }
          .modal-submit { margin-top:8px; width:100%; }
          .modal-submit:disabled { opacity:.6; cursor:wait; }
          .modal-cancel { padding:11px; border:1px solid #3a4561; background:transparent; color:#c6cce0; border-radius:9px; cursor:pointer; }
          .detail-avatar { width:65px; height:65px; display:grid; place-items:center; margin:20px auto 10px; border-radius:50%; background:#292448; font-size:30px; }
          .detail-username { text-align:center; color:white; margin:8px 0 20px; }
          .detail-list { display:flex; flex-direction:column; gap:0; border:1px solid #35405c; border-radius:11px; overflow:hidden; }
          .detail-list > div { display:flex; flex-direction:column; gap:5px; padding:12px 14px; border-bottom:1px solid #35405c; }
          .detail-list > div:last-child { border-bottom:0; }
          .detail-list span { color:#929db5; font-size:12px; }
          .detail-list strong { color:#e8eaf3; font-size:14px; overflow-wrap:anywhere; }
          .detail-list .detail-id { font-size:11px; color:#b8aaff; }
          .detail-security { margin:15px 0; padding:11px; border-radius:8px; background:#172b35; color:#a9d8dc !important; font-size:12px !important; }

          .courses-page { width:100%; }
          .courses-heading { display:flex; justify-content:space-between; align-items:center; gap:20px; margin-bottom:24px; }
          .courses-heading h2 { margin:8px 0; font-size:28px; }
          .courses-heading p { margin:0; color:#9ca3b8; }
          .course-summary { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; margin-bottom:22px; }
          .course-summary > div { display:flex; flex-direction:column; gap:8px; padding:17px; background:#171d30; border:1px solid #293149; border-radius:13px; }
          .course-summary span { color:#a6aec2; font-size:13px; }
          .course-summary strong { color:#fff; font-size:25px; }
          .courses-toolbar { display:flex; align-items:center; justify-content:space-between; padding:17px 20px; margin-bottom:16px; background:#171d30; border:1px solid #293149; border-radius:13px; }
          .courses-toolbar h3 { margin:0 0 5px; }
          .courses-toolbar small { color:#929db5; }
          .courses-empty { display:flex; flex-direction:column; align-items:center; gap:12px; padding:55px 20px; text-align:center; color:#aab3c9; background:#171d30; border:1px dashed #3a4561; border-radius:14px; }
          .courses-empty > span { font-size:38px; }
          .courses-empty strong { color:white; font-size:18px; }
          .courses-empty p { margin:0 0 8px; }
          .course-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:17px; }
          .course-card { min-width:0; padding:20px; background:#171d30; border:1px solid #293149; border-radius:14px; }
          .course-card-top { display:flex; justify-content:space-between; align-items:center; gap:8px; }
          .course-category,.course-status { display:inline-flex; padding:6px 10px; border-radius:20px; font-size:11px; font-weight:700; }
          .course-category { color:#c4b7ff; background:#30284e; }
          .course-status.draft { color:#ffd18c; background:#584022; }
          .course-status.published { color:#72dfb2; background:#183f35; }
          .course-status.archived { color:#aab3c9; background:#30384b; }
          .course-card h3 { margin:16px 0 8px; color:white; font-size:19px; }
          .course-card > p { min-height:42px; margin:0; color:#a6aec2; font-size:13px; line-height:1.5; }
          .course-meta { display:flex; flex-wrap:wrap; gap:14px; margin:16px 0; color:#c1c9dc; font-size:12px; }
          .course-chapter-preview { display:flex; flex-direction:column; gap:8px; padding:13px; background:#101629; border-radius:9px; color:#c5cbe0; font-size:12px; }
          .course-chapter-preview span { color:#a995ff; font-weight:700; }
          .course-chapter-preview small { color:#929db5; }
          .course-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:15px; }
          .course-resources-preview,.course-document-list { display:flex; flex-direction:column; gap:9px; margin-top:14px; padding:13px; border:1px solid #35405c; border-radius:10px; background:#11182a; color:#dce1ef; font-size:12px; }
          .course-resources-preview a,.course-document-row a { color:#b9aaff; text-decoration:none; overflow-wrap:anywhere; }
          .course-resources-preview a:hover,.course-document-row a:hover { text-decoration:underline; }
          .course-documents-editor { display:flex; flex-direction:column; gap:10px; margin-top:16px; padding:16px; border:1px solid #35405c; border-radius:11px; background:#13192a; }
          .course-documents-editor h3 { margin:0 0 5px; color:white; font-size:16px; }
          .course-documents-editor p { margin:0; color:#9ca8c1; font-size:12px; line-height:1.5; }
          .pdf-file-input { display:none; }
          .pdf-upload-label { display:inline-flex; width:max-content; padding:9px 13px; border-radius:8px; background:#30284e; color:#d7ceff !important; cursor:pointer; }
          .course-document-row { display:flex; align-items:center; justify-content:space-between; gap:12px; }
          .course-document-row span { overflow-wrap:anywhere; }
          .course-document-row small { color:#929db5; }
          .course-document-row button { flex-shrink:0; border:0; background:transparent; color:#ff9ca8; cursor:pointer; }
          .course-document-row button:disabled { opacity:.5; }
          .course-resource { display:flex; flex-direction:column; gap:9px; padding-top:10px; border-top:1px solid #293149; }
          .course-resource-name { display:flex; align-items:flex-start; gap:8px; color:#dce1ef; overflow-wrap:anywhere; }
          .course-resource-name small { display:block; margin-top:3px; color:#929db5; }
          .course-resource-link { width:max-content; max-width:100%; color:#b9aaff; overflow-wrap:anywhere; }
          .course-video-player { width:100%; max-height:360px; border-radius:9px; background:#080b13; }
          .course-image-link img { display:block; max-width:100%; max-height:260px; object-fit:contain; border-radius:9px; }
          .course-audio-player { width:100%; }
          .course-upload-note { color:#929db5; font-size:11px; line-height:1.5; }
          .course-action-primary { padding:8px 12px; border:0; border-radius:8px; color:white; background:#7357ed; font-weight:700; cursor:pointer; }
          .course-detail-page { width:100%; }
          .course-back-button { margin-bottom:16px; }
          .course-detail-hero { padding:25px; margin-bottom:18px; border:1px solid #39345f; border-radius:15px; background:linear-gradient(135deg,#211d3d,#171d30 70%); }
          .course-detail-hero h2 { margin:13px 0 8px; color:#fff; font-size:28px; }
          .course-detail-hero p { max-width:850px; margin:0; color:#b6bfd3; line-height:1.65; }
          .course-detail-layout { display:grid; grid-template-columns:minmax(230px, .75fr) minmax(0, 1.8fr); gap:17px; align-items:start; }
          .course-chapter-list,.course-lesson-panel,.course-detail-resources { min-width:0; padding:19px; border:1px solid #293149; border-radius:14px; background:#171d30; }
          .course-chapter-list h3,.course-detail-resources h3 { margin:0 0 14px; color:#fff; font-size:16px; }
          .course-chapter-button { display:grid; grid-template-columns:32px minmax(0,1fr); gap:4px 9px; width:100%; padding:12px; margin-top:8px; border:1px solid #303a54; border-radius:9px; background:#11182a; color:#dce1ef; text-align:left; cursor:pointer; }
          .course-chapter-button > span { grid-row:span 2; color:#a995ff; font-weight:800; }
          .course-chapter-button strong { overflow-wrap:anywhere; font-size:13px; }
          .course-chapter-button small { color:#929db5; }
          .course-chapter-button.active { border-color:#8b75ff; background:#282344; }
          .course-lesson-panel { min-height:330px; }
          .course-lesson-panel h3 { margin:10px 0 18px; color:#fff; font-size:23px; }
          .course-lesson-content { min-height:190px; color:#d2d8e8; font-size:14px; line-height:1.8; overflow-wrap:anywhere; }
          .course-lesson-content p { margin:0 0 12px; white-space:pre-wrap; }
          .course-detail-muted { color:#929db5; font-size:13px; }
          .course-lesson-navigation { display:flex; justify-content:space-between; align-items:center; gap:12px; padding-top:16px; border-top:1px solid #303a54; }
          .course-lesson-navigation span { color:#aab3c9; font-size:12px; }
          .course-lesson-navigation button:disabled { opacity:.4; cursor:not-allowed; }
          .course-detail-resources { margin-top:17px; }
          .course-detail-resources > div:first-child p { margin:0 0 14px; color:#929db5; font-size:12px; }
          .course-resource-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
          .course-detail-resource { display:flex; min-width:0; flex-direction:column; gap:10px; padding:13px; border:1px solid #303a54; border-radius:10px; background:#11182a; }
          .course-open-button { width:100%; margin-top:14px; padding:11px 13px; border:0; border-radius:9px; background:#7357ed; color:white; font-weight:700; cursor:pointer; }
          .course-open-button:hover { background:#6245d8; }
          .course-detail-empty { display:grid; min-height:250px; place-items:center; color:#929db5; text-align:center; }
          .assignments-page { width:100%; }
          .assignments-toolbar { display:flex; justify-content:space-between; align-items:center; gap:14px; padding:17px 20px; margin-bottom:16px; border:1px solid #293149; border-radius:13px; background:#171d30; }
          .assignments-toolbar h3 { margin:0 0 5px; color:#fff; }
          .assignments-toolbar small { color:#929db5; }
          .assignments-toolbar-actions { display:flex; flex-wrap:wrap; gap:9px; }
          .assignments-toolbar select { padding:9px 11px; border:1px solid #3a4561; border-radius:8px; background:#101629; color:white; }
          .assignment-actions { display:flex; flex-wrap:wrap; gap:9px; margin-top:16px; }
          .assignment-actions button { border:1px solid #3a4562; border-radius:9px; padding:9px 12px; font-weight:700; cursor:pointer; }
          .assignment-edit-button { background:#202943; color:#d8d2ff; }
          .assignment-delete-button { background:#351f2b; color:#ffb8c2; }
          .assignment-actions button:hover { filter:brightness(1.15); }
          .assignment-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
          .assignment-card { min-width:0; padding:19px; border:1px solid #293149; border-radius:14px; background:#171d30; }
          .assignment-card-top { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:9px; }
          .assignment-type { display:inline-flex; padding:6px 10px; border-radius:20px; font-size:11px; font-weight:700; background:#30284e; color:#c4b7ff; }
          .assignment-type.supplementaire { background:#4a3b20; color:#ffd18c; }
          .assignment-type.punition { background:#4a2632; color:#ffb2c0; }
          .assignment-target { color:#a6aec2; font-size:12px; }
          .assignment-subject { display:inline-block; margin-top:13px; color:#c4b7ff; font-size:11px; font-weight:700; }
          .assignment-card h3 { margin:6px 0 8px; color:#fff; font-size:19px; overflow-wrap:anywhere; }
          .assignment-card > p { min-height:42px; margin:0; color:#a6aec2; font-size:13px; line-height:1.6; white-space:pre-wrap; overflow-wrap:anywhere; }
          .assignment-due { display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-top:17px; padding-top:13px; border-top:1px solid #303a54; color:#a6aec2; font-size:12px; }
          .assignment-due strong { color:#e3e7f2; }
          .assignment-created { display:block; margin-top:12px; color:#78849f; }
          .assignment-modal { position:relative; width:100%; max-width:620px; max-height:92vh; overflow-y:auto; padding:28px; border:1px solid #35405c; border-radius:18px; background:#171d30; box-shadow:0 20px 70px #0008; }
          .assignment-modal h2 { margin:10px 0; color:white; }
          .assignment-modal > p { color:#a6aec2; font-size:13px; line-height:1.5; }
          .assignment-modal form { display:flex; flex-direction:column; gap:10px; margin-top:20px; }
          .assignment-modal label { color:#dce1ef; font-size:13px; font-weight:600; }
          .assignment-modal input,.assignment-modal textarea,.assignment-modal select { width:100%; box-sizing:border-box; padding:11px 12px; border-radius:9px; border:1px solid #3a4561; background:#101629; color:white; outline:none; font:inherit; }
          .assignment-modal input:focus,.assignment-modal textarea:focus,.assignment-modal select:focus { border-color:#8b75ff; }
          @media(max-width:850px) { .course-detail-layout { grid-template-columns:1fr; } .course-resource-grid { grid-template-columns:1fr; } }
          .course-modal { position:relative; width:100%; max-width:700px; max-height:92vh; overflow-y:auto; padding:28px; border:1px solid #35405c; border-radius:18px; background:#171d30; box-shadow:0 20px 70px #0008; }
          .course-modal h2 { margin:10px 0; color:white; }
          .course-modal > p { color:#a6aec2; font-size:13px; line-height:1.5; }
          .course-modal form { display:flex; flex-direction:column; gap:10px; margin-top:20px; }
          .course-modal label { color:#dce1ef; font-size:13px; font-weight:600; }
          .course-modal input,.course-modal textarea,.course-modal select { width:100%; box-sizing:border-box; padding:11px 12px; border-radius:9px; border:1px solid #3a4561; background:#101629; color:white; outline:none; font:inherit; }
          .course-modal input:focus,.course-modal textarea:focus,.course-modal select:focus { border-color:#8b75ff; }
          .course-form-row { display:grid; grid-template-columns:1fr 1fr; gap:13px; }
          .course-form-row > div { display:flex; flex-direction:column; gap:9px; }
          .chapters-heading { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-top:15px; }
          .chapters-heading h3 { margin:0; color:white; font-size:16px; }
          .chapter-editor { display:flex; flex-direction:column; gap:9px; padding:15px; border:1px solid #35405c; border-radius:11px; background:#13192a; }
          .chapter-editor-heading { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; color:#c7bbff; }
          .chapter-editor-heading button { border:0; background:transparent; color:#ff9ca8; cursor:pointer; }
          .chapter-editor-heading button:disabled { opacity:.4; cursor:not-allowed; }
          @media(max-width:900px) {
            .course-summary { grid-template-columns:repeat(2,minmax(0,1fr)); }
            .course-grid { grid-template-columns:1fr; }
          }
            .user-summary { grid-template-columns:repeat(2,minmax(0,1fr)); }
          }
          @media(max-width:700px) {
            .assignment-grid { grid-template-columns:1fr; }
            .assignments-toolbar { align-items:flex-start; flex-direction:column; }
            .assignments-toolbar-actions { width:100%; }
            .assignments-toolbar-actions select { flex:1; min-width:0; }
            .assignment-modal { padding:20px; }
            .courses-heading { align-items:flex-start; flex-direction:column; }
            .course-form-row { grid-template-columns:1fr; }
            .course-modal { padding:20px; }
            .chapters-heading { align-items:flex-start; flex-direction:column; }
            .users-heading { align-items:flex-start; flex-direction:column; }
            .user-summary { grid-template-columns:1fr 1fr; }
            .user-filters { flex-direction:column; }
            .user-filters select { width:100%; }
            .account-modal { padding:23px; }
          }
        `}</style>
      </>
    );
  }

  return (
    <main className="page ra-home-screen">
      <style>{`
        .ra-home-screen { min-height:100vh; position:relative; isolation:isolate; overflow:hidden; display:flex; flex-direction:column; align-items:center; padding:26px clamp(18px,5vw,72px) 28px; box-sizing:border-box; background:radial-gradient(ellipse at 50% 34%, color-mix(in srgb, ${serverConfig.primaryColor || "#7662d8"} 16%, transparent), transparent 48%); }
        .ra-home-screen::before,.ra-home-screen::after { content:""; position:absolute; z-index:-1; width:390px; height:390px; border:1px solid rgba(130,115,220,.13); border-radius:50%; pointer-events:none; }
        .ra-home-screen::before { top:90px; left:-270px; box-shadow:0 0 0 45px rgba(130,115,220,.025),0 0 0 90px rgba(130,115,220,.02); }
        .ra-home-screen::after { right:-270px; bottom:40px; box-shadow:0 0 0 45px rgba(130,115,220,.025),0 0 0 90px rgba(130,115,220,.02); }
        .ra-home-topbar { width:min(100%,1180px); display:flex; align-items:center; justify-content:flex-end; min-height:54px; }
        .ra-home-topbar .login-button { border-radius:13px; padding:12px 20px; font-weight:750; box-shadow:0 8px 24px rgba(40,30,100,.12); }
        .ra-home-hero { width:min(100%,900px); display:flex; flex-direction:column; align-items:center; text-align:center; padding:clamp(42px,8vh,82px) 20px 38px; }
        .ra-home-logo { width:clamp(104px,14vw,148px); height:clamp(104px,14vw,148px); display:grid; place-items:center; box-sizing:border-box; overflow:hidden; padding:15px; border-radius:34px; background:linear-gradient(145deg,rgba(255,255,255,.16),rgba(255,255,255,.045)); border:1px solid rgba(150,135,230,.3); box-shadow:0 22px 65px color-mix(in srgb, ${serverConfig.primaryColor || "#7662d8"} 24%, transparent),inset 0 1px 0 rgba(255,255,255,.18); color:inherit; font-size:clamp(30px,5vw,43px); font-weight:850; letter-spacing:-2px; }
        .ra-home-logo img { display:block; width:100%; height:100%; object-fit:contain; }
        .ra-home-name { margin:22px 0 0; font-size:clamp(25px,4vw,38px); line-height:1.12; font-weight:850; letter-spacing:-1.2px; }
        .ra-home-tag { display:inline-flex; align-items:center; gap:8px; margin-top:30px; padding:8px 13px; border:1px solid rgba(130,115,220,.22); border-radius:999px; background:rgba(130,115,220,.08); color:${serverConfig.primaryColor || "#7662d8"}; font-size:11px; font-weight:800; letter-spacing:1.4px; }
        .ra-home-title { max-width:790px; margin:20px 0 0; font-size:clamp(35px,6vw,62px); line-height:1.06; letter-spacing:-2.2px; font-weight:850; }
        .ra-home-description { max-width:620px; margin:19px 0 0; color:var(--muted,#a5a5b8); font-size:clamp(14px,1.7vw,17px); line-height:1.8; }
        .ra-home-actions { display:flex; align-items:center; justify-content:center; gap:13px; flex-wrap:wrap; margin-top:30px; }
        .ra-home-actions .start-button { min-width:220px; border-radius:14px; padding:15px 23px; font-weight:800; box-shadow:0 12px 30px color-mix(in srgb, ${serverConfig.primaryColor || "#7662d8"} 22%, transparent); }
        .ra-home-status { display:flex; align-items:center; gap:9px; margin-top:auto; padding:11px 16px; border:1px solid rgba(130,115,220,.16); border-radius:999px; background:rgba(130,115,220,.055); font-size:12px; }
        .ra-home-status .status-dot { width:8px; height:8px; border-radius:50%; background:#42c98a; box-shadow:0 0 0 4px rgba(66,201,138,.12); }
        .ra-home-footer { max-width:850px; margin-top:22px; color:var(--muted,#9292a6); font-size:12px; text-align:center; line-height:1.6; }
        @media(max-width:600px) { .ra-home-screen { padding:16px 16px 22px; } .ra-home-topbar { min-height:48px; } .ra-home-hero { padding:38px 5px 30px; } .ra-home-logo { border-radius:27px; } .ra-home-title { letter-spacing:-1.3px; } .ra-home-tag { margin-top:25px; } .ra-home-actions,.ra-home-actions .start-button { width:100%; } .ra-home-actions .start-button { min-width:0; } }
      `}</style>

      <header className="ra-home-topbar">
        <button className="login-button" onClick={() => setPage("login")}>
          Se connecter
        </button>
      </header>

      <section className="ra-home-hero">
        <div className="ra-home-logo">
          {serverConfig.logoUrl
            ? <img src={serverConfig.logoUrl} alt={`Logo ${serverConfig.siteName}`} />
            : (serverConfig.logoText || "RA")}
        </div>
        <h2 className="ra-home-name">{serverConfig.headerName || serverConfig.siteName}</h2>
        <span className="ra-home-tag">✦ PLATEFORME ÉDUCATIVE</span>
        <h1 className="ra-home-title">{serverConfig.welcomeTitle}</h1>
        <p className="ra-home-description">{serverConfig.welcomeText}</p>
        <div className="ra-home-actions">
          <button className="start-button" onClick={() => setPage("login")}>
            Accéder à mon espace <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <section className="ra-home-status" aria-live="polite">
        <span className="status-dot"></span>
        API : {apiStatus}
      </section>

      <footer className="ra-home-footer">© {new Date().getFullYear()} {serverConfig.siteName} · {serverConfig.description}</footer>
    </main>
  );
}

export default App;
