"use client";
import { useState } from "react";
import PartList from "../components/PartList";
import StockEntryModal from "./StockEntryModal";
import StockExitModal from "./StockExitModal";
import { Part } from "../types/models";

export default function PartsPage() {
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [action, setAction] = useState<"ENTREE" | "SORTIE" | null>(null);

  const userId = 1;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion des pièces</h1>

      <PartList
        onEntry={(p) => { setSelectedPart(p); setAction("ENTREE"); }}
        onExit={(p) => { setSelectedPart(p); setAction("SORTIE"); }}
      />

      <StockEntryModal
        show={action === "ENTREE"}
        part={selectedPart}
        userId={userId}
        onClose={() => setAction(null)}
        onDone={() => setAction(null)}
      />

      <StockExitModal
        show={action === "SORTIE"}
        part={selectedPart}
        userId={userId}
        onClose={() => setAction(null)}
        onDone={() => setAction(null)}
      />
    </div>
  );
}
