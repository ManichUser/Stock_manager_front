'use client';
import { useEffect, useState } from "react";
import { Part } from "../types/models";
import { deletePart, fetchParts, updatePart } from "../services/PartsServices";
import { createMovement } from "../services/MovementServices";
import { useWS } from "../contexts/WebSocketContext";
import PartCard from "./PartCard";
import ExportButtons from "./ExportButtons";
import Pagination from "./Pagination";
import PartCardTab from "./partCardTab";

interface PartListProps {
  userId: number;
  pageSize?: number;
}

export default function PartList({ userId, pageSize = 5 }: PartListProps) {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "stock" | "price">("name");
  const [sortAsc, setSortAsc] = useState(true);

  const { socket } = useWS();
  const [entryQtys, setEntryQtys] = useState<Record<number, number>>({});
  const [exitQtys, setExitQtys] = useState<Record<number, number>>({});
  const [showActions, setShowActions] = useState<Record<number, boolean>>({});

  const loadParts = async (initial = false) => {
    if (initial) setLoading(true);
    try {
      const data = await fetchParts();
      setParts(data);
    } finally {
      if (initial) setLoading(false);
    }
  };

const handleEdit = async (part: Part) => {
  const updatedName = prompt("Nouveau nom", part.name);
  const updatedPrice = prompt("Nouveau prix", part.price.toString());
  if (updatedName && updatedPrice) {
    await updatePart(part.id, { name: updatedName, price: parseFloat(updatedPrice) });
    loadParts(false); // rafraîchit la liste
  }
};

const handleDelete = async (id: number) => {
  const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette pièce ? Cette action est irréversible.");
  if (!confirmDelete) return;

  try {
    await deletePart(id); // Appelle l'API
    // Met à jour la liste localement
    setParts(prevParts => prevParts.filter(p => p.id !== id));
    alert("Pièce supprimée avec succès !");
  } catch (err: any) {
    console.error(err);
    alert(err?.response?.data?.message || "Erreur lors de la suppression");
  }
};

  useEffect(() => { loadParts(true); }, []);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg: MessageEvent) => {
      try {
        const payload = JSON.parse(msg.data);
        if (payload.type === "PARTS_UPDATED") loadParts(false);
      } catch {}
    };
    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  const handleEntry = async (part: Part) => {
    const qty = entryQtys[part.id] || 0;
    if (qty <= 0) return alert("Quantité invalide");
    await createMovement(part.id, "ENTREE", qty, userId);
    setEntryQtys(prev => ({ ...prev, [part.id]: 0 }));
    loadParts(false);
  };

  const handleExit = async (part: Part) => {
    const qty = exitQtys[part.id] || 0;
    if (qty <= 0 || qty > part.stock) return alert("Quantité invalide");
    await createMovement(part.id, "SORTIE", qty, userId);
    setExitQtys(prev => ({ ...prev, [part.id]: 0 }));
    loadParts(false);
  };

  const toggleActions = (partId: number) => {
    setShowActions(prev => ({ ...prev, [partId]: !prev[partId] }));
  };

  if (loading) return <p className="text-center mt-8">Chargement...</p>;

  const filteredParts = parts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  ).sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") cmp = a.name.localeCompare(b.name);
    else if (sortKey === "stock") cmp = a.stock - b.stock;
    else cmp = a.price - b.price;
    return sortAsc ? cmp : -cmp;
  });

  const totalPages = Math.ceil(filteredParts.length / pageSize);
  const currentParts = filteredParts.slice((page - 1) * pageSize, page * pageSize);

  const totalStock = filteredParts.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = filteredParts.reduce((sum, p) => sum + p.stock * p.price, 0);

  return (
    <div className="w-full flex flex-col items-center gap-6">

      {/* Recherche et tri */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 w-full max-w-[1200px] mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Rechercher par nom ou description"
          className="px-3 py-2 border rounded w-full sm:w-64"
        />
        <div className="flex gap-2 items-center">
          <label>Tri par:</label>
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as any)}
            className="px-2 py-1 border rounded"
          >
            <option value="name">Nom</option>
            <option value="stock">Stock</option>
            <option value="price">Prix</option>
          </select>
          <button
            onClick={() => setSortAsc(prev => !prev)}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            {sortAsc ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Grille / Table */}
      <div className="grid gap-6 w-full max-w-[1100px] grid-cols-1 sm:grid-cols-2 lg:hidden">
        {currentParts.map(part => (
          <PartCard
            key={part.id}
            part={part}
            userId={userId}
            entryQty={entryQtys[part.id] || 0}
            exitQty={exitQtys[part.id] || 0}
            onEntryChange={val => setEntryQtys(prev => ({ ...prev, [part.id]: val }))}
            onExitChange={val => setExitQtys(prev => ({ ...prev, [part.id]: val }))}
            onEntry={() => handleEntry(part)}
            onExit={() => handleExit(part)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

    {/* Tableau grands écrans */}
<div className="hidden lg:block w-full max-w-[1200px] mx-auto">
  <table className="min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-lg overflow-hidden">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Stock</th>
        <th className="px-4 py-3 text-center text-sm font-semibold text-yellow-600">Prix</th>
        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Entrée/Sortie</th>
        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {currentParts.map((part) => (
       <PartCardTab
       key={part.id}
       part={part}
       entryQty={entryQtys[part.id] || 0}
       exitQty={exitQtys[part.id] || 0}
       onEntryChange={(val) => setEntryQtys(prev => ({ ...prev, [part.id]: val }))}
       onExitChange={(val) => setExitQtys(prev => ({ ...prev, [part.id]: val }))}
       onEntry={() => handleEntry(part)}
       onExit={() => handleExit(part)}
       showActions={showActions[part.id] || false}
       toggleActions={() => toggleActions(part.id)}
       onEdit={handleEdit}
       onDelete={handleDelete}
     />
     
      ))}
    </tbody>
  </table>
</div>
      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {/* Résumé / Rapport */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 w-full max-w-[1200px] mt-4 p-4 bg-gray-100 rounded shadow">
        <p>Total pièces affichées : {filteredParts.length}</p>
        <p>Stock total : {totalStock}</p>
        <p>Valeur totale : {totalValue.toLocaleString()} FCFA</p>
      </div>

      {/* Boutons Export */}
      <ExportButtons parts={filteredParts} totalStock={totalStock} totalValue={totalValue} />


    </div>
  );
}
