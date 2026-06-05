import { useState } from "react";
import "./index.css"

function App() {
  const [num, setNum] = useState<string>("");
  const [name, setName] = useState<string>()
  return (
    <div>
      <h1>
        <div>
          <label htmlFor="number">학번: </label>
          <input type="text" name="number" id="number" onChange={(e) => {setNum((e.target as HTMLInputElement).value)}}/>
        </div>
        <div>
          <label htmlFor="name">이름: </label>
          <input type="text" name="name" id="name" onChange={(e) => {setName((e.target as HTMLInputElement).value)}}/>
        </div>
      </h1>
    </div>
  );
}

export default App;