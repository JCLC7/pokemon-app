import PokemonList from "./components/PokemonList";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 bg-gray-100">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-red-600">PokePWA</h1>
        <p className="text-gray-600">Tu Pokédex</p>
      </header>
      <PokemonList />
      <footer className="text-center mt-8 text-gray-500">
        
      </footer>
    </div>
  );
}