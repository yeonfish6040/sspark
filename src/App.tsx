import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Insert from "./components/Insert";
import Search from "./components/Search";
import type { StudentRow } from "./types";

const client = axios.create({
  baseURL: "http://yeonfishvm.local:3001/",
  headers: {
    "Content-Type": "application/json",
  },
});

type View = "insert" | "search";

function App() {
  const [view, setView] = useState<View>("insert");
  const [num, setNum] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("준비됨");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    void loadStudents();
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

  return (
    <div className="page-shell">
      <main className="app-shell">
        <section className="hero">
          <div className="hero-copy">
            <h1>학생 정보를 저장하고 바로 확인</h1>
          </div>

          <div className="status-pill">{message}</div>
        </section>

        <div className="workspace">
          <aside className="menu-panel">
            <button
              className={view === "insert" ? "menu-button active" : "menu-button"}
              onClick={() => setView("insert")}
              type="button"
            >
              삽입
            </button>
            <button
              className={view === "search" ? "menu-button active" : "menu-button"}
              onClick={() => {
                setView("search");
                void loadStudents();
              }}
              type="button"
            >
              검색
            </button>
          </aside>

          <section className="page-panel">
            {view === "insert" ? (
              <Insert
                num={num}
                name={name}
                onNumChange={setNum}
                onNameChange={setName}
                onSave={save}
              />
            ) : (
              <Search students={students} loading={loading} onRefresh={() => void loadStudents()} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
