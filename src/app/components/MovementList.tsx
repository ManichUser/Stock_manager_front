'use client';
import { useEffect, useState } from "react";
import { Movement } from "../types/models";
import { fetchMovements, updateMovement, deleteMovement, deleteAllMovements } from "../services/MovementServices";
import { useWS } from "../contexts/WebSocketContext";

export default function MovementList({ pageSize = 5 }) {
const [movements, setMovements] = useState<Movement[]>([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [searchTerm, setSearchTerm] = useState("");
const [sortKey, setSortKey] = useState<"date" | "type" | "quantity">("date");
const [sortAsc, setSortAsc] = useState(false);
const { socket } = useWS();

const loadMovements = async () => {
try {
const data = await fetchMovements();
setMovements(data);
} catch (err) {
console.error("Erreur chargement mouvements :", err);
} finally {
setLoading(false);
}
};

useEffect(() => { loadMovements(); }, []);

useEffect(() => {
if (!socket) return;
const handleMessage = (msg: MessageEvent) => {
try {
const payload = JSON.parse(msg.data);
if (payload.type === "MOVEMENTS_UPDATED") loadMovements();
} catch (err) {
console.error("Erreur WebSocket MovementList :", err);
}
};
socket.addEventListener("message", handleMessage);
return () => socket.removeEventListener("message", handleMessage);
}, [socket]);

const handleUpdate = async (id: number) => {
const newQty = prompt("Nouvelle quantité ?");
if (!newQty) return;
await updateMovement(id, { quantity: parseInt(newQty) });
loadMovements();
};

const handleDelete = async (id: number) => {
if (!confirm("Supprimer ce mouvement ?")) return;
await deleteMovement(id);
loadMovements();
};

const handleDeleteAll = async () => {
  if (!confirm("Supprimer tous les mouvements ?")) return;
  try {
    const result = await deleteAllMovements();
    console.log(result.message);
    loadMovements(); // recharge la liste après suppression
  } catch (err) {
    console.error("Erreur suppression globale :", err);
  }
};

if (loading) return <p className="text-center mt-12">Chargement des mouvements...</p>;

const filteredMovements = movements.filter(m =>
m.part?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
m.user?.username.toLowerCase().includes(searchTerm.toLowerCase())
).sort((a, b) => {
let cmp = 0;
if (sortKey === "date") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
else if (sortKey === "quantity") cmp = a.quantity - b.quantity;
else cmp = a.type.localeCompare(b.type);
return sortAsc ? cmp : -cmp;
});

const totalPages = Math.ceil(filteredMovements.length / pageSize);
const currentMovements = filteredMovements.slice((page - 1) * pageSize, page * pageSize);

// Résumé
const totalEntrées = filteredMovements.filter(m => m.type === "ENTREE").reduce((sum, m) => sum + m.quantity, 0);
const totalSorties = filteredMovements.filter(m => m.type === "SORTIE").reduce((sum, m) => sum + m.quantity, 0);

return ( <div className="flex flex-col items-center gap-6">


  {/* Recherche et tri */}
  <div className="flex flex-col sm:flex-row justify-between gap-4 w-full max-w-[1200px] mb-4">
    <input
      type="text"
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      placeholder="Rechercher par pièce ou utilisateur"
      className="px-3 py-2 border rounded w-full sm:w-64"
    />
    <div className="flex gap-2 items-center">
      <label>Tri par:</label>
      <select
        value={sortKey}
        onChange={e => setSortKey(e.target.value as any)}
        className="px-2 py-1 border rounded"
      >
        <option value="date">Date</option>
        <option value="type">Type</option>
        <option value="quantity">Quantité</option>
      </select>
      <button
        onClick={() => setSortAsc(prev => !prev)}
        className="px-2 py-1 bg-gray-200 rounded"
      >
        {sortAsc ? "↑" : "↓"}
      </button>
    </div>
    <button
    onClick={handleDeleteAll}
    className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800"
    >
      Supprimer tous les mouvements
    </button>
  </div>

  {/* GRANDS ÉCRANS : tableau */}
  <div className="hidden lg:block w-fit max-w-[1200px]">
    <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nom</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Marque</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Stock avant</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Type</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Quantité</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Utilisateur</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {currentMovements.map(m => (
          <tr key={m.id} className="hover:bg-gray-50">
            <td className="px-4 py-2 text-sm text-gray-700">{m.part?.name?.toUpperCase() ?? "N/A"}</td>
            <td className="px-4 py-2 text-sm text-gray-700">{m.part?.brand?.name ?? "Non spécifiée"}</td>
            <td className="px-4 py-2 text-sm text-gray-700">{m.part?.stock ?? "N/A"}</td>
            <td className={`px-4 py-2 text-center text-sm ${m.type === "ENTREE" ? "text-green-600" : "text-red-600"}`}>{m.type}</td>
            <td className="px-4 py-2 text-sm text-gray-700">{m.quantity}</td>
            <td className="px-4 py-2 text-sm text-gray-700">{m.user?.username?.toUpperCase() ?? "N/A"}</td>
            <td className="px-4 py-2 text-sm text-gray-700">{new Date(m.createdAt).toLocaleString()}</td>
            <td className="px-4 py-2 flex gap-2">
              <button onClick={() => handleUpdate(m.id)} className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700">Modifier</button>
              <button onClick={() => handleDelete(m.id)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">Supprimer</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* PETITS ÉCRANS : cartes */}
  <div className="grid gap-4 w-full max-w-[1100px] lg:hidden">
    {currentMovements.map(m => (
      <div key={m.id} className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <h3 className="font-bold text-lg">{m.part?.name?.toUpperCase() ?? "N/A"} #{m.id}</h3>
            <p className={`text-sm font-semibold ${m.type === "ENTREE" ? "text-green-600" : "text-red-600"}`}>
              Type : {m.type} - Qté : {m.quantity}
            </p>
            <p className="text-xs text-gray-500">Date : {new Date(m.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm"><span className="font-semibold">Utilisateur :</span> {m.user?.username ?? "N/A"}</p>
            <p className="text-sm"><span className="font-semibold">Stock avant :</span> {m.part?.stock ?? "N/A"}</p>
            <p className="text-sm"><span className="font-semibold">Marque :</span> {m.part?.brand?.name ?? "Non spécifiée"}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => handleUpdate(m.id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Modifier</button>
          <button onClick={() => handleDelete(m.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Supprimer</button>
        </div>
      </div>
    ))}
  </div>

  {/* Pagination */}
  <div className="flex justify-center gap-2 mt-4">
    <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Précédent</button>
    <span className="px-3 py-1">{page} / {totalPages}</span>
    <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Suivant</button>
  </div>

  {/* Résumé */}
  <div className="flex flex-col sm:flex-row justify-between gap-4 w-full max-w-[1200px] mt-4 p-4 bg-gray-100 rounded shadow">
    <p>Total mouvements : {filteredMovements.length}</p>
    <p>Total Entrées : {totalEntrées}</p>
    <p>Total Sorties : {totalSorties}</p>
  </div>
</div>


);
}
