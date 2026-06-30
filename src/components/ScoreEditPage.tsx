import ScoreInsert from "./ScoreInsert";

type ScoreEditPageProps = {
  hasTarget: boolean;
  studentNo: string;
  name: string;
  korean: string;
  english: string;
  math: string;
  onStudentNoChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onKoreanChange: (value: string) => void;
  onEnglishChange: (value: string) => void;
  onMathChange: (value: string) => void;
  onSave: () => void;
  onBack: () => void;
};

function ScoreEditPage({
  hasTarget,
  studentNo,
  name,
  korean,
  english,
  math,
  onStudentNoChange,
  onNameChange,
  onKoreanChange,
  onEnglishChange,
  onMathChange,
  onSave,
  onBack,
}: ScoreEditPageProps) {
  return (
    <div className="edit-page">
      <div className="edit-page-header">
        <button className="ghost-button" onClick={onBack} type="button">
          돌아가기
        </button>
        <h1>성적 수정</h1>
      </div>
      {hasTarget ? (
        <ScoreInsert
          studentNo={studentNo}
          name={name}
          korean={korean}
          english={english}
          math={math}
          actionLabel="수정"
          onStudentNoChange={onStudentNoChange}
          onNameChange={onNameChange}
          onKoreanChange={onKoreanChange}
          onEnglishChange={onEnglishChange}
          onMathChange={onMathChange}
          onSave={onSave}
        />
      ) : (
        <div className="empty-note">목록에서 수정 버튼을 눌러주세요.</div>
      )}
    </div>
  );
}

export default ScoreEditPage;
