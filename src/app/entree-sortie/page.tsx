'use client';
import MovementList from "../components/MovementList";
import useAuth from "../hook/useAuth";

export default function EntreeSortiePage() {
  useAuth()
  return (
    <div className="p-12 justify-end">
      <h1 className="text-3xl font-bold mb-6">Entrées et Sorties de Stock</h1>
      <MovementList pageSize={4} />
    
    </div>
  );
}
