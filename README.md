# 📘 README — Stock Manager Frontend (Next.js + TypeScript + Tailwind CSS)

Ce projet est un frontend pour la **gestion de stock** utilisant **Next.js 16**, **TypeScript strict**, et **Tailwind CSS**. Il se connecte au backend Express/Prisma pour gérer les pièces, marques et mouvements.

---

## 🚀 1. Prérequis

Assure-toi d’avoir installé :

* **Node.js** (≥18)
* **npm**, **yarn** ou **pnpm**
* Navigateur moderne (Chrome, Firefox, Safari)

---

## 🔧 2. Installation du projet

Clone le dépôt et installe les dépendances :

```bash
npm install
# ou
yarn
# ou
pnpm install
```

---

## 🗄 3. Configuration des variables d’environnement

Crée un fichier `.env.local` à la racine du projet et ajoute l’URL de ton backend :

```env
NEXT_PUBLIC_API_URL=http://localhost:9000
```

Si ton backend est sur Render ou Docker, adapte l’URL en conséquence.

---

## 🏃 4. Lancer le serveur en développement

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Le frontend sera accessible à :

```
http://localhost:3000
```

---

## 🔄 5. Fonctionnalités principales

### 🔐 Authentification

* Connexion / Déconnexion
* Gestion des utilisateurs (admin)
* Le token est stocké dans **localStorage** pour les appels API.

### 🏷 Marques

* Lister toutes les marques
* Ajouter / Modifier / Supprimer une marque

### 📦 Pièces

* Lister toutes les pièces
* Ajouter / Modifier / Supprimer une pièce
* Chaque pièce est liée à une marque

### 📊 Mouvements (Entrées/Sorties)

* Lister les mouvements
* Créer des mouvements d’**ENTRÉE** ou **SORTIE**
* Mise à jour automatique du stock

---

## 🌐 6. Structure du projet

```
src/
 ├─ app/               # Pages et layout Next.js
 ├─ components/        # Composants réutilisables
 ├─ contexts/          # Context API (auth, theme, websocket)
 ├─ lib/               # Configuration API, utils
 ├─ services/          # Appels API (parts, brands, movements, auth)
 └─ types/             # Interfaces et types TypeScript
```

---

## 🧪 7. Tester le frontend

1. Lancer le backend (Express/Prisma) sur le port **9000**
2. Lancer le frontend (Next.js) sur le port **3000**
3. Connecte-toi et navigue dans l’interface :

   * Accueil
   * Marques (`/brands`)
   * Pièces (`/parts`)
   * Entrées/Sorties (`/entree-sortie`)

---

## ⚡ 8. Déploiement

### Sur Vercel

1. Connecte ton dépôt à **Vercel**
2. Définis la variable d’environnement `NEXT_PUBLIC_API_URL`
3. Vercel détectera automatiquement le projet Next.js et déploiera :

```bash
npm run build
npm start
```

---

## 📚 9. Ressources

* [Next.js Documentation](https://nextjs.org/docs)
* [Learn Next.js](https://nextjs.org/learn)
* [Tailwind CSS Documentation](https://tailwindcss.com/docs)
* [Axios Documentation](https://axios-http.com/docs/intro)


