import ScoreInsert from "./ScoreInsert";

type ScoreEditPageProps = {
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
    </div>
  );
}

export default ScoreEditPage;
