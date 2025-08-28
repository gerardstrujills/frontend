import { PokemonDetailPage } from "@/components/pokemon/pokemon-detail-page";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

export default function PokemonPage() {
  const { id } = useParams<{ id: string }>();
  const pokemonId = Number(id);

  useEffect(() => {
    if (pokemonId > 0) {
      document.title = `Pokemon #${pokemonId.toString().padStart(3, "0")}`;
    }
  }, [pokemonId]);

  if (!id || isNaN(pokemonId) || pokemonId < 1) {
    return <Navigate to="/404" replace />;
  }

  return <PokemonDetailPage pokemonId={pokemonId} />;
}
