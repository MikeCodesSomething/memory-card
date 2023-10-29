import Intro from "./components/Intro";
import Scoreboard from "./components/Scoreboard";
import Gameboard from "./components/Gameboard";
import "./App.css";


function App() {
  return (
    <div className="App">
      {/* project starts here */}
      <Intro />
      <Scoreboard />
      <Gameboard />

    
    </div>
  );
}

export default App;
