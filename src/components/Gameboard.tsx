import { useState, useEffect } from "react";
import Scoreboard from "./Scoreboard";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max) + 1;
}

function getRandomArray(max: number, number: number) {
  const array: { id: number; url: string }[] = [];
  while (array.length < number) {
    const randomId = getRandomInt(max);

    // Check if the ID is not already in the array
    if (!array.some((item) => item.id === randomId)) {
      array.push({ id: randomId, url: "" });
    }
  }

  return array;
}

export default function Gameboard() {
  const [pokemonDetails, setPokemonDetails] = useState<
    { id: number; url: string }[]
  >([]);
  const [selectedPokemonList, setSelectedPokemonList] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);

  function loadImage(
    id: number,
    url: string,
    randomPokemonList: { id: number; url: string }[]
  ) {
    for (const object of randomPokemonList) {
      if (object.id === id) object.url = url;
    }
  }

  function getPokemonImage(pokemonID: number) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`)
      .then((response) => response.json())
      .then((data) => {
        const returnedImageURL =
          data.sprites.other["official-artwork"].front_default;
        return returnedImageURL;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return "";
      });
  }

  function checkCorrect(event: React.MouseEvent<HTMLImageElement>) {
    const selectedPokemonId = event.currentTarget.getAttribute("data-id");
    if (selectedPokemonId === null) return;
    //If a unique pokemon is clicked
    if (selectedPokemonList.indexOf(parseInt(selectedPokemonId)) === -1) {
      //If the player has already selected 9 pokemon, they win when selecting 10th
      if (selectedPokemonList.length === 9) triggerGameOver();
      else {
        const shuffledPokemonList = shuffle(pokemonDetails);
        setPokemonDetails(shuffledPokemonList);
      }
      setSelectedPokemonList([
        ...selectedPokemonList,
        parseInt(selectedPokemonId),
      ]);
    }
    //If a pokemon is clicked twice it's game over
    else triggerGameOver();
  }

  function triggerGameOver() {
    setPokemonDetails([]);
    setGameOver(true);
    return;
  }

  function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  useEffect(() => {
    const randomPokemonList = getRandomArray(151, 10);

    Promise.all(
      randomPokemonList.map((pokemon) =>
        getPokemonImage(pokemon.id).then((url) =>
          loadImage(pokemon.id, url, randomPokemonList)
        )
      )
    ).then(() => {
      setPokemonDetails(randomPokemonList);
    });
  }, []);
  return (
    <>
      <Scoreboard score={selectedPokemonList.length} gameOver={gameOver} />
      <div>
        {pokemonDetails.length > 0 &&
          pokemonDetails.map((pokemon) => (
            <img
              data-id={pokemon.id}
              key={pokemon.id}
              src={pokemon.url}
              onClick={checkCorrect}
            ></img>
          ))}
      </div>
    </>
  );
}
