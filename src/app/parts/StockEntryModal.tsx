'use client';
import { useState } from "react";
import Modal from "../components/Modal";
import { Part } from "../types/models";
import { createMovement } from "../services/MovementServices";

interface Props {
  show: boolean;
  onClose: () => void;
  part: Part | null;
  userId: number;
  onDone: (qty: number) => void
}

export default function StockEntryModal({ show, onClose, part, userId, onDone }: Props) {
  const [qty, setQty] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!part || qty <= 0) {
      alert("Quantité invalide !");
      return;
    }

    try {
      await createMovement(part.id, "ENTREE", qty, userId);
      onDone(qty); // rafraîchit la liste dans le parent
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.error || "Erreur lors de l'entrée de stock.");
    }
  };

  if (!show || !part) return null;

  return (
    <Modal show={show} onClose={onClose} title={`Entrée : ${part.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Quantité"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Valider l’entrée
        </button>
      </form>
    </Modal>
  );
}
