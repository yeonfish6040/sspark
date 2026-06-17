import type { StudentRow } from "../types";

type SearchProps = {
  students: StudentRow[];
  loading: boolean;
  onRefresh: () => void;
};

function Search({ students, loading, onRefresh }: SearchProps) {
  return (
    <div className="list-panel">
      <div className="panel-header">
        <button className="ghost-button" onClick={onRefresh} type="button">
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
                  {loading ? "불러오는 중..." : "저장된 학생이 아직 없습니다."}
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
  );
}

export default Search;
