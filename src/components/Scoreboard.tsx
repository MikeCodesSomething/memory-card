import { useState } from "react"

export default function Scoreboard() {
    const [score, setScore] = useState(0)

    return (<>
    <div>Score: {score}</div>
    <button onClick={() => setScore(score+1)}>increase score</button>
    </>)
}