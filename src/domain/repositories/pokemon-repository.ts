import type { PokemonListResponse, PokemonResponse, PokemonSearchResponse } from "../entities/pokemon"

export interface PokemonRepository {
  getPokemonList(limit: number, offset: number): Promise<PokemonListResponse>
  getPokemonById(id: number): Promise<PokemonResponse>
  getPokemonByName(name: string): Promise<PokemonResponse>
  searchPokemon(query: string, limit: number, offset: number): Promise<PokemonSearchResponse>
}
