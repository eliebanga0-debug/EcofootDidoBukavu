# ⚽ Ecofoot Bukavu - Plateforme de Gestion Sportive

![Version](https://img.shields.io/badge/version-2.0-green)
![Status](https://img.shields.io/badge/status-production-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Aperçu du Projet

Ecofoot Bukavu est une plateforme web complète de gestion sportive conçue pour gérer efficacement les opérations sportives, les utilisateurs, et les transactions financières pour une organisation de football à Bukavu.

### Fonctionnalités Principales

- ✅ **Système d'Authentification Sécurisé** - Authentification par email/mot de passe avec gestion des rôles
- ✅ **Contrôle d'Accès Basé sur les Rôles (RBAC)** - Admin, Staff, Élèves, Parents
- ✅ **Tableaux de Bord Personnalisés** - Pour chaque type d'utilisateur
- ✅ **Gestion des Utilisateurs** - Inscription, modification, désactivation
- ✅ **Répertoire des Joueurs** - Base de données complète des joueurs
- ✅ **Gestion du Staff** - Gestion des rôles et responsabilités
- ✅ **Chat en Temps Réel** - Communication directe entre utilisateurs
- ✅ **Système de Paiement** - Suivi des transactions et paiements
- ✅ **Réunions Planifiées** - Planification et gestion des réunions
- ✅ **Journaux d'Audit Complets** - Suivi de toutes les activités du système
- ✅ **Notifications Système** - Alertes en temps réel
- ✅ **Rapports Financiers** - Analyse des revenus et paiements
- ✅ **Mode Maintenance** - Pour les mises à jour du système
- ✅ **Export de Données** - Sauvegarde et exportation complètes

---

## 👥 Rôles et Permissions

### 1. **Administrateur (Admin)**
- **Accès Complet** au système
- Gestion de tous les utilisateurs
- Accès aux paramètres du système
- Génération de rapports financiers
- Consultation des journaux d'audit
- Contrôle de mode maintenance
- Export/Import de données
- Réinitialisation des mots de passe
- Désactivation/Activation des comptes

### 2. **Staff (Personnel)**
- Gestion de base des utilisateurs
- Consultation des journaux d'audit (limité)
- Gestion des joueurs
- Accès aux paiements
- Participation aux réunions

### 3. **Élèves (Students)**
- Accès à leur tableau de bord personnel
- Modification de leur propre profil
- Consultation des paiements personnels
- Participation au chat et réunions
- Consultation de l'annuaire des joueurs

### 4. **Parents**
- Accès au portail parent
- Consultation des informations de l'enfant
- Communication avec l'administration
- Consultation des paiements

---

## 🔐 Sécurité et Contrôles Administratifs

### Sécurité Intégrée

- ✅ **Verrouillage de Compte** - Après 5 tentatives de connexion échouées
- ✅ **Session Timeout** - Déconnexion automatique après inactivité (1 heure par défaut)
- ✅ **Audit Logs Complets** - Toutes les actions enregistrées avec timestamp
- ✅ **Protection Admin** - Seuls les admins peuvent accéder aux pages admin
- ✅ **Validation des Données** - Contrôle des entrées utilisateur
- ✅ **Historique des Modifications** - Traçabilité complète

### Informations Sensibles Accessibles par l'Admin Uniquement

| Information | Accès | Description |
|-----------|------|-----------|
| **Journaux d'Audit** | Admin | Suivi complet de toutes les activités |
| **Données Financières** | Admin | Rapports de revenus, paiements en attente |
| **Gestion des Utilisateurs** | Admin | Création, modification, suppression d'utilisateurs |
| **Paramètres Système** | Admin | Configuration du site et fonctionnalités |
| **Réinitialisation Mots de Passe** | Admin | Réinitialisation des comptes verrouillés |
| **Mode Maintenance** | Admin | Mise en maintenance du site |
| **Sauvegarde de Données** | Admin | Export et sauvegarde complètes |

---

## 📁 Structure du Projet

```
html/
├── index.html                    # Page d'accueil
├── login.html                    # Page de connexion
├── registration.html             # Page d'inscription
├── admin-dashboard.html          # Tableau de bord administrateur
├── admin-settings.html           # Paramètres administrateur (NEW)
├── audit-logs.html               # Journaux d'audit (NEW)
├── student-dashboard.html        # Tableau de bord élève
├── parent-dashboard.html         # Portail parent
├── staff-management.html         # Gestion du staff
├── player-directory.html         # Répertoire des joueurs
├── live-chat.html                # Chat en temps réel
├── payment.html                  # Système de paiement
├── css/
│   └── styles.css                # Feuilles de style
├── js/
│   └── app.js                    # Logique principale de l'application (AMÉLIORÉ)
└── README.md                     # Documentation (NOUVEAU)
```

---

## 🚀 Guide de Démarrage

### Installation

1. **Clonez ou téléchargez le projet**
   ```bash
   git clone https://github.com/votre-repo/ecofoot-bukavu.git
   cd ecofoot-bukavu/html
   ```

2. **Ouvrez le projet dans un navigateur**
   - Ouvrez `index.html` dans votre navigateur web
   - Ou déployez sur un serveur web

3. **Aucune dépendance externe requise**
   - Le projet utilise uniquement HTML, CSS et JavaScript vanilla
   - Toutes les données sont stockées en localStorage

### Identifiants de Démonstration

#### Admin
- **Email**: `admin@ecofoot.com`
- **Mot de passe**: `admin123`

#### Élève
- **Email**: `john@ecofoot.com`
- **Mot de passe**: `student123`

#### Parent
- **Email**: `jane@ecofoot.com`
- **Mot de passe**: `parent123`

#### Staff
- **Email**: `bob@ecofoot.com`
- **Mot de passe**: `staff123`

---

## 📊 Utilisation des Fonctionnalités

### 🔐 Connexion et Authentification

1. Allez sur la page de **Connexion**
2. Entrez votre email et mot de passe
3. Cliquez sur "Se connecter"
4. Vous serez redirigé vers votre tableau de bord en fonction de votre rôle

### 👤 Inscription

1. Allez sur la page d'**Inscription**
2. Remplissez le formulaire avec vos informations
3. Sélectionnez votre rôle
4. Cliquez sur "S'inscrire"
5. Allez à la page de **Connexion** pour vous connecter

### 📋 Tableau de Bord Admin

**Accès**: Admin uniquement

**Fonctionnalités**:
- Vue d'ensemble du système (statistiques)
- Gestion des utilisateurs
- Rapports financiers
- États des paiements

**Sous-pages Admin**:
- **Paramètres** (`admin-settings.html`) - Configuration du système
- **Journaux d'Audit** (`audit-logs.html`) - Historique complet des activités

### ⚙️ Paramètres Administrateur

**URL**: `/admin-settings.html`

**Fonctionnalités**:
- Modification du nom du site
- Activation/Désactivation des inscriptions
- Mode maintenance
- Gestion des utilisateurs
- Rapports financiers
- Export de données
- Suppression de toutes les données

### 📝 Journaux d'Audit

**URL**: `/audit-logs.html`

**Fonctionnalités**:
- Vue de tous les journaux d'audit
- Filtrage par utilisateur, action, rôle, date
- Export en CSV
- Statistiques d'activité
- Détection des tentatives non autorisées

### 💳 Gestion des Paiements

**Pages**: `/payment.html`

**Fonctionnalités**:
- Création de paiements
- Suivi de l'état des paiements
- Rapports financiers (admin uniquement)
- Validation et approbation (admin uniquement)

### ⚽ Répertoire des Joueurs

**Pages**: `/player-directory.html`

**Fonctionnalités**:
- Liste complète des joueurs
- Ajout de nouveaux joueurs (admin/staff)
- Modification des informations
- Suppression de joueurs

### 💬 Chat en Temps Réel

**Pages**: `/live-chat.html`

**Fonctionnalités**:
- Communication directe entre utilisateurs
- Historique des messages
- Gestion des réunions

### 👥 Gestion du Staff

**Pages**: `/staff-management.html`

**Fonctionnalités**:
- Liste du personnel
- Assignation des rôles
- Gestion des départements

---

## 🎨 Structure de la Base de Données (LocalStorage)

### Collections Principales

#### Users
```json
{
  "id": 1234567890,
  "fullName": "Admin User",
  "email": "admin@ecofoot.com",
  "password": "admin123",
  "role": "admin",
  "phone": "+243999999999",
  "registeredDate": "2024-01-01T00:00:00.000Z",
  "active": true,
  "loginAttempts": 0
}
```

#### Payments
```json
{
  "id": 1234567890,
  "userId": 1234567890,
  "amount": 100.00,
  "date": "2024-01-01T00:00:00.000Z",
  "status": "completed",
  "transactionId": "TXN-1234567890"
}
```

#### Audit Logs
```json
{
  "id": 1234567890,
  "userId": 1234567890,
  "userName": "Admin User",
  "userRole": "admin",
  "action": "LOGIN_SUCCESS",
  "details": {},
  "timestamp": "2024-01-01T00:00:00.000Z",
  "ipAddress": "Client-Side",
  "userAgent": "Mozilla/5.0..."
}
```

#### Players
```json
{
  "id": 1234567890,
  "firstName": "Kaka",
  "lastName": "Mukanda",
  "position": "Forward",
  "number": 10,
  "team": "Ecofoot A",
  "joinDate": "2024-01-01T00:00:00.000Z",
  "status": "active"
}
```

---

## 🔍 Actions Auditées par le Système

Le système enregistre automatiquement les actions suivantes:

- `LOGIN_SUCCESS` - Connexion réussie
- `LOGIN_FAILED` - Connexion échouée
- `LOGOUT` - Déconnexion
- `USER_REGISTRATION` - Nouvel enregistrement
- `USER_UPDATED` - Modification d'utilisateur
- `USER_DELETED` - Suppression d'utilisateur
- `USER_DISABLED` - Utilisateur désactivé
- `USER_ENABLED` - Utilisateur réactivé
- `PASSWORD_RESET` - Mot de passe réinitialisé
- `PAYMENT_CREATED` - Paiement créé
- `PAYMENT_STATUS_UPDATED` - État du paiement modifié
- `SYSTEM_SETTINGS_UPDATED` - Paramètres système modifiés
- `MAINTENANCE_MODE` - Mode maintenance activé/désactivé
- `SYSTEM_DATA_EXPORTED` - Données exportées
- `SYSTEM_DATA_CLEARED` - Données supprimées
- `UNAUTHORIZED_ACCESS_ATTEMPT` - Tentative d'accès non autorisé
- `FINANCIAL_REPORT_GENERATED` - Rapport financier généré

---

## 📱 Compatibilité

- **Navigateurs Supportés**:
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+
  - Mobile Safari (iOS 12+)
  - Chrome Mobile (Android 5+)

- **Stockage**: LocalStorage (minimum 5MB recommandé)

---

## 🛠️ Technologies Utilisées

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Stockage**: LocalStorage (Client-side)
- **Responsive**: Design adaptatif pour mobiles et desktop
- **Aucune dépendance externe** - Pure JavaScript

---

## 📞 Support et Maintenance

### Problèmes Courants

**Le système affiche "Accès Refusé"**
- Assurez-vous d'être connecté avec un compte admin
- Vérifiez que votre session n'a pas expiré
- Reconnectez-vous

**Les données ne sont pas sauvegardées**
- Vérifiez que le localStorage est activé dans votre navigateur
- Nettoyez le cache et les cookies
- Réessayez

**Le mot de passe est oublié**
- Connectez-vous avec un compte admin
- Allez à "Paramètres" → "Gestion des Utilisateurs"
- Réinitialisez le mot de passe de l'utilisateur

---

## 🔄 Mises à Jour Récentes (v2.0)

### Nouvelles Fonctionnalités
✨ **Audit Logs Complets** - Suivi de toutes les activités
✨ **Page Paramètres Admin** - Configuration centralisée du système
✨ **Notifications Système** - Alertes en temps réel
✨ **Rapports Financiers** - Analyse détaillée des paiements
✨ **Sécurité Renforcée** - Session timeout, verrouillage de compte

### Améliorations de Sécurité
🔒 Authentification améliorée
🔒 Protection des données admin
🔒 Audit trail complet
🔒 Gestion des sessions

---

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Développeur

**Ecofoot Bukavu Development Team**

Pour toute question ou suggestion, contactez l'équipe d'administration.

---

## 🎯 Feuille de Route Futures

- [ ] Intégration backend avec API REST
- [ ] Authentification OAuth
- [ ] Système de notifications email
- [ ] Application mobile native
- [ ] Calendrier intégré
- [ ] Système de réservation de terrain
- [ ] Streaming des matchs
- [ ] Statistiques avancées
- [ ] Intégration de paiement en ligne

---

## ⚠️ Avis Important

**Cette plateforme utilise le stockage local du navigateur (localStorage).**

- Les données sont stockées localement sur l'appareil de l'utilisateur
- Pas de synchronisation entre appareils
- Le nettoyage du cache supprimera les données
- Pour un environnement de production, intégrez une base de données backend

---

**Dernière mise à jour**: 2024
**Version**: 2.0 - Production Ready

Merci d'utiliser Ecofoot Bukavu! ⚽
