import type { ScoreRow } from "../types";

type ScoreSearchProps = {
  searchTerm: string;
  scores: ScoreRow[];
  loading: boolean;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
};

function ScoreSearch({
  searchTerm,
  scores,
  loading,
  onSearchTermChange,
  onSearch,
  onRefresh,
}: ScoreSearchProps) {
  return (
    <div className="list-panel">
      <div className="score-search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          placeholder="이름으로 검색"
        />
        <button className="ghost-button" onClick={onSearch} type="button">
          검색
        </button>
      </div>

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
              <th>이름</th>
              <th>국어</th>
              <th>영어</th>
              <th>수학</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  {loading ? "불러오는 중..." : "저장된 성적이 아직 없습니다."}
                </td>
              </tr>
            ) : (
              scores.map((score) => (
                <tr key={score.id}>
                  <td>{score.id}</td>
                  <td>{score.name}</td>
                  <td>{score.korean}</td>
                  <td>{score.english}</td>
                  <td>{score.math}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScoreSearch;
