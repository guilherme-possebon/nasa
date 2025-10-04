export interface OverpassElement {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    [key: string]: string | undefined;
  };
}

export interface OverpassResponse {
  elements: OverpassElement[];
}
