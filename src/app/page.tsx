'use client';
import { useEffect, useState } from "react";
import PartList from "./components/PartList";
import { Part } from "./types/models";
import { fetchParts } from "./services/PartsServices";
import StockEntryModal from "./parts/StockEntryModal";
import StockExitModal from "./parts/StockExitModal";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";

export default function Dashboard() {
  const [parts, setParts] = useState<Part[]>([]);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [modalType, setModalType] = useState<"IN" | "OUT" | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadParts = async () => {
    try {
      const data = await fetchParts();
      setParts(data);
    } catch (err) {
      console.error("Erreur chargement pièces :", err);
    }
  };

  useEffect(() => { loadParts(); }, []);

  const handleOpenEntry = (part: Part) => {
    setSelectedPart(part);
    setModalType("IN");
    setModalOpen(true);
  };

  const handleOpenExit = (part: Part) => {
    setSelectedPart(part);
    setModalType("OUT");
    setModalOpen(true);
  };

  const handleMovementDone = (qty: number) => {
    if (!selectedPart || !modalType) return;

    setParts(prev =>
      prev.map(p =>
        p.id === selectedPart.id
          ? { ...p, stock: modalType === "IN" ? p.stock + qty : p.stock - qty }
          : p
      )
    );

    setModalOpen(false);
    setSelectedPart(null);
    setModalType(null);
  };

  const statsData = parts.map(p => ({ name: p.name, stock: p.stock }));

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

      <main className="flex-1 p-4 md:p-10 w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
          Dashboard
        </h1>

        {/* Liste des pièces */}
        <div className="w-full">
          <PartList onEntry={handleOpenEntry} onExit={handleOpenExit} />
        </div>

        {/* Graphique */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-8 w-full">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Stocks par pièce</h2>

          <div className="w-full h-[250px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="stock" fill="#4ade80" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      {/* Modals */}
      {modalType === "IN" && selectedPart && (
        <StockEntryModal
          show={modalOpen}
          part={selectedPart}
          userId={1}
          onClose={() => setModalOpen(false)}
          onDone={handleMovementDone}
        />
      )}

      {modalType === "OUT" && selectedPart && (
        <StockExitModal
          show={modalOpen}
          part={selectedPart}
          userId={1}
          onClose={() => setModalOpen(false)}
          onDone={handleMovementDone}
        />
      )}
    </div>
  );
}
