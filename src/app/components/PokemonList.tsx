'use client';

import { useEffect, useLayoutEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePokedex } from '../context/PokedexContext';

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

export default function PokemonList() {
  const {
    allPokemons,
    isLoading,
    currentPage,
    searchTerm,
    scrollPosition,
    setCurrentPage,
    setSearchTerm,
    setScrollPosition,
    ensurePokemonDetails,
  } = usePokedex();

  const pokemonsPerPage = 20;

  // Lógica de filtrado y paginación
  const filteredPokemons = allPokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);
  const paginatedPokemons = filteredPokemons.slice(
    (currentPage - 1) * pokemonsPerPage,
    currentPage * pokemonsPerPage
  );

  // --- EFECTOS DE REACT ---

  // Guardar posición de scroll al salir de la página
  useEffect(() => {
    return () => {
      setScrollPosition(window.scrollY);
    };
  }, [setScrollPosition]);

  // Restaurar posición de scroll al volver a la página
  useEffect(() => {
    if (!isLoading && scrollPosition > 0) {
      const timeoutId = setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: 'auto' });
        setScrollPosition(0);
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, scrollPosition, setScrollPosition]);

  // Resetear la página a 1 cuando se busca
  useEffect(() => {
    if (searchTerm) {
        setCurrentPage(1);
    }
  }, [searchTerm, setCurrentPage]);

  // Buscar los detalles de los Pokémon visibles cuando cambia la página o el filtro.
  useEffect(() => {
    if (!filteredPokemons.length) return;

    const currentPokemons = filteredPokemons.slice(
      (currentPage - 1) * pokemonsPerPage,
      currentPage * pokemonsPerPage
    );

    currentPokemons.forEach(pokemon => {
      if (!pokemon.types) { // Solo buscar si no tenemos ya los tipos
        ensurePokemonDetails(pokemon);
      }
    });
  }, [currentPage, filteredPokemons, ensurePokemonDetails]);


  // --- MANEJADORES DE EVENTOS ---

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  // --- RENDERIZADO ---

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <Image src="/pokebola.png" alt="Pokeball loader" width={100} height={100} className="animate-spin mb-4" />
        <h2 className="text-2xl font-bold">Cargando Pokédex...</h2>
        <p className="text-gray-400">Esto puede tardar un momento la primera vez.</p>
      </div>
    );
  }

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

        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {paginatedPokemons.map((pokemon) => {
            const primaryType = pokemon.types?.[0]?.type.name as keyof typeof typeColors;
            const typeStyle = (primaryType && typeColors[primaryType]) || typeColors.normal;

            return (
              <Link href={`/pokemon/${pokemon.id}`} key={pokemon.id} scroll={false}>
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
                    <p className="text-sm text-white/70 font-semibold">N.º {String(pokemon.id).padStart(4, '0')}</p>
                    <h2 className="mt-1 text-2xl font-bold capitalize">{pokemon.name}</h2>
                    <div className="mt-3 flex gap-2">
                      {pokemon.types?.map(({ type }) => (
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

        <div className="flex justify-center items-center mt-12 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-lg font-semibold">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}