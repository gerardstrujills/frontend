import type { Pokemon } from "@/domain/entities/pokemon";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { PokemonUseCases } from "../../application/use-cases/pokemon-use-cases";
import { pokemonApiService } from "../api/pokemon-api";

const pokemonUseCases = new PokemonUseCases(pokemonApiService);

export const usePokemonList = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: ["pokemon", "list", limit],
    queryFn: ({ pageParam = 0 }) =>
      pokemonUseCases.getPokemonList(limit, pageParam),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      const nextOffset = pagination.offset + pagination.limit;
      return nextOffset < lastPage.data.count ? nextOffset : undefined;
    },
    initialPageParam: 0,
  });
};

export const usePokemonWithCachedSearch = (searchQuery: string, limit = 20) => {
  // Recuperar la lista inicial para el almacenamiento en caché
  const pokemonListQuery = usePokemonList(limit);

  // Obtener resultados de búsqueda de la API
  const searchQuery_trimmed = searchQuery.trim();
  const pokemonSearchQuery = useInfiniteQuery({
    queryKey: ["pokemon", "search", searchQuery_trimmed, 10],
    queryFn: ({ pageParam = 0 }) =>
      pokemonUseCases.searchPokemon(searchQuery_trimmed, 10, pageParam),
    getNextPageParam: (lastPage) => {
      const { search } = lastPage;
      const nextOffset = search.offset + search.limit;
      return nextOffset < search.count ? nextOffset : undefined;
    },
    initialPageParam: 0,
    enabled: !!searchQuery_trimmed && searchQuery_trimmed.length > 0,
  });

  // Resultados filtrados memorizados de la lista en caché
  const cachedFilteredResults = useMemo(() => {
    if (!searchQuery_trimmed || !pokemonListQuery.data) {
      return [];
    }

    const allCachedPokemon = pokemonListQuery.data.pages.flatMap((page) =>
      page.data.results
        .map((pokemonResult) => {
          const pokemonId = pokemonResult.url.match(/\/pokemon\/(\d+)\//)?.[1];
          if (!pokemonId) return null;

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
          };
          return pokemon;
        })
        .filter((p): p is Pokemon => p !== null)
    );

    return allCachedPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery_trimmed.toLowerCase())
    );
  }, [searchQuery_trimmed, pokemonListQuery.data]);

  // Resultados a utilizar (API o caché)
  const shouldUseApiSearch =
    searchQuery_trimmed && cachedFilteredResults.length === 0;
  const searchResults = shouldUseApiSearch
    ? pokemonSearchQuery.data?.pages.flatMap((page) =>
        page.data?.filter((p): p is Pokemon => p != null && p.id != null)
      ) || []
    : cachedFilteredResults;

  return {
    // List data
    pokemonList: pokemonListQuery,

    // Search data
    searchResults,
    isSearching: searchQuery_trimmed
      ? shouldUseApiSearch
        ? pokemonSearchQuery.isLoading
        : false
      : false,
    searchError: shouldUseApiSearch ? pokemonSearchQuery.error : null,
    hasSearchError: shouldUseApiSearch ? pokemonSearchQuery.isError : false,

    // Search pagination
    fetchNextSearchPage: pokemonSearchQuery.fetchNextPage,
    hasNextSearchPage: shouldUseApiSearch
      ? pokemonSearchQuery.hasNextPage
      : false,
    isFetchingNextSearchPage: shouldUseApiSearch
      ? pokemonSearchQuery.isFetchingNextPage
      : false,

    // Information
    isUsingCachedSearch: searchQuery_trimmed && !shouldUseApiSearch,
    isUsingApiSearch: shouldUseApiSearch,
    totalSearchResults: shouldUseApiSearch
      ? pokemonSearchQuery.data?.pages[0]?.search.count || 0
      : cachedFilteredResults.length,
  };
};

export const usePokemonById = (id: number) => {
  return useQuery({
    queryKey: ["pokemon", "detail", id],
    queryFn: () => pokemonUseCases.getPokemonById(id),
    enabled: !!id,
  });
};

export const usePokemonByName = (name: string) => {
  return useQuery({
    queryKey: ["pokemon", "name", name],
    queryFn: () => pokemonUseCases.getPokemonByName(name),
    enabled: !!name,
  });
};

export const usePokemonSearch = (query: string, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["pokemon", "search", query, limit],
    queryFn: ({ pageParam = 0 }) =>
      pokemonUseCases.searchPokemon(query, limit, pageParam),
    getNextPageParam: (lastPage) => {
      const { search } = lastPage;
      const nextOffset = search.offset + search.limit;
      return nextOffset < search.count ? nextOffset : undefined;
    },
    initialPageParam: 0,
    enabled: !!query.trim(),
  });
};
