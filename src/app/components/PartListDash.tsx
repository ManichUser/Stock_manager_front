'use client';
import { useEffect, useState } from "react";
import { Part } from "../types/models";
import { fetchParts } from "../services/PartsServices";
import { createMovement } from "../services/MovementServices";
import { useWS } from "../contexts/WebSocketContext";
import PartCard from "./PartCard";
import PartCardTab from "./partCardTab";

interface PartListDashProps {
userId: number;
pageSize?: number;
}

export default function PartListDash({ userId, pageSize = 4 }: PartListDashProps) {
const [parts, setParts] = useState<Part[]>([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
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

const totalPages = Math.ceil(parts.length / pageSize);
const currentParts = parts.slice((page - 1) * pageSize, page * pageSize);

return ( <div className="w-full flex flex-col items-center gap-6">


  {/* PETITS ÉCRANS : grille */}
  <div className="grid gap-6 w-full max-w-[1100px] grid-cols-1 sm:grid-cols-2 lg:hidden">
    {currentParts.map((part) => (
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
    />
    ))}
  </div>
  
  {/* GRANDS ÉCRANS : tableau moderne */}
  <div className="hidden lg:block w-fit justify-center max-w-[1200px]">
    <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nom</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Description</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Stock</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Prix</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Entrée/Sortie</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {currentParts.map((part) => (
          <PartCardTab
          key={part.id}
          part={part}
          entryQty={entryQtys[part.id] || 0}
          exitQty={exitQtys[part.id] || 0}
          onEntryChange={val => setEntryQtys(prev => ({ ...prev, [part.id]: val }))}
          onExitChange={val => setExitQtys(prev => ({ ...prev, [part.id]: val }))}
          onEntry={() => handleEntry(part)}
          onExit={() => handleExit(part)}
          showActions={showActions[part.id] || false}
          toggleActions={() => toggleActions(part.id)}
          onEdit={(p) => alert("Modifier " + p.id)}
          onDelete={(id) => alert("Supprimer " + id)}
        />
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="flex justify-center gap-2 mt-4">
    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      Précédent
    </button>
    <span className="px-3 py-1">{page} / {totalPages}</span>
    <button
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      Suivant
    </button>
  </div>

</div>


);
}
