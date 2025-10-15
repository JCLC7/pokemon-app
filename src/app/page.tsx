import PokemonList from "./components/PokemonList";

export default function Home() {
  return (
    // 1. Aplicamos el fondo oscuro a toda la página.
    //    Usamos min-h-screen para que ocupe al menos toda la altura de la pantalla.
    <main className="bg-gray-900 min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <header className="text-center mb-10">
          {/* 2. Cambiamos el color del texto para que sea visible en el fondo oscuro. */}
          <h1 className="text-5xl font-bold text-white">Pokédex</h1>
          <p className="text-lg text-gray-300 mt-2">Explora el mundo de los Pokémon</p>
        </header>
        
        {/* Tu lista de Pokémon se renderiza aquí dentro */}
        <PokemonList />
      </div>
    </main>
  );
}