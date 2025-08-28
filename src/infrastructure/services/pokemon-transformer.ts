import type { Pokemon } from "../../domain/entities/pokemon";

export class PokemonTransformerService {
  formatPokemonName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
  }

  formatStats(pokemon: Pokemon) {
    return {
      height: `${pokemon.height / 10} m`,
      weight: `${pokemon.weight / 10} kg`,
      experience: pokemon.base_experience,
      types: pokemon.types.map((t) => this.formatPokemonName(t.type.name)),
    };
  }
}

export const pokemonTransformerService = new PokemonTransformerService();
