'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../services/authServices';
import { HiUser } from 'react-icons/hi';
import { BiLock } from 'react-icons/bi';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await AuthService.register(username, password);
      alert(`Utilisateur créé : ${res.user.username}`);
      router.push('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Créer un compte</h1>

        {/* Username */}
        <div className="mb-4 relative">
          <HiUser className="absolute top-3 left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <BiLock className="absolute top-3 left-3 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Création...' : 'S’inscrire'}
        </button>

        <p className="mt-4 text-center text-gray-500 text-sm">
          Déjà un compte ? <a href="/login" className="text-blue-600 hover:underline">Se connecter</a>
        </p>
      </form>
    </div>
  );
}
