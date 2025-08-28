import type {
  PokemonListResponse,
  PokemonResponse,
  PokemonSearchResponse,
} from "../../domain/entities/pokemon";
import type { PokemonRepository } from "../../domain/repositories/pokemon-repository";

const API_BASE_URL = "https://hortifrut-backend.up.railway.app/api/v1";

export class ApiError extends Error {
  public status: number;
  public endpoint: string;

  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

export class NetworkError extends Error {
  public endpoint: string;

  constructor(message: string, endpoint: string) {
    super(message);
    this.name = "NetworkError";
    this.endpoint = endpoint;
  }
}

export class PokemonApiService implements PokemonRepository {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(
          `API request failed: ${response.statusText}`,
          response.status,
          endpoint
        );
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new NetworkError("Request timeout", endpoint);
        }
        throw new NetworkError(`Network error: ${error.message}`, endpoint);
      }

      throw new NetworkError("Unknown error occurred", endpoint);
    }
  }

  private validatePaginationParams(limit: number, offset: number): void {
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }
    if (offset < 0) {
      throw new Error("Offset must be non-negative");
    }
  }

  async getPokemonList(
    limit: number,
    offset: number
  ): Promise<PokemonListResponse> {
    this.validatePaginationParams(limit, offset);
    return this.fetchApi<PokemonListResponse>(
      `/pokemon?limit=${limit}&offset=${offset}`
    );
  }

  async getPokemonById(id: number): Promise<PokemonResponse> {
    if (id < 1) {
      throw new Error("Pokemon ID must be positive");
    }
    return this.fetchApi<PokemonResponse>(`/pokemon/${id}`);
  }

  async getPokemonByName(name: string): Promise<PokemonResponse> {
    if (!name.trim()) {
      throw new Error("Pokemon name cannot be empty");
    }
    const encodedName = encodeURIComponent(name.toLowerCase().trim());
    return this.fetchApi<PokemonResponse>(`/pokemon/name/${encodedName}`);
  }

  async searchPokemon(
    query: string,
    limit: number,
    offset: number
  ): Promise<PokemonSearchResponse> {
    if (!query.trim()) {
      throw new Error("Search query cannot be empty");
    }
    this.validatePaginationParams(limit, offset);
    const encodedQuery = encodeURIComponent(query.trim());
    const response = await this.fetchApi<PokemonSearchResponse>(
      `/pokemon/search?q=${encodedQuery}&limit=${limit}&offset=${offset}`
    );

    response.data = response.data.filter((p) => p && p.id);

    return response;
  }
}

export const pokemonApiService = new PokemonApiService();
