import { useState, useEffect } from "react";

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
    <div>
      {pokemonDetails.length > 0 &&
        pokemonDetails.map((pokemon) => (
          <img key={pokemon.id} src={pokemon.url}></img>
        ))}
    </div>
  );
}
