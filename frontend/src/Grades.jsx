
import { useEffect, useState } from "react";

function getToday() {
  const date = new Date();
  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
}

function Grades({ user }) {
  const [students, setStudents] = useState([]);
  const [assessments, setAssessments] = useState([]);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Programmation");
  const [date, setDate] = useState(getToday());
  const [coefficient, setCoefficient] = useState("1");
  const [grades, setGrades] = useState({});

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState("Programmation");
  const [editDate, setEditDate] = useState(getToday());
  const [editCoefficient, setEditCoefficient] = useState("1");
  const [editGrades, setEditGrades] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isStudent = user?.role === "eleve";

  const canManageGrades = [
    "fondateur",
    "administrateur",
    "professeur"
  ].includes(user?.role);

  async function loadGradebook() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/grades", {
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de charger les notes.");
      }

      setStudents(data.students || []);
      setAssessments(data.assessments || []);
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canManageGrades || isStudent) {
      loadGradebook();
    } else {
      setLoading(false);
    }
  }, [canManageGrades, isStudent]);

  function updateGrade(studentId, value) {
    if (
      value !== "" &&
      (
        !Number.isFinite(Number(value)) ||
        Number(value) < 0 ||
        Number(value) > 20
      )
    ) {
      return;
    }

    setGrades((current) => ({
      ...current,
      [studentId]: value
    }));
  }

  async function createAssessment(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (students.length === 0) {
      setError("Aucun élève actif n'est disponible.");
      return;
    }

    const gradeEntries = students.map((student) => ({
      studentId: student.id,
      value:
        grades[student.id] === undefined || grades[student.id] === ""
          ? null
          : Number(grades[student.id])
    }));

    setSaving(true);

    try {
      const response = await fetch("/api/grades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          subject,
          date,
          coefficient: Number(coefficient),
          grades: gradeEntries
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible d'enregistrer l'évaluation.");
      }

      setTitle("");
      setSubject("Programmation");
      setDate(getToday());
      setCoefficient("1");
      setGrades({});
      setSuccess("L'évaluation a bien été enregistrée en brouillon !");

      await loadGradebook();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  function startEditing(assessment) {
    setEditingId(assessment.id);
    setEditTitle(assessment.title);
    setEditSubject(assessment.subject);
    setEditDate(assessment.date || getToday());
    setEditCoefficient(String(assessment.coefficient));

    const initialGrades = {};

    students.forEach((student) => {
      const existingGrade = (assessment.grades || []).find(
        (grade) => grade.studentId === student.id
      );

      initialGrades[student.id] =
        existingGrade?.value === null || existingGrade?.value === undefined
          ? ""
          : String(existingGrade.value);
    });

    setEditGrades(initialGrades);
    setError("");
    setSuccess("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditGrades({});
  }

  function updateEditGrade(studentId, value) {
    if (
      value !== "" &&
      (
        !Number.isFinite(Number(value)) ||
        Number(value) < 0 ||
        Number(value) > 20
      )
    ) {
      return;
    }

    setEditGrades((current) => ({
      ...current,
      [studentId]: value
    }));
  }

  async function saveEditing(event) {
    event.preventDefault();

    if (!editingId) return;

    setError("");
    setSuccess("");
    setSaving(true);

    const gradeEntries = students.map((student) => ({
      studentId: student.id,
      value:
        editGrades[student.id] === undefined || editGrades[student.id] === ""
          ? null
          : Number(editGrades[student.id])
    }));

    try {
      const response = await fetch(`/api/grades/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          title: editTitle,
          subject: editSubject,
          date: editDate,
          coefficient: Number(editCoefficient),
          grades: gradeEntries
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de modifier le devoir.");
      }

      setEditingId(null);
      setEditGrades({});
      setSuccess("L'évaluation a bien été modifiée !");

      await loadGradebook();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAssessment(assessment) {
    const confirmed = window.confirm(
      `Veux-tu vraiment supprimer l'évaluation "${assessment.title}" ? Cette action est définitive.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setBusyId(assessment.id);

    try {
      const response = await fetch(`/api/grades/${assessment.id}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de supprimer l'évaluation.");
      }

      if (editingId === assessment.id) {
        cancelEditing();
      }

      setSuccess("L'évaluation a bien été supprimée.");

      await loadGradebook();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setBusyId(null);
    }
  }

  async function togglePublication(assessment) {
    const newStatus = !assessment.published;

    setError("");
    setSuccess("");
    setBusyId(assessment.id);

    try {
      const response = await fetch(
        `/api/grades/${assessment.id}/publication`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            published: newStatus
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de modifier la publication.");
      }

      setSuccess(
        newStatus
          ? "L'évaluation a bien été publiée."
          : "L'évaluation a été remise en brouillon."
      );

      await loadGradebook();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setBusyId(null);
    }
  }

  function getAssessmentAverage(assessment) {
    const values = (assessment.grades || [])
      .map((grade) => grade.value)
      .filter((value) => value !== null && value !== undefined && value !== "")
      .map(Number);

    if (values.length === 0) return "Aucune note";

    const average =
      values.reduce((sum, value) => sum + value, 0) / values.length;

    return `${average.toFixed(2).replace(".", ",")} / 20`;
  }

  function getStudentGrade(assessment, studentId) {
    const grade = (assessment.grades || []).find(
      (item) => item.studentId === studentId
    );

    return grade?.value ?? "Non noté";
  }

  // INTERFACE ÉLÈVE
  if (isStudent) {
    return (
      <div className="grades-page student-grades-page">
        <div className="grades-heading">
          <div>
            <span className="eyebrow">ESPACE ÉLÈVE</span>
            <h2>Mes notes et résultats</h2>
            <p>Retrouve les résultats communiqués par tes professeurs.</p>
          </div>

          <button
            className="refresh-button"
            onClick={loadGradebook}
            disabled={loading}
          >
            ↻ Actualiser
          </button>
        </div>

        {error && <div className="account-error">{error}</div>}

        {loading ? (
          <div className="student-grades-empty">
            Chargement de tes notes...
          </div>
        ) : assessments.length === 0 ? (
          <div className="student-grades-empty">
            <span>📚</span>
            <strong>Aucune note actuellement</strong>
            <p>
              Les notes apparaîtront ici lorsqu'un professeur les aura publiées.
            </p>
          </div>
        ) : (
          <div className="grades-assessment-list">
            {assessments.map((assessment) => (
              <article className="grades-assessment-card" key={assessment.id}>
                <div className="grades-assessment-top">
                  <div>
                    <span className="grades-subject">
                      {assessment.subject}
                    </span>
                    <h3>{assessment.title}</h3>
                  </div>

                  <span className="grades-status published">
                    ● Publié
                  </span>
                </div>

                <div className="grades-assessment-meta">
                  <span>📅 {assessment.date || "Date inconnue"}</span>
                  <span>📊 Coef. {assessment.coefficient}</span>
                </div>

                <div className="student-grade-value">
                  {assessment.value} <span>/ 20</span>
                </div>
              </article>
            ))}
          </div>
        )}

        <style>{`
          .student-grades-page { width:100%; }
          .student-grades-page .grades-heading { display:flex; justify-content:space-between; align-items:center; gap:18px; margin-bottom:24px; }
          .student-grades-page .grades-heading h2 { margin:8px 0; font-size:28px; }
          .student-grades-page .grades-heading p { margin:0; color:#9ca3b8; }
          .student-grades-page .student-grades-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; min-height:180px; padding:30px 15px; border:1px solid #293149; border-radius:14px; background:#171d30; color:#aab3c9; text-align:center; }
          .student-grades-page .student-grades-empty span { font-size:34px; }
          .student-grades-page .student-grades-empty strong { color:white; font-size:17px; }
          .student-grades-page .student-grades-empty p { margin:0; font-size:13px; }
          .student-grades-page .grades-assessment-list { display:flex; flex-direction:column; gap:13px; }
          .student-grades-page .grades-assessment-card { padding:18px; border:1px solid #303a54; border-radius:11px; background:#171d30; }
          .student-grades-page .grades-assessment-top { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; }
          .student-grades-page .grades-subject { color:#c4b7ff; font-size:11px; font-weight:700; }
          .student-grades-page .grades-assessment-top h3 { margin:6px 0 0; color:white; font-size:17px; }
          .student-grades-page .grades-status { padding:6px 9px; border-radius:8px; font-size:11px; font-weight:700; white-space:nowrap; }
          .student-grades-page .grades-status.published { background:#183f35; color:#72dfb2; }
          .student-grades-page .grades-assessment-meta { display:flex; flex-wrap:wrap; gap:14px; margin:14px 0; color:#aab3c9; font-size:12px; }
          .student-grades-page .student-grade-value { display:inline-flex; align-items:baseline; gap:5px; margin-top:5px; padding:12px 16px; border:1px solid #28634e; border-radius:9px; background:#183f35; color:#72dfb2; font-size:25px; font-weight:800; }
          .student-grades-page .student-grade-value span { font-size:14px; font-weight:600; }
          @media(max-width:700px) {
            .student-grades-page .grades-heading { align-items:flex-start; flex-direction:column; }
            .student-grades-page .grades-assessment-top { flex-direction:column; }
          }
        `}</style>
      </div>
    );
  }

  if (!canManageGrades) {
    return (
      <div className="grades-page">
        <div className="grades-empty">
          <span>🔒</span>
          <h2>Accès réservé</h2>
          <p>
            La gestion des notes est réservée aux professeurs et à
            l'administration.
          </p>
        </div>
      </div>
    );
  }

  // INTERFACE PROFESSEUR / ADMINISTRATION
  return (
    <div className="grades-page">
      <div className="grades-heading">
        <div>
          <span className="eyebrow">ESPACE PÉDAGOGIQUE</span>
          <h2>Notes et résultats</h2>
          <p>Crée des évaluations et saisis les résultats des élèves.</p>
        </div>

        <button
          className="refresh-button"
          onClick={loadGradebook}
          disabled={loading}
        >
          ↻ Actualiser
        </button>
      </div>

      <div className="grades-summary">
        <div>
          <span>Élèves actifs</span>
          <strong>{students.length}</strong>
        </div>

        <div>
          <span>Évaluations</span>
          <strong>{assessments.length}</strong>
        </div>

        <div>
          <span>Matières utilisées</span>
          <strong>
            {new Set(assessments.map((item) => item.subject)).size}
          </strong>
        </div>
      </div>

      {error && <div className="account-error">{error}</div>}
      {success && <div className="grades-success">{success}</div>}

      <section className="grades-panel">
        <div className="grades-panel-heading">
          <div>
            <h3>📝 Nouvelle évaluation</h3>
            <p>
              Renseigne les informations puis saisis les notes dans le tableau.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="users-empty">Chargement des élèves...</div>
        ) : (
          <form onSubmit={createAssessment}>
            <div className="grades-form-grid">
              <div>
                <label htmlFor="assessment-title">Nom de l'évaluation</label>
                <input
                  id="assessment-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Exemple : Contrôle chapitre 1"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </div>

              <div>
                <label htmlFor="assessment-subject">Matière</label>
                <select
                  id="assessment-subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  required
                >
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
              </div>

              <div>
                <label htmlFor="assessment-date">Date</label>
                <input
                  id="assessment-date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="assessment-coefficient">Coefficient</label>
                <input
                  id="assessment-coefficient"
                  type="number"
                  min="0.1"
                  max="19.99"
                  step="0.1"
                  value={coefficient}
                  onChange={(event) => setCoefficient(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grades-table-heading">
              <div>
                <h3>Tableau de classe</h3>
                <small>{students.length} élève(s)</small>
              </div>

              <span className="grades-scale">Notation sur 20</span>
            </div>

            {students.length === 0 ? (
              <div className="grades-empty">
                <span>👥</span>
                <strong>Aucun élève disponible</strong>
                <p>Crée d'abord des comptes avec le rôle Élève.</p>
              </div>
            ) : (
              <div className="grades-table-scroll">
                <table className="grades-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Identifiant de l'élève</th>
                      <th>Note / 20</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{student.username}</strong>
                        </td>
                        <td>
                          <input
                            className="grade-input"
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            placeholder="Abs."
                            value={grades[student.id] ?? ""}
                            onChange={(event) =>
                              updateGrade(student.id, event.target.value)
                            }
                            aria-label={`Note de ${student.username}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="grades-form-footer">
              <p>
                Les nouvelles évaluations sont enregistrées en brouillon.
                Tu pourras les publier ensuite.
              </p>

              <button
                className="modal-submit"
                type="submit"
                disabled={saving || loading || students.length === 0}
              >
                {saving ? "Enregistrement..." : "💾 Enregistrer l'évaluation"}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="grades-panel">
        <div className="grades-panel-heading">
          <div>
            <h3>📊 Évaluations enregistrées</h3>
            <p>Retrouve les contrôles et les résultats déjà saisis.</p>
          </div>
        </div>

        {loading ? (
          <div className="users-empty">Chargement des évaluations...</div>
        ) : assessments.length === 0 ? (
          <div className="grades-empty">
            <span>📋</span>
            <strong>Aucune évaluation enregistrée</strong>
            <p>
              Ta première évaluation apparaîtra ici après son enregistrement.
            </p>
          </div>
        ) : (
          <div className="grades-assessment-list">
            {assessments.map((assessment) => (
              <article className="grades-assessment-card" key={assessment.id}>
                <div className="grades-assessment-top">
                  <div>
                    <span className="grades-subject">
                      {assessment.subject}
                    </span>

                    <h3>{assessment.title}</h3>
                  </div>

                  <div className="grades-card-badges">
                    <span className="grades-coefficient">
                      Coef. {assessment.coefficient}
                    </span>

                    <span
                      className={
                        assessment.published
                          ? "grades-status published"
                          : "grades-status draft"
                      }
                    >
                      {assessment.published ? "● Publié" : "● Brouillon"}
                    </span>
                  </div>
                </div>

                <div className="grades-assessment-meta">
                  <span>📅 {assessment.date || "Date inconnue"}</span>
                  <span>📊 Moyenne : {getAssessmentAverage(assessment)}</span>
                  <span>
                    👥 {(assessment.grades || []).filter(
                      (grade) =>
                        grade.value !== null &&
                        grade.value !== undefined &&
                        grade.value !== ""
                    ).length} note(s) saisie(s)
                  </span>
                </div>

                {editingId === assessment.id ? (
                  <form className="grades-edit-form" onSubmit={saveEditing}>
                    <h4>✏️ Modifier l'évaluation</h4>

                    <div className="grades-form-grid">
                      <div>
                        <label htmlFor={`edit-title-${assessment.id}`}>
                          Nom de l'évaluation
                        </label>

                        <input
                          id={`edit-title-${assessment.id}`}
                          value={editTitle}
                          onChange={(event) => setEditTitle(event.target.value)}
                          minLength={2}
                          maxLength={100}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor={`edit-subject-${assessment.id}`}>
                          Matière
                        </label>

                        <select
                          id={`edit-subject-${assessment.id}`}
                          value={editSubject}
                          onChange={(event) => setEditSubject(event.target.value)}
                          required
                        >
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
                      </div>

                      <div>
                        <label htmlFor={`edit-date-${assessment.id}`}>
                          Date
                        </label>

                        <input
                          id={`edit-date-${assessment.id}`}
                          type="date"
                          value={editDate}
                          onChange={(event) => setEditDate(event.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor={`edit-coefficient-${assessment.id}`}>
                          Coefficient
                        </label>

                        <input
                          id={`edit-coefficient-${assessment.id}`}
                          type="number"
                          min="0.1"
                          max="19.99"
                          step="0.1"
                          value={editCoefficient}
                          onChange={(event) =>
                            setEditCoefficient(event.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grades-table-heading">
                      <div>
                        <h4>Notes des élèves</h4>
                        <small>{students.length} élève(s)</small>
                      </div>

                      <span className="grades-scale">Sur 20</span>
                    </div>

                    <div className="grades-table-scroll">
                      <table className="grades-table">
                        <thead>
                          <tr>
                            <th>Élève</th>
                            <th>Note / 20</th>
                          </tr>
                        </thead>

                        <tbody>
                          {students.map((student) => (
                            <tr key={student.id}>
                              <td>{student.username}</td>
                              <td>
                                <input
                                  className="grade-input"
                                  type="number"
                                  min="0"
                                  max="20"
                                  step="0.25"
                                  placeholder="Abs."
                                  value={editGrades[student.id] ?? ""}
                                  onChange={(event) =>
                                    updateEditGrade(
                                      student.id,
                                      event.target.value
                                    )
                                  }
                                  aria-label={`Note de ${student.username}`}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="grades-edit-actions">
                      <button
                        type="button"
                        className="grades-action cancel"
                        onClick={cancelEditing}
                        disabled={saving}
                      >
                        Annuler
                      </button>

                      <button
                        type="submit"
                        className="grades-action save"
                        disabled={saving}
                      >
                        {saving ? "Enregistrement..." : "💾 Enregistrer les modifications"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <details className="grades-details">
                      <summary>Consulter les résultats des élèves</summary>

                      <div className="grades-table-scroll">
                        <table className="grades-table">
                          <thead>
                            <tr>
                              <th>Élève</th>
                              <th>Résultat</th>
                            </tr>
                          </thead>

                          <tbody>
                            {students.map((student) => (
                              <tr key={student.id}>
                                <td>{student.username}</td>
                                <td>
                                  {getStudentGrade(assessment, student.id)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>

                    <div className="grades-actions">
                      <button
                        type="button"
                        className="grades-action edit"
                        onClick={() => startEditing(assessment)}
                        disabled={busyId !== null}
                      >
                        ✏️ Modifier
                      </button>

                      <button
                        type="button"
                        className={
                          assessment.published
                            ? "grades-action unpublish"
                            : "grades-action publish"
                        }
                        onClick={() => togglePublication(assessment)}
                        disabled={busyId !== null}
                      >
                        {busyId === assessment.id
                          ? "Patiente..."
                          : assessment.published
                            ? "↩ Dépublier"
                            : "🚀 Publier"}
                      </button>

                      <button
                        type="button"
                        className="grades-action delete"
                        onClick={() => deleteAssessment(assessment)}
                        disabled={busyId !== null}
                      >
                        {busyId === assessment.id
                          ? "Patiente..."
                          : "🗑️ Supprimer"}
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .grades-page { width:100%; }
        .grades-heading { display:flex; justify-content:space-between; align-items:center; gap:18px; margin-bottom:24px; }
        .grades-heading h2 { margin:8px 0; font-size:28px; }
        .grades-heading p { margin:0; color:#9ca3b8; }
        .grades-summary { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; margin-bottom:20px; }
        .grades-summary > div { display:flex; flex-direction:column; gap:8px; padding:17px; background:#171d30; border:1px solid #293149; border-radius:13px; }
        .grades-summary span { color:#a6aec2; font-size:13px; }
        .grades-summary strong { color:white; font-size:25px; }
        .grades-panel { margin-bottom:20px; padding:20px; background:#171d30; border:1px solid #293149; border-radius:14px; }
        .grades-panel-heading { margin-bottom:20px; }
        .grades-panel-heading h3 { margin:0 0 6px; color:white; }
        .grades-panel-heading p { margin:0; color:#929db5; font-size:13px; }
        .grades-form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:15px; }
        .grades-form-grid > div { display:flex; flex-direction:column; gap:8px; }
        .grades-page label { color:#dce1ef; font-size:13px; font-weight:600; }
        .grades-page input,.grades-page select { box-sizing:border-box; width:100%; padding:11px 12px; border:1px solid #3a4561; border-radius:9px; background:#101629; color:white; outline:none; }
        .grades-page input:focus,.grades-page select:focus { border-color:#8b75ff; }
        .grades-table-heading { display:flex; justify-content:space-between; align-items:center; gap:12px; margin:25px 0 12px; }
        .grades-table-heading h3,.grades-table-heading h4 { margin:0 0 5px; color:white; font-size:16px; }
        .grades-table-heading small,.grades-scale { color:#929db5; font-size:12px; }
        .grades-table-scroll { width:100%; overflow-x:auto; }
        .grades-table { width:100%; min-width:420px; border-collapse:collapse; text-align:left; }
        .grades-table th { padding:13px; background:#11182a; color:#9ca7c0; font-size:11px; text-transform:uppercase; }
        .grades-table td { padding:12px 13px; border-top:1px solid #293149; color:#e8eaf3; font-size:13px; }
        .grades-table td:first-child { color:#929db5; width:45px; }
        .grades-table td strong { color:#e8eaf3; }
        .grades-table .grade-input { max-width:110px; padding:9px; }
        .grades-form-footer { display:flex; justify-content:space-between; align-items:center; gap:15px; margin-top:18px; }
        .grades-form-footer p { color:#929db5; font-size:12px; }
        .grades-form-footer .modal-submit { width:auto; }
        .grades-success { margin:12px 0; padding:12px; border-radius:9px; background:#183f35; color:#72dfb2; font-size:13px; }
        .grades-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:9px; padding:35px 15px; color:#aab3c9; text-align:center; }
        .grades-empty > span { font-size:30px; }
        .grades-empty strong { color:white; }
        .grades-empty p { margin:0; font-size:13px; }
        .grades-assessment-list { display:flex; flex-direction:column; gap:13px; }
        .grades-assessment-card { padding:16px; border:1px solid #303a54; border-radius:11px; background:#11182a; }
        .grades-assessment-top { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; }
        .grades-subject { color:#c4b7ff; font-size:11px; font-weight:700; }
        .grades-assessment-top h3 { margin:6px 0 0; color:white; font-size:17px; }
        .grades-card-badges { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:7px; }
        .grades-coefficient { padding:6px 9px; border-radius:8px; background:#30284e; color:#c4b7ff; font-size:12px; white-space:nowrap; }
        .grades-status { padding:6px 9px; border-radius:8px; font-size:11px; font-weight:700; white-space:nowrap; }
        .grades-status.published { background:#183f35; color:#72dfb2; }
        .grades-status.draft { background:#44351e; color:#f3c77c; }
        .grades-assessment-meta { display:flex; flex-wrap:wrap; gap:14px; margin:14px 0; color:#aab3c9; font-size:12px; }
        .grades-details { padding-top:12px; border-top:1px solid #303a54; color:#c4b7ff; font-size:13px; }
        .grades-details summary { cursor:pointer; }
        .grades-details .grades-table-scroll { margin-top:12px; }
        .grades-actions,.grades-edit-actions { display:flex; flex-wrap:wrap; gap:9px; margin-top:15px; }
        .grades-action { padding:9px 12px; border:1px solid #3a4561; border-radius:8px; background:#202a42; color:#e8eaf3; font-size:12px; font-weight:600; cursor:pointer; }
        .grades-action:disabled { opacity:.5; cursor:not-allowed; }
        .grades-action.edit { border-color:#514477; background:#30284e; color:#d1c6ff; }
        .grades-action.publish,.grades-action.save { border-color:#28634e; background:#183f35; color:#72dfb2; }
        .grades-action.unpublish { border-color:#755b32; background:#44351e; color:#f3c77c; }
        .grades-action.delete { border-color:#75404a; background:#44232e; color:#ff9eaa; }
        .grades-action.cancel { background:#202a42; color:#dce1ef; }
        .grades-edit-form { margin-top:15px; padding-top:16px; border-top:1px solid #303a54; }
        .grades-edit-form > h4 { margin:0 0 16px; color:white; font-size:15px; }
        .grades-edit-actions { justify-content:flex-end; }
        @media(max-width:700px) {
          .grades-heading { align-items:flex-start; flex-direction:column; }
          .grades-summary { grid-template-columns:1fr; }
          .grades-form-grid { grid-template-columns:1fr; }
          .grades-form-footer { align-items:stretch; flex-direction:column; }
          .grades-form-footer .modal-submit { width:100%; }
          .grades-assessment-top { flex-direction:column; }
          .grades-card-badges { justify-content:flex-start; }
        }
      `}</style>
    </div>
  );
}

export default Grades;
