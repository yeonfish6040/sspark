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

function App() {
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

        <div className="content-flex">
          <div className="content-pane">
            <Insert
              num={num}
              name={name}
              onNumChange={setNum}
              onNameChange={setName}
              onSave={save}
            />
          </div>

          <div className="content-pane">
            <Search students={students} loading={loading} onRefresh={() => void loadStudents()} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
