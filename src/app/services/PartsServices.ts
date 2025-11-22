import api from "../lib/api";
import { Part } from "../types/models";

const API_URL = "/parts"; // correspond à la route backend pour POST, PUT, DELETE

export const fetchParts = async (): Promise<Part[]> => {
  const res = await api.get("/parts");
  return res.data;
};

export const createPart = async (part: Partial<Part>) => {
  const res = await api.post(API_URL, part); 
  return res.data;
};

export const updatePart = async (id: number, part: Partial<Part>) => {
  const res = await api.put(`${API_URL}/part/${id}`, part);
  return res.data;
};

export const deletePart = async (id: number) => {
  const res = await api.delete(`${API_URL}/part/${id}`);
  return res.data;
};
