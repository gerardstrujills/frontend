"use client";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePokemonById } from "@/infrastructure/hooks/use-pokemon";
import { pokemonTransformerService } from "@/infrastructure/services/pokemon-transformer";
import { ArrowLeft, Loader2, Ruler, Weight } from "lucide-react";
import { useState } from "react";

interface PokemonDetailPageProps {
  pokemonId: number;
}

export function PokemonDetailPage({ pokemonId }: PokemonDetailPageProps) {
  const [imageError, setImageError] = useState(false);
  const router = useNavigate();

  const { data: pokemon, isLoading, error } = usePokemonById(pokemonId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            No se pudieron cargar los detalles del Pokémon
          </p>
          <Button onClick={() => router(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5">
      <header className="border-b bg-card/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-6">
            <Button
              onClick={() => router(-1)}
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance bg-gradient-to-r from-primary to-accent bg-clip-text">
                  {pokemonTransformerService.formatPokemonName(pokemon.name)}
                </h1>
                <p className="text-muted-foreground text-sm font-medium">
                  #{pokemon.id.toString().padStart(3, "0")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="pokemon-card-hover shadow-2xl border-0 bg-gradient-to-br from-card to-muted/50 lg:col-span-1">
            <CardContent className="p-8 flex flex-col items-center">
              <div className="relative w-full max-w-sm aspect-square flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl shadow-inner border border-primary/20">
                {!imageError ? (
                  <img
                    src={pokemon.sprites.front_default || "/placeholder.svg"}
                    alt={pokemonTransformerService.formatPokemonName(
                      pokemon.name
                    )}
                    className="h-4/5 w-4/5 object-contain transition-all duration-500 hover:scale-110 drop-shadow-2xl"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-3xl bg-muted">
                    <span className="text-8xl opacity-50">❓</span>
                  </div>
                )}
              </div>

              <div className="mt-6 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <span className="text-primary font-bold text-lg">
                  #{pokemon.id.toString().padStart(3, "0")}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card className="pokemon-card-hover shadow-xl border-0 bg-gradient-to-r from-card to-muted/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Types */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                    Tipos
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {pokemon.types.map((type) => (
                      <Badge
                        key={type.slot}
                        className={`type-badge px-4 py-2 text-sm font-bold text-white border-0 rounded-full shadow-lg`}
                      >
                        {pokemonTransformerService.formatPokemonName(
                          type.type.name
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Height & Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                    <div className="p-3 bg-primary rounded-full">
                      <Ruler className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Altura
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {pokemon.height / 10} m
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                    <div className="p-3 bg-primary rounded-full">
                      <Weight className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Peso
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {pokemon.weight / 10} kg
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="pokemon-card-hover shadow-xl border-0 bg-gradient-to-r from-card to-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  Experiencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">
                      Experiencia Base
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {pokemon.base_experience}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={(pokemon.base_experience / 300) * 100}
                      className="h-4 bg-muted"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
