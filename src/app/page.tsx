"use client";
import { useState, useEffect } from "react";
import PokemonList from "./components/PokemonList";

export default function Home() {
  const [notificationPermission, setNotificationPermission] = useState("default");

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  return (
    // 1. Aplicamos el fondo oscuro a toda la página.
    //    Usamos min-h-screen para que ocupe al menos toda la altura de la pantalla.
    <main className="bg-gray-900 min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <header className="text-center mb-10">
          {/* 2. Cambiamos el color del texto para que sea visible en el fondo oscuro. */}
          <h1 className="text-5xl font-bold text-white">Pokédex</h1>
          <p className="text-lg text-gray-300 mt-2">Explora el mundo de los Pokémon</p>
          {notificationPermission !== "granted" && (
            <button
              onClick={handleRequestPermission}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Activar Notificaciones
            </button>
          )}
        </header>
        
        {/* Tu lista de Pokémon se renderiza aquí dentro */}
        <PokemonList />
      </div>
    </main>
  );
}