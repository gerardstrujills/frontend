export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  types: PokemonType[]
  sprites: Sprites
  base_experience: number
}

export interface PokemonType {
  slot: number
  type: TypeInfo
}

export interface TypeInfo {
  name: string
  url: string
}

export interface Sprites {
  front_default: string
  back_default: string
}

export interface PokemonResult {
  name: string
  url: string
}

export interface PokemonList {
  count: number
  next: string | null
  previous: string | null
  results: PokemonResult[]
}

export interface PokemonListResponse {
  data: PokemonList
  pagination: {
    limit: number
    offset: number
  }
}

export interface PokemonResponse {
  data: Pokemon
  cached?: boolean
}

export interface PokemonSearchResponse {
  data: Pokemon[]
  search: {
    count: number
    limit: number
    offset: number
    query: string
  }
}
