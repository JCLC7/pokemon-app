import Link from "next/link";
import PokemonDetail from "@/app/components/PokemonDetail";

type PokemonDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  return (
    // Usamos un Fragment (<>) para no añadir divs innecesarios
    <>
      {/* Posicionamos el botón para que flote sobre el componente de detalle */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-30 flex items-center gap-2 text-white font-semibold bg-black/30 hover:bg-black/50 transition-all px-4 py-2 rounded-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Volver a la lista
      </Link>
      
      {/* El componente de detalle se encarga de renderizar todo lo demás, incluido el fondo */}
      <PokemonDetail id={params.id} />
    </>
  );
}