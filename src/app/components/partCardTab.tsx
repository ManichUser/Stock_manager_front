import { Part } from "../types/models";

interface PartCardProps {
  part: Part;
  entryQty: number;
  exitQty: number;
  onEntryChange: (val: number) => void;
  onExitChange: (val: number) => void;
  onEntry: () => void;
  onExit: () => void;
  onEdit?: (part: Part) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  toggleActions?: () => void;
}

export default function PartCardTab({
  part,
  entryQty,
  exitQty,
  onEntryChange,
  onExitChange,
  onEntry,
  onExit,
  onEdit,
  onDelete,
  showActions = false,
  toggleActions
}: PartCardProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-4 py-2 text-sm text-gray-700">{part.id}</td>
      <td className="px-4 py-2 text-sm text-gray-800 font-medium">{part.name}</td>
      <td className="px-4 py-2 text-sm text-gray-600 max-w-52  ">
        {part.description ? part.description : "Non renseigné"}
      </td>
      <td className="px-4 py-2 text-sm text-center text-gray-700">{part.stock}</td>
      <td className="px-4 py-2 text-sm text-center text-yellow-600 font-medium">
        {part.price.toLocaleString()} FCFA
      </td>

      {/* Entrée / Sortie */}
      <td className="px-4 py-2 flex  justify-center gap-2">
        <input
          type="number"
          min={0}
          value={entryQty}
          onChange={(e) => onEntryChange(parseInt(e.target.value))}
          className="w-16 px-2 py-1 border rounded border-gray-300 text-gray-800 text-sm"
          placeholder="Qté"
        />
        <button
          onClick={onEntry}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-medium text-sm transition"
        >
          Entrée
        </button>
        <input
          type="number"
          min={0}
          value={exitQty}
          onChange={(e) => onExitChange(parseInt(e.target.value))}
          className="w-16 px-2 py-1 border rounded border-gray-300 text-gray-800 text-sm"
          placeholder="Qté"
        />
        <button
          onClick={onExit}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-medium text-sm transition"
        >
          Sortie
        </button>
      </td>

      {/* Actions */}
      <td className="px-4 py-2 text-center">
        {toggleActions && (
          <button
            onClick={toggleActions}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-medium text-sm transition"
          >
            Plus d'actions
          </button>
        )}
        {showActions && (
          <div className="mt-1 flex flex-col gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(part)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded font-medium text-sm transition"
              >
                Modifier
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(part.id)}
                className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded font-medium text-sm transition"
              >
                Supprimer
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}
