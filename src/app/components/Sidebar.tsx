'use client';
import { FaBox, FaArrowUp, FaArrowDown, FaChartBar, FaHome, FaAd } from 'react-icons/fa';
import Link from 'next/link';
import { FcAddImage } from 'react-icons/fc';

export default function Sidebar() {
  return (
    <aside className="w-64  top-0 left-0 bg-gray-800 text-white h-screen p-4 lg:flex hidden flex-col ">
      <h1 className="text-2xl font-bold mb-8">Stock Manager</h1>
      <nav className="flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaHome /> Accueil
        </Link>
        <Link href="/new-part" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaAd /> Ajouter une piece
        </Link>
        <Link href="/parts" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaBox /> Pièces
        </Link>
        <Link href="/entree-sortie" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaArrowDown /> <FaArrowUp /> Entrées/Sorties
        </Link>
        
      </nav>
    </aside>
  );
}
