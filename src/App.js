import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

const API_URL = "https://api.frontendexpert.io/api/fe/wordle-words";

function App() {
  const [solution, setSolution] = useState("world");
  const [guesses, setGuess] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    console.log("key useEffect");

    const handleType = (event) => {
      if (isGameOver) {
        return;
      }

      if (event.key === "Enter") {
        if (currentGuess.length !== 5) {
          return;
        }

        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
        setGuess(newGuesses);
        setCurrentGuess("");

        const isCorrect = solution === currentGuess;

        if (isCorrect) {
          setIsGameOver(true);
          alert("You have won this wordle");
        }

        console.log("last guess: " + guesses[5]);

        if (guesses[4] != null && !isCorrect) {
          console.log("last guess insdie: " + guesses[5]);
          alert("Game over, You are aloser");
        }
      }

      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (currentGuess.length >= 5) {
        return;
      }

      setCurrentGuess(currentGuess + event.key);
      // setCurrentGuess((oldGuess) => oldGuess + event.key);
    };

    window.addEventListener("keydown", handleType);

    return () => window.removeEventListener("keydown", handleType);
  }, [currentGuess, isGameOver, solution, guesses]);

  useEffect(() => {
    const fetchWord = async () => {
      const response = await fetch(API_URL);
      const words = await response.json();
      const randomWord = words[Math.floor(Math.random() * words.length)];

      setSolution(randomWord.toLowerCase());
    };

    fetchWord();
  }, []);

  return (
    <div className="App">
      {guesses.map((guess, i) => {
        console.log(guesses);

        const isNull = guesses.findIndex((val) => val == null);
        const isCurrentGuess = i === isNull;

        //isFinal is used to check guess completed line, in that case we need to show correct and incorrect word
        //isCurrentGuess is used to track first null index of guesses array

        return (
          <Line
            key={i}
            guess={isCurrentGuess ? currentGuess : guess ?? ""}
            solution={solution}
            isFinal={!isCurrentGuess && guess != null}
          />
        );
      })}
    </div>
  );
}

function Line({ guess, solution, isFinal }) {
  console.log("called Line: " + solution);
  const tiles = [];

  for (let i = 0; i < 5; i++) {
    const char = guess[i];
    console.log(char + i);
    let className = "tile";

    if (isFinal) {
      if (char === solution[i]) {
        className += " correct";
      } else if (solution.includes(char)) {
        className += " close";
      } else {
        className += " incorrect";
      }
    }

    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    );
  }

  return <div className="line">{tiles}</div>;
}

export default App;
