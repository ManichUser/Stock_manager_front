"use client";

import { useState } from "react";
import { Part } from "../types/models";

interface MovementModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (qty: number) => void;
  part: Part | null;
}

export default function MovementModal({
  open,
  onClose,
  onSubmit,
  part
}: MovementModalProps) {
  
  if (!open || !part) return null;

  const [qty,setQty]=useState(0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-80">

        <h2 className="text-xl font-bold mb-4">
          Mouvement – {part.name}
        </h2>

        <input
          type="number"
          className="w-full p-2 border rounded mb-3"
          id="qty"
          placeholder="Quantité"
          onChange={(e)=>setQty(parseInt(e.target.value))}
        />

        <div className="flex justify-end gap-2 mt-4">
        <button
            onClick={() => onSubmit(qty)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
           Valider l'entrée
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
