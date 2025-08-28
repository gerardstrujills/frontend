"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { Pokemon } from "@/domain/entities/pokemon"
import { usePokemonList } from "@/infrastructure/hooks/use-pokemon"
import { AlertCircle, Loader2 } from "lucide-react"
import { PokemonCard } from "./pokemon-card"

interface PokemonListProps {
  onPokemonSelect?: (pokemon: Pokemon) => void
}

export function PokemonList({ onPokemonSelect }: PokemonListProps) {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = usePokemonList(20)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : "No se pudo cargar Pokémon. Inténtalo de nuevo."}
        </AlertDescription>
      </Alert>
    )
  }

  const allPokemon = data?.pages.flatMap((page) => page.data.results) || []

  return (
    <div className="space-y-8">
      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {allPokemon.map((pokemonResult) => {
          // Extract ID from URL for the card
          const pokemonId = pokemonResult.url.match(/\/pokemon\/(\d+)\//)?.[1]
          if (!pokemonId) return null

          // Create a minimal Pokemon object for the card
          const pokemon: Pokemon = {
            id: Number.parseInt(pokemonId, 10),
            name: pokemonResult.name,
            height: 0,
            weight: 0,
            types: [],
            sprites: {
              front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
              back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonId}.png`,
            },
            base_experience: 0,
          }

          return <PokemonCard key={pokemon.id} pokemon={pokemon} onViewDetails={onPokemonSelect} />
        })}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            size="lg"
            className="min-w-32"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando...
              </>
            ) : (
              "Cargar más"
            )}
          </Button>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm text-muted-foreground">
        Mostrando {allPokemon.length} Pokemones
        {data?.pages[0]?.data.count && ` de un total de ${data.pages[0].data.count}`}
      </div>
    </div>
  )
}
