export default function Scoreboard( {score, gameOver} : {score: number, gameOver: boolean} ) {
    return (<>
    {gameOver && score<10 && <h2>Game Over</h2>}
    {gameOver && score===10 && <h2>You Win!</h2>}
    <div>Score: {score}</div>
    {gameOver && <button onClick={() => window.location.reload()}>Play Again</button>}
    </>)
}