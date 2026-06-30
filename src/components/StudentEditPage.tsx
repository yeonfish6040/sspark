import Insert from "./Insert";

type StudentEditPageProps = {
  hasTarget: boolean;
  num: string;
  name: string;
  onNumChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onSave: () => void;
  onBack: () => void;
};

function StudentEditPage({
  hasTarget,
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
      {hasTarget ? (
        <Insert
          num={num}
          name={name}
          actionLabel="수정"
          onNumChange={onNumChange}
          onNameChange={onNameChange}
          onSave={onSave}
        />
      ) : (
        <div className="empty-note">목록에서 수정 버튼을 눌러주세요.</div>
      )}
    </div>
  );
}

export default StudentEditPage;
