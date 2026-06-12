import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

type StudentRow = {
  id: number;
  student_no: string;
  name: string;
};

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

        <section className="content-grid">
          <div className="form-panel">
            <h2>저장</h2>
            <div className="field">
              <label htmlFor="number">학번</label>
              <input
                type="text"
                name="number"
                id="number"
                value={num}
                onChange={(e) => setNum(e.target.value)}
                placeholder="예: 3505"
              />
            </div>

            <div className="field">
              <label htmlFor="name">이름</label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: dimigo1"
              />
            </div>

            <button className="primary-button" onClick={save}>
              전송
            </button>
          </div>

          <div className="list-panel">
            <div className="panel-header">
              <div>
                <h2>저장된 목록</h2>
                <p>{loading ? "불러오는 중..." : `${students.length}건 저장됨`}</p>
              </div>
              <button className="ghost-button" onClick={() => void loadStudents()}>
                새로고침
              </button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>학번</th>
                    <th>이름</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="empty-state">
                        저장된 학생이 아직 없습니다.
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.student_no}</td>
                        <td>{student.name}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
