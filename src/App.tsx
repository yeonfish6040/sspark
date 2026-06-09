import { useState } from "react";
import "./index.css"
import axios from "axios";

function App() {
  const client = axios.create({
    baseURL: "http://yeonfishvm.local:3001/",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const [num, setNum] = useState<string>("");
  const [name, setName] = useState<string>();
  const [message, setMessage] = useState<string>();

  const save = async () => {
    setMessage("기다려");
    try {
      await client.post("/save", { num, name });
      setMessage("성공")
    } catch (e) {
      console.log(e);
      setMessage("되겠냐 ㅋ");
    }
  }

  return (
    <div>
      <div>
        <label htmlFor="number">학번: </label>
        <input type="text" name="number" id="number" onChange={(e) => {setNum((e.target as HTMLInputElement).value)}}/>
      </div>
      <div>
        <label htmlFor="name">이름: </label>
        <input type="text" name="name" id="name" onChange={(e) => {setName((e.target as HTMLInputElement).value)}}/>
      </div>
      <div>
        <button onClick={() => save()}>전송</button>
      </div>
      <h3>{message}</h3>
    </div>
  );
}

export default App;
