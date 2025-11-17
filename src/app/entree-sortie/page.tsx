'use client';
import MovementList from "../components/MovementList";

export default function EntreeSortiePage() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Entrées et Sorties de Stock</h1>
      <MovementList />
    </div>
  );
}
