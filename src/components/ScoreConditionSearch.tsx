import type { ScoreRow } from "../types";

type ScoreConditionSearchProps = {
  studentNo: string;
  name: string;
  scores: ScoreRow[];
  loading: boolean;
  onStudentNoChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
};

function ScoreConditionSearch({
  studentNo,
  name,
  scores,
  loading,
  onStudentNoChange,
  onNameChange,
  onSearch,
  onRefresh,
}: ScoreConditionSearchProps) {
  return (
    <div className="list-panel">
      <div className="score-conditions">
        <div className="score-field">
          <label htmlFor="condition-student-no">학번:</label>
          <input
            id="condition-student-no"
            type="text"
            value={studentNo}
            onChange={(e) => onStudentNoChange(e.target.value)}
          />
        </div>
        <div className="score-field">
          <label htmlFor="condition-name">이름:</label>
          <input
            id="condition-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div className="score-condition-actions">
          <button className="ghost-button" onClick={onSearch} type="button">
            검색
          </button>
          <button className="ghost-button" onClick={onRefresh} type="button">
            전체
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>학번</th>
              <th>이름</th>
              <th>국어</th>
              <th>영어</th>
              <th>수학</th>
              <th>합계</th>
              <th>평균</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-state">
                  {loading ? "불러오는 중..." : "조회된 성적이 없습니다."}
                </td>
              </tr>
            ) : (
              scores.map((score) => (
                <tr key={score.id}>
                  <td>{score.id}</td>
                  <td>{score.student_no}</td>
                  <td>{score.name}</td>
                  <td>{score.korean}</td>
                  <td>{score.english}</td>
                  <td>{score.math}</td>
                  <td>{score.total}</td>
                  <td>{score.average.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScoreConditionSearch;
