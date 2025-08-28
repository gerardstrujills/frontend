"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Pokemon } from "@/domain/entities/pokemon";
import { pokemonTransformerService } from "@/infrastructure/services/pokemon-transformer";
import { useState } from "react";

interface PokemonCardProps {
  pokemon: Pokemon;
  onViewDetails?: (pokemon: Pokemon) => void;
}

export function PokemonCard({ pokemon, onViewDetails }: PokemonCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formattedStats = pokemonTransformerService.formatStats(pokemon);
  const formattedName = pokemonTransformerService.formatPokemonName(
    pokemon.name
  );

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(pokemon);
    }
  };

  // Verificar si un valor string o number es "cero"
  const isZeroOrEmpty = (value: string | number | null | undefined) => {
    if (value == null || value === "") return true;
    const numericPart = parseFloat(String(value).replace(/[^\d.-]/g, ""));
    return isNaN(numericPart) || numericPart === 0;
  };
  
  const shouldShowStats =
    !isZeroOrEmpty(formattedStats.height) ||
    !isZeroOrEmpty(formattedStats.weight) ||
    !isZeroOrEmpty(formattedStats.experience);

  return (
    <Card
      className="pokemon-card-modern group relative cursor-pointer border-2 border-border/50 hover:border-primary/30"
      onClick={handleCardClick}
    >
      <CardContent className="p-2 relative z-10">
        <div className="pokemon-image-container relative mb-6 flex h-40 items-center justify-center rounded-xl">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            </div>
          )}
          {!imageError ? (
            <img
              src={pokemon.sprites.front_default || "/placeholder.svg"}
              alt={formattedName}
              className={`h-full w-full object-contain transition-all duration-500 group-hover:scale-110 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted/50">
              <span className="text-5xl opacity-50">❓</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Nombre e ID */}
          <div className="text-center space-y-1">
            <h3 className="pokemon-name-shadow text-xl font-black text-card-foreground tracking-wide">
              {formattedName}
            </h3>
            <p className="text-sm font-semibold text-primary">
              #{pokemon.id.toString().padStart(3, "0")}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {pokemon.types.map((type) => (
              <Badge
                key={type.slot}
                className="type-badge-modern text-white text-xs px-3 py-1 font-semibold border-0"
              >
                {pokemonTransformerService.formatPokemonName(type.type.name)}
              </Badge>
            ))}
          </div>

          {shouldShowStats && (
            <div className="space-y-3">
              {!isZeroOrEmpty(formattedStats.height) ||
              !isZeroOrEmpty(formattedStats.weight) ? (
                <div className="grid grid-cols-2 gap-3">
                  {!isZeroOrEmpty(formattedStats.height) && (
                    <div className="stat-card text-center p-3 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Altura
                      </p>
                      <p className="text-lg font-bold text-primary mt-1">
                        {formattedStats.height}
                      </p>
                    </div>
                  )}
                  {!isZeroOrEmpty(formattedStats.weight) && (
                    <div className="stat-card text-center p-3 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Peso
                      </p>
                      <p className="text-lg font-bold text-primary mt-1">
                        {formattedStats.weight}
                      </p>
                    </div>
                  )}
                </div>
              ) : null}

              {!isZeroOrEmpty(formattedStats.experience) && (
                <div className="stat-card text-center p-3 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Base Experience
                  </p>
                  <p className="text-xl font-bold text-primary mt-1">
                    {formattedStats.experience}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
