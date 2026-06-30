type InsertProps = {
  num: string;
  name: string;
  actionLabel: string;
  onNumChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onSave: () => void;
};

function Insert({ num, name, actionLabel, onNumChange, onNameChange, onSave }: InsertProps) {
  return (
    <div className="form-panel">
      <div className="field">
        <label htmlFor="number">학번</label>
        <input
          type="text"
          name="number"
          id="number"
          value={num}
          onChange={(e) => onNumChange(e.target.value)}
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
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="예: dimigo1"
        />
      </div>

      <button className="primary-button" onClick={onSave} type="button">
        {actionLabel}
      </button>
    </div>
  );
}

export default Insert;
