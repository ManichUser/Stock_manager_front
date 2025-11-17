'use client';
import { useEffect, useState } from "react";
import { Part } from "../types/models";
import { fetchParts } from "../services/PartsServices";

interface PartListProps {
  onEntry: (part: Part) => void;
  onExit: (part: Part) => void;
}

export default function PartList({ onEntry, onExit }: PartListProps) {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // nombre de lignes par page

  const loadParts = async () => {
    setLoading(true);
    try {
      const data = await fetchParts();
      setParts(data);
    } catch (error) {
      console.error("Erreur lors du chargement des pièces :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadParts(); }, []);

  if (loading) return <p className="text-center mt-12">Chargement des pièces...</p>;

  // Pagination
  const totalPages = Math.ceil(parts.length / pageSize);
  const currentParts = parts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="overflow-x-auto bg-white rounded shadow p-4">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Nom</th>
            <th className="border px-4 py-2 text-left">Marque</th>
            <th className="border px-4 py-2 text-left">Description</th>
            <th className="border px-4 py-2 text-left">Prix</th>
            <th className="border px-4 py-2 text-left">Stock</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentParts.map(part => (
            <tr key={part.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{part.name}</td>
              <td className="border px-4 py-2">{part.brand?.name ?? "N/A"}</td>
              <td className="border px-4 py-2">{part.description?.length===0 ? "Aucune": part.description}</td>
              <td className="border px-4 py-2 text-yellow-600 font-semibold">{part.price} XAF</td>
              <td className="border px-4 py-2">{part.stock}</td>
              <td className="border px-4 py-2 text-center flex gap-2 justify-center">
                <button
                  onClick={() => onEntry(part)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Entrée
                </button>
                <button
                  onClick={() => onExit(part)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Sortie
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span className="px-2 py-1">{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
