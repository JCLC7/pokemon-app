'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PokemonDetailComponent, { Pokemon } from '@/app/components/PokemonDetail';
import { usePokedex } from '@/app/context/PokedexContext';

// Objeto de colores (duplicado aquí para usarlo en el estado de carga)
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

// Componente para el esqueleto de carga
function LoadingSkeleton({ typeName }: { typeName?: string }) {
  const typeStyle = (typeName && typeColors[typeName as keyof typeof typeColors]) || { gradient: 'from-gray-800 to-gray-900' };
  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center pt-28 p-4 bg-gradient-to-br ${typeStyle.gradient}`}>
      <div className="text-white text-2xl font-bold animate-pulse">
        Cargando Pokémon...
      </div>
    </div>
  );
}

export default function PokemonDetailPage() {
  const params = useParams();
  const { id } = params;
  const { getPokemonById, updatePokemonDetails } = usePokedex();

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener datos parciales síncronamente para el color de fondo
  const partialPokemon = typeof id === 'string' ? getPokemonById(id) : undefined;
  const primaryType = partialPokemon?.types?.[0]?.type.name;

  useEffect(() => {
    if (typeof id !== 'string') return;

    const fetchPokemonData = async () => {
      // El pokemonFromContext ya lo tenemos como partialPokemon
      if (partialPokemon && partialPokemon.stats) {
        setPokemon(partialPokemon);
        setIsLoading(false);
      } else {
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          if (!res.ok) throw new Error('Failed to fetch Pokémon');
          const details: Pokemon = await res.json();
          const fullDetails = { ...partialPokemon, ...details };
          setPokemon(fullDetails);
          updatePokemonDetails(fullDetails);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPokemonData();
  }, [id, partialPokemon, updatePokemonDetails]);

  return (
    <div>
      <Link href="/" className="absolute top-4 left-4 z-30 bg-white/30 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-full hover:bg-white/50 transition-all" scroll={false}>
        &larr; Volver a la lista
      </Link>

      {isLoading && <LoadingSkeleton typeName={primaryType} />}

      {!isLoading && pokemon && (
        <PokemonDetailComponent pokemon={pokemon as Pokemon} />
      )}
    </div>
  );
}