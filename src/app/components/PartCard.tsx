'use client';
import { useState } from "react";
import { Part } from "../types/models";

interface PartCardProps {
  part: Part;
  userId: number;
  onMovementDone: () => void;
}

export default function PartCard({ part, userId, onMovementDone }: PartCardProps) {
  const [showEntry, setShowEntry] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [entryQty, setEntryQty] = useState(0);
  const [exitQty, setExitQty] = useState(0);
;

const handleEntry = async () => {
  if (entryQty <= 0) return alert("Quantité invalide");
  await fetch(`http://localhost:3000/movements/movement`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ partId: part.id, type: "ENTREE", quantity: entryQty, userId }),
  });
  alert("Entrée enregistrée !");
  setEntryQty(0);
  setShowEntry(false);
  onMovementDone();
};

const handleExit = async () => {
  if (exitQty <= 0) return alert("Quantité invalide");
  if (exitQty > part.stock) return alert("Stock insuffisant");
  await fetch(`http://localhost:3000/movements/movement`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ partId: part.id, type: "SORTIE", quantity: exitQty, userId }),
  });
  alert("Sortie enregistrée !");
  setExitQty(0);
  setShowExit(false);
  onMovementDone();
};

  return (
    <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="flex-1">
        <h3 className="font-bold text-lg">{part.name}</h3>
        <p className="text-sm text-gray-500">Marque : {part.brand?.name ?? "Non spécifiée"}</p>
        <p className="text-sm font-semibold mt-1">Stock actuel : {part.stock}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
       {/* Entrée */}
        {showEntry && (
          <input
            type="number"
            min={0}
            value={entryQty}
            onChange={(e) => setEntryQty(parseInt(e.target.value))}
            placeholder="Qté"
            className="w-16 p-1 border rounded"
          />
        )}
        <button
          onClick={() => (showEntry ? handleEntry() : setShowEntry(true))}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Entrée
        </button>

        {/* Sortie */}
        {showExit && (
          <input
            type="number"
            min={0}
            value={exitQty}
            onChange={(e) => setExitQty(parseInt(e.target.value))}
            placeholder="Qté"
            className="w-16 p-1 border rounded"
          />
        )}
        <button
          onClick={() => (showExit ? handleExit() : setShowExit(true))}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Sortie
        </button>

      </div>
    </div>
  );
}
