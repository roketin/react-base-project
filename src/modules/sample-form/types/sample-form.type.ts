export type TSampleItem = {
  id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
};

export type TRickAndMortyCharacter = {
  id: string;
  name: string;
};

export type TRickAndMortyCharactersResponse<T> = {
  info: { next: string | null };
  results: T[];
};
