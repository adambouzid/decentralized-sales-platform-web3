# Decentralized Sales Platform (Web3)

Plateforme de gestion de ventes décentralisée construite avec Solidity, Hardhat, React + Vite et MongoDB. Ce dépôt contient les contrats, l'API Node/Express ainsi que le frontend.

## Pré-requis

- **Node.js 18 LTS** (npm inclus)
- **MongoDB Community Server** en local (`mongodb://localhost:27017`)
- **Ganache** (ou un noeud Hardhat) qui écoute sur `http://127.0.0.1:7545`
- **MetaMask** configuré sur le réseau Ganache

## Installation locale

```bash
# 1. Cloner le dépôt
 git clone https://github.com/adambouzid/decentralized-sales-platform-web3.git
 cd decentralized-sales-platform-web3
```

### Backend API
```bash
cd backend
cp .env.example .env   # Ajuster MONGODB_URI, PORT...
npm install
npm run dev            # http://localhost:5000
```

### Contrats Hardhat
```bash
cd smart-contracts
npm install
npx hardhat run scripts/deploy.js --network localhost
```
Copier l'adresse affichée et l'utiliser côté frontend/backend (`CONTRACT_ADDRESS`).

### Frontend Vite
```bash
cd frontend
cp .env.example .env   # Renseigner VITE_CONTRACT_ADDRESS, VITE_API_BASE_URL, VITE_GANACHE_URL
npm install
npm run dev            # http://localhost:5173
```

## Flux de test
1. Lancer MongoDB + Ganache.
2. Démarrer backend (`backend/npm run dev`).
3. Déployer les contrats et mettre à jour les `.env`.
4. Démarrer le frontend (`frontend/npm run dev`).
5. Dans l'UI : connecter MetaMask (compte Ganache), créer un produit (image locale ou URL), vérifier :
   - Transaction confirmée sur le contrat `Marketplace`.
   - Document créé dans `MongoDB -> decentralized-sales.products`.
   - Produit visible dans "Available Products".

## Ressources supplémentaires
- Documentation détaillée : `docs/`
- Guide d'installation complet : `docs/guide-installation.md`

Pour toute contribution : créer une branche, ouvrir une Pull Request et décrire les modifications (tests, migrations, etc.).
