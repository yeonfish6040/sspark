type ScoreInsertProps = {
  name: string;
  korean: string;
  english: string;
  math: string;
  onNameChange: (value: string) => void;
  onKoreanChange: (value: string) => void;
  onEnglishChange: (value: string) => void;
  onMathChange: (value: string) => void;
  onSave: () => void;
};

function ScoreInsert({
  name,
  korean,
  english,
  math,
  onNameChange,
  onKoreanChange,
  onEnglishChange,
  onMathChange,
  onSave,
}: ScoreInsertProps) {
  return (
    <div className="score-form">
      <div className="score-field">
        <label htmlFor="score-name">이름:</label>
        <input
          type="text"
          id="score-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      <div className="score-field">
        <label htmlFor="score-korean">국어 점수:</label>
        <input
          type="text"
          id="score-korean"
          value={korean}
          onChange={(e) => onKoreanChange(e.target.value)}
        />
      </div>

      <div className="score-field">
        <label htmlFor="score-english">영어 점수:</label>
        <input
          type="text"
          id="score-english"
          value={english}
          onChange={(e) => onEnglishChange(e.target.value)}
        />
      </div>

      <div className="score-field">
        <label htmlFor="score-math">수학 점수:</label>
        <input
          type="text"
          id="score-math"
          value={math}
          onChange={(e) => onMathChange(e.target.value)}
        />
      </div>

      <button className="primary-button" onClick={onSave} type="button">
        저장
      </button>
    </div>
  );
}

export default ScoreInsert;
