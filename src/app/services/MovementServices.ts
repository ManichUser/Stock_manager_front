import { MovementType } from "../types/Movement.type";
import api from "../lib/api";

const API_URL = "/movements";

export const createMovement = async (partId: number, type: MovementType, quantity: number, userId: number) => {
  const res = await api.post(`${API_URL}/`, { partId, type, quantity, userId });
  return res.data;
};

export const getMovementsByPart = async (partId: number) => {
  const res = await api.get(`${API_URL}/by-part/${partId}`);
  return res.data;
};

export const fetchMovements = async () => {
  const res = await api.get(API_URL);
  return res.data;
};

export const updateMovement = async (id: number, data: { type?: MovementType, quantity?: number }) => {
  const res = await api.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteMovement = async (id: number) => {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
};
