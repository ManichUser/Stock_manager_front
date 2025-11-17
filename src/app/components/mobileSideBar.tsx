'use client';
import { useState } from "react";
import { FaBox, FaArrowUp, FaArrowDown, FaChartBar, FaHome, FaBars, FaTimes, FaAd } from 'react-icons/fa';
import Link from 'next/link';

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bouton pour ouvrir la sidebar */}
      <button
        className="md:hidden  top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded shadow"
        onClick={() => setOpen(true)}
      >
        <FaBars size={20} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white z-50 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Stock Manager</h1>
          <button onClick={() => setOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-4">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
            <FaHome /> Accueil
          </Link>
          <Link href="/new-part" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaAd /> Ajouter une piece
          </Link>
          <Link href="/parts" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
            <FaBox /> Pièces
          </Link>
          <Link href="/entree-sortie" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaArrowDown /> <FaArrowUp /> Entrées/Sorties
        </Link>
   
        </nav>
      </aside>
    </>
  );
}
