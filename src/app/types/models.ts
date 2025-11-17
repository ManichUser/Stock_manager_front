import { MovementType } from "./Movement.type";

export interface User {
    id: number;
    username: string;
    password?: string; // jamais renvoyé par l'API, mais utile côté login
    movements?: Movement[];
  }
  
  export interface Brand {
    id: number;
    name: string;
    parts?: Part[];
  }
  
  export interface Part {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    stock: number;
    brandId: number;
    brand?: Brand;
    movements?: Movement[];
  }
  
  export interface Movement {
    id: number;
    type: MovementType;
    quantity: number;
    partId: number;
    userId: number;
    part?: Part;
    user?: User;
    createdAt: string; 
  }