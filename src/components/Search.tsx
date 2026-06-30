import type { StudentRow } from "../types";

type SearchProps = {
  students: StudentRow[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (student: StudentRow) => void;
};

function Search({ students, loading, onRefresh, onEdit }: SearchProps) {
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
              <th>수정</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  {loading ? "불러오는 중..." : "저장된 학생이 아직 없습니다."}
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.student_no}</td>
                  <td>{student.name}</td>
                  <td>
                    <button className="ghost-button" onClick={() => onEdit(student)} type="button">
                      수정
                    </button>
                  </td>
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
