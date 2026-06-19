import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Insert from "./components/Insert";
import Search from "./components/Search";
import ScoreInsert from "./components/ScoreInsert";
import ScoreSearch from "./components/ScoreSearch";
import type { ScoreRow, StudentRow } from "./types";

const client = axios.create({
  baseURL: "http://yeonfishvm.local:3001/",
  headers: {
    "Content-Type": "application/json",
  },
});

type View = "student-insert" | "student-search" | "score-insert" | "score-search";

function App() {
  const [view, setView] = useState<View>("student-insert");
  const [num, setNum] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("준비됨");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [scoreName, setScoreName] = useState<string>("");
  const [korean, setKorean] = useState<string>("");
  const [english, setEnglish] = useState<string>("");
  const [math, setMath] = useState<string>("");
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [scoreLoading, setScoreLoading] = useState<boolean>(false);
  const [scoreSearchTerm, setScoreSearchTerm] = useState<string>("");

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
          name: scoreSearchTerm,
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

  useEffect(() => {
    void loadStudents();
    void loadScores();
  }, []);

  const save = async () => {
    setMessage("저장 중...");
    try {
      await client.post("/save", { num, name });
      setMessage("저장 완료");
      setNum("");
      setName("");
      await loadStudents();
    } catch (error) {
      console.log(error);
      setMessage("저장 실패");
    }
  };

  const saveScore = async () => {
    setMessage("성적 저장 중...");
    try {
      await client.post("/scores", {
        name: scoreName,
        korean,
        english,
        math,
      });
      setMessage("성적 저장 완료");
      setScoreName("");
      setKorean("");
      setEnglish("");
      setMath("");
      await loadScores();
    } catch (error) {
      console.log(error);
      setMessage("성적 저장 실패");
    }
  };

  const pageTitle =
    view === "student-insert"
      ? "학생 정보 입력"
      : view === "student-search"
        ? "저장된 학생 목록"
        : view === "score-insert"
          ? "성적 입력"
          : "저장된 성적 목록";

  return (
    <div className="page-shell">
      <main className="app-shell">
        <div className="workspace">
          <aside className="menu-panel">
            <h2 className="menu-title">메뉴</h2>
            <button
              className={view === "student-insert" ? "menu-button active" : "menu-button"}
              onClick={() => setView("student-insert")}
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
              className={view === "score-insert" ? "menu-button active" : "menu-button"}
              onClick={() => setView("score-insert")}
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
          </aside>

          <section className="page-panel">
            <div className="page-head">
              <h1>{pageTitle}</h1>
              <div className="status-pill">{message}</div>
            </div>
            {view === "student-insert" ? (
              <Insert
                num={num}
                name={name}
                onNumChange={setNum}
                onNameChange={setName}
                onSave={save}
              />
            ) : view === "student-search" ? (
              <Search students={students} loading={loading} onRefresh={() => void loadStudents()} />
            ) : view === "score-insert" ? (
              <ScoreInsert
                name={scoreName}
                korean={korean}
                english={english}
                math={math}
                onNameChange={setScoreName}
                onKoreanChange={setKorean}
                onEnglishChange={setEnglish}
                onMathChange={setMath}
                onSave={saveScore}
              />
            ) : (
              <ScoreSearch
                searchTerm={scoreSearchTerm}
                scores={scores}
                loading={scoreLoading}
                onSearchTermChange={setScoreSearchTerm}
                onSearch={() => void searchScores()}
                onRefresh={() => void loadScores()}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
