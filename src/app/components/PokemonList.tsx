"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Interfaz para definir la estructura de los datos del Pokémon
interface Pokemon {
  name: string;
  url: string;
  id: string;
  image: string;
  types: { type: { name:string } }[];
}

// Objeto para los colores y gradientes de cada tipo de Pokémon
const typeColors = {
  normal: { bg: 'bg-gray-400', gradient: 'from-gray-400 to-gray-500' },
  fire: { bg: 'bg-red-500', gradient: 'from-red-500 to-orange-500' },
  water: { bg: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600' },
  electric: { bg: 'bg-yellow-400', gradient: 'from-yellow-300 to-yellow-500' },
  grass: { bg: 'bg-green-500', gradient: 'from-green-400 to-teal-500' },
  ice: { bg: 'bg-cyan-300', gradient: 'from-cyan-300 to-blue-300' },
  fighting: { bg: 'bg-orange-700', gradient: 'from-orange-700 to-red-800' },
  poison: { bg: 'bg-purple-600', gradient: 'from-purple-500 to-indigo-600' },
  ground: { bg: 'bg-yellow-600', gradient: 'from-yellow-600 to-amber-800' },
  flying: { bg: 'bg-indigo-400', gradient: 'from-indigo-300 to-sky-400' },
  psychic: { bg: 'bg-pink-500', gradient: 'from-pink-400 to-purple-500' },
  bug: { bg: 'bg-lime-500', gradient: 'from-lime-400 to-green-600' },
  rock: { bg: 'bg-yellow-700', gradient: 'from-yellow-700 to-stone-800' },
  ghost: { bg: 'bg-indigo-800', gradient: 'from-indigo-800 to-slate-900' },
  dragon: { bg: 'bg-indigo-600', gradient: 'from-indigo-500 to-purple-800' },
  dark: { bg: 'bg-gray-800', gradient: 'from-gray-800 to-black' },
  steel: { bg: 'bg-gray-500', gradient: 'from-gray-500 to-slate-600' },
  fairy: { bg: 'bg-pink-300', gradient: 'from-pink-300 to-fuchsia-400' },
};

// Función asíncrona para obtener los datos de los Pokémon
async function getPokemons(offset: number): Promise<Pokemon[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
  const data = await res.json();

  const detailedPokemons = await Promise.all(
    data.results.map(async (p: { name: string; url: string }) => {
      const res = await fetch(p.url);
      const details = await res.json();
      const id = details.id.toString();
      return {
        name: p.name,
        url: p.url,
        id,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        types: details.types,
      };
    })
  );

  return detailedPokemons;
}

export default function PokemonList() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getPokemons(offset).then(newPokemons => {
      setPokemons(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const filteredNewPokemons = newPokemons.filter(p => !existingIds.has(p.id));
        return [...prev, ...filteredNewPokemons];
      });
      setIsLoading(false);
    });
  }, [offset]);

  const handleLoadMore = () => {
    setOffset(prevOffset => prevOffset + 20);
  };

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex justify-center">
          <input 
            type="text"
            placeholder="Buscar Pokémon..."
            className="w-full max-w-xl p-3 bg-gray-800 rounded-full text-white placeholder-gray-400 border border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Aquí se crea la cuadrícula de tarjetas */}
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredPokemons.map((pokemon) => {
            const primaryType = pokemon.types[0].type.name as keyof typeof typeColors;
            const typeStyle = typeColors[primaryType] || typeColors.normal;

            return (
              <Link href={`/pokemon/${pokemon.id}`} key={pokemon.id}>
                {/* Esta es la tarjeta individual de cada Pokémon */}
                <div className={`rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden bg-gradient-to-br ${typeStyle.gradient}`}>
                  <div className="p-5 flex justify-center bg-black/10">
                    <Image
                      src={pokemon.image}
                      alt={pokemon.name}
                      width={150}
                      height={150}
                      className="object-contain h-32 w-32 drop-shadow-lg"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-white/70 font-semibold">N.º {pokemon.id.padStart(4, '0')}</p>
                    <h2 className="mt-1 text-2xl font-bold capitalize">{pokemon.name}</h2>
                    <div className="mt-3 flex gap-2">
                      {pokemon.types.map(({ type }) => (
                        <span key={type.name} className={`text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md bg-white/20`}>
                          {type.name.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </main>
        
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : 'Cargar más Pokémon'}
          </button>
        </div>
      </div>
    </div>
  );
}