import Link from "next/link";
import PokemonDetail from "@/app/components/PokemonDetail";
import type { Pokemon } from "@/app/components/PokemonDetail"; // Importamos el tipo

// Traemos la función para obtener los datos a este archivo
async function getPokemon(id: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch Pokémon data');
  }
  return res.json();
}


export default async function PokemonDetailPage({ params }: { params: { id:string } }) {

  const awaitedParams = await params;
  // 1. La página AHORA se encarga de buscar los datos del Pokémon
  const pokemon = await getPokemon(awaitedParams.id);

  return (
    <>
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-30 flex items-center gap-2 text-white font-semibold bg-black/30 hover:bg-black/50 transition-all px-4 py-2 rounded-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Volver a la lista
      </Link>
      
      {/* 2. Le pasamos el objeto "pokemon" completo al componente, en lugar de solo el id */}
      <PokemonDetail pokemon={pokemon} />
    </>
  );
}