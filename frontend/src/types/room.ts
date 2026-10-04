export type PriceUnit = "daily" | "monthly" | "yearly";

export interface Room {
  id: number;
  slug: string;
  name: string;
  buildingName: string;
  typeName: string;
  address: string;
  capacity: number;
  price: number;
  priceUnit: PriceUnit;
  coverImage: string;
}