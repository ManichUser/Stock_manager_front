import axios from "axios";
import { Brand } from "../types/models";
import api from "../lib/api";


// Récupérer toutes les marques
export const getBrands = async (): Promise<Brand[]> => {
  const res = await api.get(`/brands`);
  return res.data;
};

// Créer une nouvelle marque
export const createBrand = async (name: string): Promise<Brand> => {
  const res = await api.post(`/brands`, { name });
  return res.data;
};

// Mettre à jour une marque
export const updateBrand = async (id: number, name: string): Promise<Brand> => {
  const res = await api.put(`/brands/brand/${id}`, { name });
  return res.data;
};

// Supprimer une marque
export const deleteBrand = async (id: number): Promise<void> => {
  await api.delete(`/brands/brand/${id}`);
};
