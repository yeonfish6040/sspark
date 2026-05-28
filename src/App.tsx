mport { useState } from "react";

function App() {
  const [a, setA] = useState<number>(0);
  const [b, setB] = useState<number>(0);
  const [tgt, setTgt] = useState<string>("");

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rot, setRot] = useState(0);

  const goCrazy = () => {
    setPos({
      x: Math.random() * 200 - 100,
      y: Math.random() * 120 - 60,
    });
    setRot(Math.random() * 720 - 360);
  };
  return (
    <div>
      <h1>3420 이연준 4칙연산</h1>

      첫번째 수: <input type='number' onInput={(e) => setA(parseInt((e.target as any).value))} /> <br />
      두번째 수: <input type='number' onInput={(e) => setB(parseInt((e.target as any).value))} />
      <hr/>
      <button onClick={() => {setTgt("더하기: "+(a+b))}}>더하기</button>
      <button onClick={() => {setTgt("빼기: "+(a-b))}}>빼기</button>
      <button onClick={() => {setTgt("곱하기: "+(a*b))}}>곱하기</button>
      <button onClick={() => {setTgt("나누기: "+(a/b))}}>나누기</button>
      <button onMouseEnter={goCrazy}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rot}deg)`,
                transition: "0.18s cubic-bezier(.2, 1.8, .5, -0.5)",
                padding: "12px 24px",
                fontSize: "18px",
                cursor: "pointer",
              }}
              onClick={() => {open("https://www.youtube.com/watch?v=oHg5SJYRHA0")}}>돌기</button>
      <p>{tgt}</p>
    </div>
  );
}

export default App;