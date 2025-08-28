import type {
  Pokemon,
  PokemonListResponse,
  PokemonSearchResponse,
} from "@/domain/entities/pokemon";
import type { PokemonRepository } from "@/domain/repositories/pokemon-repository";

export class PokemonUseCases {
  private pokemonRepository: PokemonRepository;

  constructor(pokemonRepository: PokemonRepository) {
    this.pokemonRepository = pokemonRepository;
  }

  async getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
    return this.pokemonRepository.getPokemonList(limit, offset);
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    const response = await this.pokemonRepository.getPokemonById(id);
    return response.data;
  }

  async getPokemonByName(name: string): Promise<Pokemon> {
    const response = await this.pokemonRepository.getPokemonByName(name);
    return response.data;
  }

  async searchPokemon(
    query: string,
    limit = 10,
    offset = 0
  ): Promise<PokemonSearchResponse> {
    if (!query.trim()) {
      return {
        data: [],
        search: { count: 0, limit, offset, query },
      };
    }
    return this.pokemonRepository.searchPokemon(query, limit, offset);
  }
}
