'use client';
import { useEffect, useState } from "react";
import PartListDash from "./components/PartListDash";
import { Part } from "./types/models";
import { fetchParts } from "./services/PartsServices";
import StockEntryModal from "./parts/StockEntryModal";
import StockExitModal from "./parts/StockExitModal";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";
import useAuth from "./hook/useAuth";

export default function Dashboard() {
  useAuth()
  const [parts, setParts] = useState<Part[]>([]);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [modalType, setModalType] = useState<"ENTREE" | "SORTIE" | null>(null);
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

  const handleMovementDone = (qty: number) => {
    if (!selectedPart || !modalType) return;

    setParts(prev =>
      prev.map(p =>
        p.id === selectedPart.id
          ? { ...p, stock: modalType === "ENTREE" ? p.stock + qty : p.stock - qty }
          : p
      )
    );

    setModalOpen(false);
    setSelectedPart(null);
    setModalType(null);
  };

  const statsData = parts.map(p => ({ name: p.name, stock: p.stock }));

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 bg-gray-100">

      {/* TITRE */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Dashboard
      </h1>

      {/* LISTE DES PIÈCES */}
      <div className="w-full flex justify-center">
        <PartListDash userId={3} pageSize={3} />
      </div>

      {/* GRAPHIQUE */}
      <div className="bg-white p-6 rounded-xl shadow-md mt-10 w-full max-w-[1000px]">
        <h2 className="text-xl font-semibold mb-4">Stocks par pièce</h2>

        <div className="w-full h-[250px] md:h-[350px]">
          <ResponsiveContainer  width="100%" height="100%">
            <BarChart data={statsData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="stock" fill="#4ade80" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MODALES */}
      {modalType === "ENTREE" && selectedPart && (
        <StockEntryModal
          show={modalOpen}
          part={selectedPart}
          userId={1}
          onClose={() => setModalOpen(false)}
          onDone={handleMovementDone}
        />
      )}

      {modalType === "SORTIE" && selectedPart && (
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
