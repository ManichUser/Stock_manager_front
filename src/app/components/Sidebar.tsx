'use client';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { FaHome, FaBox, FaAd, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { FiLogOut, FiLogIn } from 'react-icons/fi';
import { HiUserAdd } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { FaTag } from 'react-icons/fa6';

export default function Sidebar() {
  const { user, isLogged, logout } = useAuth();
  const router = useRouter();

  const handleLogOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-gray-800 text-white h-full p-4 flex flex-col lg:flex hidden">
      <div className="flex flex-row items-center mb-8">
        <h1 className="text-2xl font-bold">Stock Manager</h1>
        <img src="logo-removebg.png" className="w-16 h-16 bg-white rounded-lg ml-4" alt="logo" />
      </div>

      {isLogged && (
        <nav className="flex flex-col gap-4">
        <p className="font-semibold text-green-500">
          User Connected: {user?.username.toUpperCase()}
        </p>
        <Link href="/" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaHome /> Accueil
        </Link>
        <Link href="/new-part" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaAd /> Ajouter une pièce
        </Link>
        <Link href="/parts" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaBox /> Pièces
        </Link>
        <Link href="/brands" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaTag /> Marques
        </Link>
        <Link href="/entree-sortie" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaArrowDown /> <FaArrowUp /> Entrées/Sorties
        </Link>
        <button
          onClick={handleLogOut}
          className="flex items-center gap-2 p-2 text-red-600 hover:bg-gray-700 rounded mt-4"
        >
          <FiLogOut /> Se déconnecter
        </button>
      </nav>
   
      )}

      {!isLogged && (
        <nav className="flex flex-col gap-4 mt-auto">
          <Link href="/login" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"><FiLogIn /> Se connecter</Link>
          <Link href="/register" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"><HiUserAdd /> S'inscrire</Link>
        </nav>
      )}
    </aside>
  );
}
