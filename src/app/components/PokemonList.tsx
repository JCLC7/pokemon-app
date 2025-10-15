"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Pokemon {
  name: string;
  url: string;
  id: string;
  image: string;
}

async function getPokemons(offset: number): Promise<Pokemon[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
  const data = await res.json();

  const pokemons: Pokemon[] = data.results.map((p: { name: string; url: string }) => {
    const id = p.url.split("/").filter(Boolean).pop()!;
    return {
      name: p.name,
      url: p.url,
      id,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    };
  });

  return pokemons;
}

export default function PokemonList() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    getPokemons(offset).then(setPokemons);
  }, [offset]);

  const handleNext = () => {
    setOffset(offset + 20);
  };

  const handlePrevious = () => {
    setOffset(Math.max(0, offset - 20));
  };

  return (
    <div>
      <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center transition-transform transform hover:scale-105">
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              width={96}
              height={96}
              priority={false}
            />
            <h2 className="mt-2 text-lg font-semibold capitalize">{pokemon.name}</h2>
          </div>
        ))}
      </main>
      <div className="flex justify-center mt-8">
        <button
          onClick={handlePrevious}
          disabled={offset === 0}
          className="bg-red-600 text-white px-4 py-2 rounded-md mr-4 disabled:bg-gray-400"
        >
          Anterior
        </button>
        <button
          onClick={handleNext}
          className="bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
