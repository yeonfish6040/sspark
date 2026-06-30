import { useEffect, useState, type CSSProperties } from "react";
import axios from "axios";
import "./App.css";
import Insert from "./components/Insert";
import Search from "./components/Search";
import ScoreInsert from "./components/ScoreInsert";
import ScoreConditionSearch from "./components/ScoreConditionSearch";
import ScoreEditPage from "./components/ScoreEditPage";
import ScoreSearch from "./components/ScoreSearch";
import StudentEditPage from "./components/StudentEditPage";
import type { ScoreRow, StudentRow } from "./types";

const client = axios.create({
  baseURL: "http://yeonfishvm.local:3001/",
  headers: {
    "Content-Type": "application/json",
  },
});

type View =
  | "student-insert"
  | "student-edit"
  | "student-search"
  | "score-insert"
  | "score-edit"
  | "score-search"
  | "score-condition-search";

function App() {
  const [view, setView] = useState<View>("student-insert");
  const [num, setNum] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("준비됨");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [studentEditingNo, setStudentEditingNo] = useState<string | null>(null);
  const [scoreName, setScoreName] = useState<string>("");
  const [scoreStudentNo, setScoreStudentNo] = useState<string>("");
  const [korean, setKorean] = useState<string>("");
  const [english, setEnglish] = useState<string>("");
  const [math, setMath] = useState<string>("");
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [scoreLoading, setScoreLoading] = useState<boolean>(false);
  const [scoreEditingNo, setScoreEditingNo] = useState<string | null>(null);
  const [scoreSearchTerm, setScoreSearchTerm] = useState<string>("");
  const [conditionStudentNo, setConditionStudentNo] = useState<string>("");
  const [conditionName, setConditionName] = useState<string>("");
  const [fireworks] = useState(() =>
    Array.from({ length: 42 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 6 + Math.random() * 16,
      hue: Math.floor(Math.random() * 360),
      delay: Math.random() * 4,
      duration: 1.6 + Math.random() * 2.4,
      x: (Math.random() * 2 - 1) * 220,
      y: (Math.random() * 2 - 1) * 220,
      rotate: Math.random() * 360,
    })),
  );

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await client.get<{ ok: true; students: StudentRow[] }>("/students");
      setStudents(response.data.students);
    } catch (error) {
      console.log(error);
      setMessage("목록을 불러오지 못했음");
    } finally {
      setLoading(false);
    }
  };

  const loadScores = async () => {
    setScoreLoading(true);
    try {
      const response = await client.get<{ ok: true; scores: ScoreRow[] }>("/scores");
      setScores(response.data.scores);
    } catch (error) {
      console.log(error);
      setMessage("성적 목록을 불러오지 못했음");
    } finally {
      setScoreLoading(false);
    }
  };

  const searchScores = async () => {
    setScoreLoading(true);
    try {
      const response = await client.get<{ ok: true; scores: ScoreRow[] }>("/scores/search", {
        params: {
          q: scoreSearchTerm,
        },
      });
      setScores(response.data.scores);
    } catch (error) {
      console.log(error);
      setMessage("성적 검색 실패");
    } finally {
      setScoreLoading(false);
    }
  };

  const searchConditionalScores = async () => {
    setScoreLoading(true);
    try {
      const response = await client.get<{ ok: true; scores: ScoreRow[] }>(
        "/scores/conditional-search",
        {
          params: {
            student_no: conditionStudentNo,
            name: conditionName,
          },
        },
      );
      setScores(response.data.scores);
    } catch (error) {
      console.log(error);
      setMessage("조건부 성적 검색 실패");
    } finally {
      setScoreLoading(false);
    }
  };

  useEffect(() => {
    void loadStudents();
    void loadScores();
  }, []);

  const save = async () => {
    const studentKey = studentEditingNo ?? num.trim();
    const wasEditing = studentKey.length > 0;
    setMessage("저장 중...");
    try {
      if (wasEditing) {
        await client.put(`/students/${encodeURIComponent(studentKey)}`, { student_no: num, name });
        setMessage("수정 완료");
      } else {
        await client.post("/save", { num, name });
        setMessage("저장 완료");
      }
      setNum("");
      setName("");
      setStudentEditingNo(null);
      await loadStudents();
      if (wasEditing) {
        setView("student-search");
      }
    } catch (error) {
      console.log(error);
      setMessage(wasEditing ? "수정 실패" : "저장 실패");
    }
  };

  const saveScore = async () => {
    const scoreKey = scoreEditingNo ?? scoreStudentNo.trim();
    const wasEditing = scoreKey.length > 0;
    setMessage("성적 저장 중...");
    try {
      const payload = {
        student_no: scoreStudentNo,
        name: scoreName,
        korean,
        english,
        math,
      };

      if (wasEditing) {
        await client.put(`/scores/${encodeURIComponent(scoreKey)}`, payload);
        setMessage("성적 수정 완료");
      } else {
        await client.post("/scores", payload);
        setMessage("성적 저장 완료");
      }

      setScoreStudentNo("");
      setScoreName("");
      setKorean("");
      setEnglish("");
      setMath("");
      setScoreEditingNo(null);
      await loadScores();
      if (wasEditing) {
        setView("score-search");
      }
    } catch (error) {
      console.log(error);
      setMessage(wasEditing ? "성적 수정 실패" : "성적 저장 실패");
    }
  };

  const editStudent = (student: StudentRow) => {
    setView("student-edit");
    setStudentEditingNo(student.student_no);
    setNum(student.student_no);
    setName(student.name);
    setMessage("학생 수정 중");
  };

  const editScore = (score: ScoreRow) => {
    setView("score-edit");
    setScoreEditingNo(score.student_no);
    setScoreStudentNo(score.student_no);
    setScoreName(score.name);
    setKorean(score.korean);
    setEnglish(score.english);
    setMath(score.math);
    setMessage("성적 수정 중");
  };

  const resetDatabase = async () => {
    const confirmed = window.confirm("DB를 초기화하면 학생/성적 데이터가 모두 삭제됩니다. 계속할까요?");
    if (!confirmed) {
      return;
    }

    setMessage("DB 초기화 중...");
    try {
      await client.post("/admin/reset-db");
      setMessage("DB 초기화 완료");
      setStudents([]);
      setScores([]);
      await loadStudents();
      await loadScores();
    } catch (error) {
      console.log(error);
      setMessage("DB 초기화 실패");
    }
  };

  const pageTitle =
    view === "student-insert"
      ? "학생 정보 입력"
      : view === "student-edit"
        ? "학생 정보 수정"
      : view === "student-search"
        ? "저장된 학생 목록"
      : view === "score-insert"
          ? "성적 입력"
          : view === "score-edit"
            ? "성적 수정"
          : view === "score-search"
            ? "저장된 성적 목록"
            : "조건부 성적 검색";

  return (
    <div className="page-shell">
      <div className="fireworks-layer" aria-hidden="true">
        {fireworks.map((firework) => (
          <span
            key={firework.id}
            className="firework"
            style={
              {
                "--left": `${firework.left}%`,
                "--top": `${firework.top}%`,
                "--size": `${firework.size}px`,
                "--hue": firework.hue,
                "--delay": `${firework.delay}s`,
                "--duration": `${firework.duration}s`,
                "--x": `${firework.x}px`,
                "--y": `${firework.y}px`,
                "--rotate": `${firework.rotate}deg`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <main className="app-shell">
        <div className="workspace">
          <aside className="menu-panel">
            <h2 className="menu-title">메뉴</h2>
            <button
              className={view === "student-insert" ? "menu-button active" : "menu-button"}
              onClick={() => {
                setView("student-insert");
                setStudentEditingNo(null);
              }}
              type="button"
            >
              입력
            </button>
            <button
              className={view === "student-search" ? "menu-button active" : "menu-button"}
              onClick={() => {
                setView("student-search");
                void loadStudents();
              }}
              type="button"
            >
              검색
            </button>
            <button
              className={view === "student-edit" ? "menu-button active" : "menu-button"}
              onClick={() => {
                setView("student-edit");
                setStudentEditingNo(null);
                setNum("");
                setName("");
              }}
              type="button"
            >
              학생수정
            </button>
            <button
              className={view === "score-insert" ? "menu-button active" : "menu-button"}
              onClick={() => {
                setView("score-insert");
                setScoreEditingNo(null);
              }}
              type="button"
            >
              성적입력
            </button>
            <button
              className={view === "score-search" ? "menu-button active" : "menu-button"}
              onClick={() => {
                setView("score-search");
                void loadScores();
              }}
              type="button"
            >
              성적검색
            </button>
            <button
              className={view === "score-edit" ? "menu-button active" : "menu-button"}
              onClick={() => {
                setView("score-edit");
                setScoreEditingNo(null);
                setScoreStudentNo("");
                setScoreName("");
                setKorean("");
                setEnglish("");
                setMath("");
              }}
              type="button"
            >
              성적수정
            </button>
            <button
              className={view === "score-condition-search" ? "menu-button active" : "menu-button"}
              onClick={() => {
                setView("score-condition-search");
                void loadScores();
              }}
              type="button"
            >
              조건부성적검색
            </button>
            <button className="menu-button reset" onClick={() => void resetDatabase()} type="button">
              DB초기화
            </button>
          </aside>

          <section className="page-panel">
            {view === "student-edit" || view === "score-edit" ? null : (
              <div className="page-head">
                <h1>{pageTitle}</h1>
                <div className="status-pill">{message}</div>
              </div>
            )}
            {view === "student-insert" ? (
              <Insert
                num={num}
                name={name}
                actionLabel="저장"
                onNumChange={setNum}
                onNameChange={setName}
                onSave={save}
              />
            ) : view === "student-edit" ? (
              <StudentEditPage
                num={num}
                name={name}
                onNumChange={setNum}
                onNameChange={setName}
                onSave={save}
                onBack={() => {
                  setView("student-search");
                  setStudentEditingNo(null);
                  setNum("");
                  setName("");
                }}
              />
            ) : view === "student-search" ? (
              <Search
                students={students}
                loading={loading}
                onRefresh={() => void loadStudents()}
                onEdit={editStudent}
              />
            ) : view === "score-insert" ? (
              <ScoreInsert
                studentNo={scoreStudentNo}
                name={scoreName}
                korean={korean}
                english={english}
                math={math}
                actionLabel="저장"
                onStudentNoChange={setScoreStudentNo}
                onNameChange={setScoreName}
                onKoreanChange={setKorean}
                onEnglishChange={setEnglish}
                onMathChange={setMath}
                onSave={saveScore}
              />
            ) : view === "score-edit" ? (
              <ScoreEditPage
                studentNo={scoreStudentNo}
                name={scoreName}
                korean={korean}
                english={english}
                math={math}
                onStudentNoChange={setScoreStudentNo}
                onNameChange={setScoreName}
                onKoreanChange={setKorean}
                onEnglishChange={setEnglish}
                onMathChange={setMath}
                onSave={saveScore}
                onBack={() => {
                  setView("score-search");
                  setScoreEditingNo(null);
                  setScoreStudentNo("");
                  setScoreName("");
                  setKorean("");
                  setEnglish("");
                  setMath("");
                }}
              />
            ) : view === "score-search" ? (
              <ScoreSearch
                searchTerm={scoreSearchTerm}
                scores={scores}
                loading={scoreLoading}
                onSearchTermChange={setScoreSearchTerm}
                onSearch={() => void searchScores()}
                onRefresh={() => void loadScores()}
                onEdit={editScore}
              />
            ) : (
              <ScoreConditionSearch
                studentNo={conditionStudentNo}
                name={conditionName}
                scores={scores}
                loading={scoreLoading}
                onStudentNoChange={setConditionStudentNo}
                onNameChange={setConditionName}
                onSearch={() => void searchConditionalScores()}
                onRefresh={() => void loadScores()}
                onEdit={editScore}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
