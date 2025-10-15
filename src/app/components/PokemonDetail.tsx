import Image from "next/image";

// Interfaz para definir la estructura de los datos del Pokémon
interface Pokemon {
  id: string;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: { type: { name: string } }[];
  height: number;
  weight: number;
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string } }[];
}

// Objeto mejorado para manejar los colores de fondo (gradientes) y los colores de las insignias
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

// Función asíncrona para obtener los datos de un Pokémon desde la PokéAPI
async function getPokemon(id: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch Pokémon data');
  }
  return res.json();
}

// Componente principal que renderiza los detalles del Pokémon
export default async function PokemonDetail({ id }: { id: string }) {
  const pokemon = await getPokemon(id);

  const primaryType = pokemon.types[0].type.name as keyof typeof typeColors;
  const typeStyle = typeColors[primaryType] || typeColors.normal;

  return (
    // CAMBIO 1: Se ajustó el padding superior para dar más espacio a la imagen
    <div className={`relative min-h-screen w-full flex items-center justify-center pt-28 p-4 bg-gradient-to-br ${typeStyle.gradient}`}>
      
      <div className="relative w-full max-w-lg">
        
        {/* CAMBIO 2: Se ajustó la posición de la imagen para que no se corte arriba */}
        <div className="absolute -top-16 sm:-top-24 left-1/2 -translate-x-1/2 z-20">
          <Image 
            className="h-48 w-48 sm:h-64 sm:w-64 object-contain drop-shadow-2xl"
            src={pokemon.sprites.other['official-artwork'].front_default} 
            alt={`Official artwork of ${pokemon.name}`} 
            width={256}
            height={256}
            priority
          />
        </div>

        {/* Tarjeta de contenido con efecto de vidrio */}
        <div className="relative bg-black/40 backdrop-blur-lg rounded-2xl shadow-xl pt-28 sm:pt-36 pb-8 px-6 text-white">

          {/* Sección de Nombre y Número */}
          <div className="text-center">
            <p className="text-xl font-semibold text-white/70">N.º {String(pokemon.id).padStart(4, '0')}</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold capitalize tracking-wide">{pokemon.name}</h1>
          </div>
          
          {/* Sección de Tipos */}
          <div className="mt-4 flex justify-center gap-2">
            {pokemon.types.map(({ type }) => (
              <span key={type.name} className={`text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md ${typeColors[type.name as keyof typeof typeColors]?.bg || 'bg-gray-400'}`}>
                {type.name.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Divisor visual */}
          <div className="my-6 border-b-2 border-white/20"></div>

          {/* Sección de Altura y Peso */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <h2 className="text-lg font-semibold text-white/70">Height</h2>
              <p className="text-2xl font-bold mt-1">{pokemon.height / 10} m</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white/70">Weight</h2>
              <p className="text-2xl font-bold mt-1">{pokemon.weight / 10} kg</p>
            </div>
          </div>

          {/* Sección de Estadísticas Base */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-center mb-4">Base Stats</h2>
            <div className="space-y-3">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="flex items-center gap-2">
                  <span className="w-1/3 text-white/70 capitalize text-right text-sm font-medium">{stat.stat.name.replace('-', ' ')}</span>
                  <span className="w-12 font-bold text-center">{stat.base_stat}</span>
                  <div className="w-2/3 bg-white/20 rounded-full h-2.5">
                    <div 
                      className={`${typeStyle.bg} h-2.5 rounded-full`}
                      style={{ width: `${Math.min((stat.base_stat / 160) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}