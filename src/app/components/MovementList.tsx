'use client';
import { useEffect, useState } from "react";
import { Movement } from "../types/models";
import { fetchMovements } from "../services/MovementServices";

export default function MovementList() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // nombre de mouvements par page

  const loadMovements = async () => {
    setLoading(true);
    try {
      const data = await fetchMovements(); // récupérer tous les mouvements depuis le backend
      setMovements(data);
    } catch (err) {
      console.error("Erreur chargement mouvements :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  if (loading) return <p className="text-center mt-12">Chargement des mouvements...</p>;

  // Pagination
  const totalPages = Math.ceil(movements.length / pageSize);
  const currentMovements = movements.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="overflow-x-auto bg-white rounded shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Historique des mouvements</h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Quantité</th>
            <th className="border px-4 py-2">Pièce</th>
            <th className="border px-4 py-2">Utilisateur</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentMovements.map((m) => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{m.id}</td>
              <td className="border px-4 py-2">{m.type}</td>
              <td className="border px-4 py-2">{m.quantity}</td>
              <td className="border px-4 py-2">{m.part?.name ?? "N/A"}</td>
              <td className="border px-4 py-2">{m.user?.username ?? "N/A"}</td>
              <td className="border px-4 py-2">
                {new Date(m.createdAt).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="border flex justify-between px-4 py-2">
                <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">supprimer</button>
                <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition">modifier</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span className="px-2 py-1">{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
