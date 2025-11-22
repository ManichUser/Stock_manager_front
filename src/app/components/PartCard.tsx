'use client';
import { Part, Movement } from "../types/models";
import { useState, useEffect } from "react";
import { fetchMovements } from "../services/MovementServices";



interface PartCardProps {
  part: Part;
  userId: number;
  entryQty: number;
  exitQty: number;
  onEntryChange: (val: number) => void;
  onExitChange: (val: number) => void;
  onEntry: () => void;
  onExit: () => void;
  onEdit?: (part: Part) => void;
  onDelete?: (id: number) => void;
}

export default function PartCard({
  part, entryQty, exitQty,
  onEntryChange, onExitChange,
  onEntry, onExit,
  onEdit, onDelete
}: PartCardProps) {
  const [showEntry, setShowEntry] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [movements, setMovements] = useState<Movement[]>([]);

  const loadMovements = async () => {
    const data = await fetchMovements();
    const partMovements = data
      .filter((m: { partId: number; }) => m.partId === part.id)
      .sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    setMovements(partMovements);
  };

  useEffect(() => { loadMovements(); }, []);

  return (
    <div className="bg-gray-50 border border-gray-200 flex flex-col max-h-fit rounded-lg shadow-sm p-4 max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800 text-lg">{part.name}</h3>
        <span className="text-sm font-medium text-blue-700">{part.price.toLocaleString()} FCFA</span>
      </div>

      <div className="mb-3 text-gray-700 text-sm space-y-1">
        <p><span className="font-medium">Marque :</span> {part.brand?.name || "Non spécifiée"}</p>
        <p><span className="font-medium">Stock :</span> {part.stock}</p>
        {part.description && <p className="text-gray-500 pr-6 italic">{part.description}</p>}
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {showEntry && (
          <input
            type="number"
            value={entryQty}
            onChange={e => onEntryChange(parseInt(e.target.value))}
            className="w-20 px-2 py-1 border rounded border-gray-300 text-gray-800"
            placeholder="Qté"
          />
        )}
        <button
          onClick={() => showEntry ? onEntry() : setShowEntry(true)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-medium"
        >
          Entrée
        </button>

        {showExit && (
          <input
            type="number"
            value={exitQty}
            onChange={e => onExitChange(parseInt(e.target.value))}
            className="w-20 px-2 py-1 border rounded border-gray-300 text-gray-800"
            placeholder="Qté"
          />
        )}
        <button
          onClick={() => showExit ? onExit() : setShowExit(true)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-medium"
        >
          Sortie
        </button>
      </div>

      <div className="flex gap-2 mb-2">
        <button onClick={() => onEdit?.(part)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded font-medium">Modifier</button>
        <button onClick={() => onDelete?.(part.id)} className="flex-1 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded font-medium">Supprimer</button>
      </div>

      <button
        onClick={() => setShowRecent(!showRecent)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 rounded font-medium mb-2"
      >
        {showRecent ? "Masquer les mouvements" : "Voir les mouvements"}
      </button>

      {showRecent && (
        <div className="bg-white border border-gray-200 rounded p-2 text-sm text-gray-700">
          {movements.length === 0 ? (
            <p className="text-gray-400">Aucun mouvement enregistré.</p>
          ) : (
            <ul className="space-y-1">
              {movements.map(m => (
                <li key={m.id} className="flex justify-between">
                  <span className={m.type === "ENTREE" ? "text-green-600" : "text-red-600"}>{m.type}</span>
                  <span className="text-gray-500 text-xs">{new Date(m.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
