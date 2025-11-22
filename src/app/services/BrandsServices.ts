import { Brand } from "../types/models";
import api from "../lib/api";


export const getBrands = async (): Promise<Brand[]> => {
  const res = await api.get(`/brands`);
  return res.data;
};


export const createBrand = async (name: string): Promise<Brand> => {
  const res = await api.post(`/brands`, { name });
  return res.data;
};

export const updateBrand = async (id: number, name: string): Promise<Brand> => {
  const res = await api.put(`/brands/${id}`, { name }); 
  return res.data;
};


export const deleteBrand = async (id: number): Promise<void> => {
  await api.delete(`/brands/${id}`); 
};
