import Insert from "./Insert";

type StudentEditPageProps = {
  num: string;
  name: string;
  onNumChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onSave: () => void;
  onBack: () => void;
};

function StudentEditPage({
  num,
  name,
  onNumChange,
  onNameChange,
  onSave,
  onBack,
}: StudentEditPageProps) {
  return (
    <div className="edit-page">
      <div className="edit-page-header">
        <button className="ghost-button" onClick={onBack} type="button">
          돌아가기
        </button>
        <h1>학생 정보 수정</h1>
      </div>
      <Insert
        num={num}
        name={name}
        actionLabel="수정"
        onNumChange={onNumChange}
        onNameChange={onNameChange}
        onSave={onSave}
      />
    </div>
  );
}

export default StudentEditPage;
