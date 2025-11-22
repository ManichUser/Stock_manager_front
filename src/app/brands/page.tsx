'use client';
import { useState, useEffect } from "react";
import { Brand } from "../types/models";
import { getBrands, createBrand, updateBrand, deleteBrand } from "../services/BrandsServices";
import useAuth from "../hook/useAuth";

export default function BrandDashboardPage() {
  useAuth()
  const [brands, setBrands] = useState<Brand[]>([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const loadBrands = async () => {
    const data = await getBrands();
    setBrands(data);
  };

  useEffect(() => { loadBrands(); }, []);

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return alert("Nom obligatoire !");
    await createBrand(newBrandName);
    setNewBrandName("");
    loadBrands();
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingId(brand.id);
    setEditingName(brand.name);
  };

  const handleUpdateBrand = async () => {
    if (editingId !== null && editingName.trim()) {
      await updateBrand(editingId, editingName);
      setEditingId(null);
      setEditingName("");
      loadBrands();
    }
  };

  const handleDeleteBrand = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cette marque ?")) {
      await deleteBrand(id);
      loadBrands();
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion des Marques</h1>

      {/* Formulaire d'ajout */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="Nouvelle marque"
          value={newBrandName}
          onChange={(e) => setNewBrandName(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddBrand}
          className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des marques */}
      <div className="space-y-3">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex justify-between items-center p-3 bg-white rounded shadow"
          >
            {editingId === brand.id ? (
              <input
                className="flex-1 p-1 border rounded mr-2"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
              />
            ) : (
              <span className="font-medium">{brand.name}</span>
            )}

            <div className="flex gap-2">
              {editingId === brand.id ? (
                <button
                  onClick={handleUpdateBrand}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Sauvegarder
                </button>
              ) : (
                <button
                  onClick={() => handleEditBrand(brand)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Modifier
                </button>
              )}
              <button
                onClick={() => handleDeleteBrand(brand.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
