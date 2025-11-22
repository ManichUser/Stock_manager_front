'use client';
import { useState, useEffect } from "react";
import { createPart} from "../services/PartsServices";
import { Brand } from "../types/models";
import { getBrands } from "../services/BrandsServices";
import useAuth from "../hook/useAuth";

export default function NewPartPage() {

  useAuth()
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [brandId, setBrandId] = useState<number>(1); // À remplacer par votre sélection de marque
  const [brands, setBrands] = useState<Brand[]>([]);
  

  //  fetch brands
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Erreur lors du chargement des marques :", error);
      }
    };
  
    loadBrands();
  }, []);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0 || stock < 0) return alert("Remplissez correctement les champs !");
    await createPart({ name, description, price, stock, brandId });
    alert("Pièce créée !");
    setName(""); setDescription(""); setPrice(0); setStock(0);
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Créer une nouvelle pièce</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          placeholder="Nom de la pièce"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        
       <div>
       <label className=" font-semibold" > Prix : </label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Prix"
          min={0}
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
        />
       </div>
        <div>
        <label className="font-semibold" > Stock initial : </label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Stock initial"
          min={0}
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value))}
        />
        </div>
        <select
          className="w-full p-2 border rounded"
          value={brandId}
          onChange={(e) => setBrandId(parseInt(e.target.value))}
        >
        <option key={0} value={0}>selectioner une marque</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <button className="w-full py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Créer la pièce
        </button>
      </form>
    </div>
  );
}
