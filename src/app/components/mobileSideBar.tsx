'use client';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { FaBars, FaTimes, FaHome, FaBox, FaAd, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { FiLogOut, FiLogIn } from 'react-icons/fi';
import { HiUserAdd } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const { user, isLogged, logout } = useAuth();
  const router = useRouter();

  const handleLogOut = () => {
    logout();
    setOpen(false);
    router.push("/login");
  };

  return (
    <>
      {/* Bouton menu */}
      <button
        className="md:hidden  top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded"
        onClick={() => setOpen(true)}
      >
        <FaBars size={20} />
      </button>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setOpen(false)} />}

      {/* Sidebar mobile */}
      <aside className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Stock Manager</h1>
          <button onClick={() => setOpen(false)}><FaTimes size={20} /></button>
        </div>

        {isLogged && (
          <nav className="flex flex-col gap-4 p-4">
            <p className="text-green-500 font-semibold">User: {user?.username.toUpperCase()}</p>
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"><FaHome /> Accueil</Link>
            <Link href="/new-part" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"><FaAd /> Ajouter une pièce</Link>
            <Link href="/parts" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"><FaBox /> Pièces</Link>
            <Link href="/entree-sortie" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"><FaArrowDown /> <FaArrowUp /> Entrées/Sorties</Link>
            <button onClick={handleLogOut} className="flex items-center gap-2 p-2 text-red-600 hover:bg-gray-700 rounded mt-4"> <FiLogOut /> Se déconnecter</button>
          </nav>
        )}

        {!isLogged && (
          <nav className="flex flex-col gap-4 p-4 mt-auto">
            <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"><FiLogIn /> Se connecter</Link>
            <Link href="/register" onClick={() => setOpen(false)} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"><HiUserAdd /> S'inscrire</Link>
          </nav>
        )}
      </aside>
    </>
  );
}
