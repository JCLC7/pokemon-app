'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';

// 1. DEFINICIÓN DE INTERFACES
export interface Pokemon {
  name: string;
  url: string;
  id: string;
  image: string;
  types?: { type: { name: string } }[];
  height?: number;
  weight?: number;
  stats?: { base_stat: number; stat: { name: string } }[];
  sprites?: {
    other?: {
      'official-artwork'?: {
        front_default?: string;
      };
    };
  };
}

interface PokedexState {
  allPokemons: Pokemon[];
  isLoading: boolean;
  currentPage: number;
  searchTerm: string;
  scrollPosition: number;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setScrollPosition: (position: number) => void;
  getPokemonById: (id: string) => Pokemon | undefined;
  ensurePokemonDetails: (pokemon: Pokemon) => Promise<void>;
  updatePokemonDetails: (pokemon: Pokemon) => void;
}

// 2. CREACIÓN DEL CONTEXTO
const PokedexContext = createContext<PokedexState | undefined>(undefined);

async function getInitialPokemons(): Promise<Pokemon[]> {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1302');
  const data = await res.json();

  const basicPokemonList: Pokemon[] = data.results.map((p: { name: string; url: string }) => {
    const id = p.url.split('/').filter(Boolean).pop()!;
    return {
      name: p.name,
      url: p.url,
      id,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };
  });

  // 3. Obtener detalles solo para la primera página (primeros 20)
  const detailedFirstPage = await Promise.all(
    basicPokemonList.slice(0, 20).map(async (p) => {
      const res = await fetch(p.url);
      const details = await res.json();
      return { ...p, ...details };
    })
  );

  // 4. Combinar la lista, poniendo los detallados al principio
  const combinedList = [...detailedFirstPage, ...basicPokemonList.slice(20)];

  return combinedList;
}

// 3. CREACIÓN DEL PROVEEDOR
export function PokedexProvider({ children }: { children: ReactNode }) {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const pokemons = await getInitialPokemons();
      setAllPokemons(pokemons);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const getPokemonById = (id: string) => {
    return allPokemons.find(p => p.id === id);
  };

  const updatePokemonDetails = useCallback((pokemon: Pokemon) => {
    setAllPokemons(prev => 
      prev.map(p => p.id === pokemon.id ? { ...p, ...pokemon } : p)
    );
  }, []);

  const ensurePokemonDetails = useCallback(async (pokemon: Pokemon) => {
    // No hacer nada si ya tenemos los detalles (stats es un buen indicador)
    if (pokemon.stats) {
      return;
    }
    try {
      const res = await fetch(pokemon.url);
      const details: Pokemon = await res.json();
      updatePokemonDetails({ ...pokemon, ...details });
    } catch (error) {
      console.error(`Failed to fetch details for ${pokemon.name}`, error);
    }
  }, [updatePokemonDetails]);

  const value = {
    allPokemons,
    isLoading,
    currentPage,
    searchTerm,
    scrollPosition,
    setCurrentPage,
    setSearchTerm,
    setScrollPosition,
    getPokemonById,
    ensurePokemonDetails,
    updatePokemonDetails,
  };

  return <PokedexContext.Provider value={value}>{children}</PokedexContext.Provider>;
}

// 4. HOOK PERSONALIZADO PARA USAR EL CONTEXTO
export function usePokedex() {
  const context = useContext(PokedexContext);
  if (context === undefined) {
    throw new Error('usePokedex must be used within a PokedexProvider');
  }
  return context;
}
