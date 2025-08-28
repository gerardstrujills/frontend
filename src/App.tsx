import { useDebounce } from "@uidotdev/usehooks";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PokemonCard } from "./components/pokemon/pokemon-card";
import { PokemonList } from "./components/pokemon/pokemon-list";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import type { Pokemon } from "./domain/entities/pokemon";
import { usePokemonWithCachedSearch } from "./infrastructure/hooks/use-pokemon";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const navigate = useNavigate();

  const {
    searchResults,
    isSearching,
    searchError,
    hasSearchError,
    fetchNextSearchPage,
    hasNextSearchPage,
    isFetchingNextSearchPage,
    isUsingCachedSearch,
    isUsingApiSearch,
    totalSearchResults,
  } = usePokemonWithCachedSearch(debouncedQuery);

  const handlePokemonSelect = (pokemon: Pokemon) => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const showSearchResults = debouncedQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-card-foreground">Pokémon</h1>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar Pokémon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {showSearchResults ? (
            <div className="space-y-6">
              {/* Search Status */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                {isSearching ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>Buscando "{debouncedQuery}"...</span>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>
                      Resultados de la búsqueda para "{debouncedQuery}"
                    </span>
                    {totalSearchResults > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {totalSearchResults} encontró
                      </Badge>
                    )}
                    {isUsingCachedSearch && (
                      <Badge variant="outline" className="text-xs">
                        Desde caché
                      </Badge>
                    )}
                    {isUsingApiSearch && (
                      <Badge variant="outline" className="text-xs">
                        Desde API
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Search Error */}
              {hasSearchError && (
                <div className="text-center py-8">
                  <p className="text-destructive">
                    {searchError instanceof Error
                      ? searchError.message
                      : "Error en la búsqueda. Inténtalo de nuevo."}
                  </p>
                </div>
              )}

              {/* No Results */}
              {!isSearching &&
                !hasSearchError &&
                searchResults.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">
                      No se encontraron Pokémon
                    </h3>
                    <p className="text-muted-foreground">
                      Intente buscar con un nombre diferente o revise la
                      ortografía.
                    </p>
                  </div>
                )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {searchResults.map((pokemon) => (
                      <PokemonCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        onViewDetails={handlePokemonSelect}
                      />
                    ))}
                  </div>

                  {/* Load More Search Results (only for API search) */}
                  {hasNextSearchPage && isUsingApiSearch && (
                    <div className="flex justify-center">
                      <Button
                        onClick={() => fetchNextSearchPage()}
                        disabled={isFetchingNextSearchPage}
                        variant="outline"
                        size="lg"
                        className="min-w-32"
                      >
                        {isFetchingNextSearchPage ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            Cargando...
                          </>
                        ) : (
                          "Cargar más resultados"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <PokemonList onPokemonSelect={handlePokemonSelect} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
