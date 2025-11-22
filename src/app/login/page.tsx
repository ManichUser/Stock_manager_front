'use client'
import { useState } from 'react';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';

import { useRouter } from 'next/navigation';
import { AuthService } from '../services/authServices';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {login}=useAuth()
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await AuthService.login(username,password)
      localStorage.setItem('token', res.token);
      login(res.token);
      router.push('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-fadeIn"
      >
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center gap-2">
          <FiLogIn className="text-blue-600" />
          Connexion
        </h1>

        {/* Username field */}
        <div className="relative mb-4">
          <FiUser className="absolute left-3 top-3 text-gray-400 text-xl" />
          <input
            className="w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
          />
        </div>

        {/* Password field */}
        <div className="relative mb-4">
          <FiLock className="absolute left-3 top-3 text-gray-400 text-xl" />
          <input
            type="password"
            className="w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
          />
        </div>

        {/* Submit button */}
        <button
          className="w-full py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all font-medium shadow-md"
        >
          <FiLogIn />
          Se connecter
        </button>

        {/* Footer hint */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Accès réservé aux utilisateurs autorisés.
        </p>
      </form>
    </div>
  );
}
