

# Plan - ERP Éducatif Multi-Écoles (MVP Web)

## Design & Style
- **Palette** : Bleu indigo principal, accents vert/orange, fond clair épuré
- **Style** : Dashboard moderne type SaaS, sidebar de navigation, cartes avec ombres légères, typographie claire
- **Responsive** : Adapté desktop et tablette

## Architecture des rôles (3 interfaces web)
Chaque rôle aura son propre dashboard et ses vues spécifiques.

---

## 1. Authentification & Rôles
- Page de connexion stylée avec logo
- Système de rôles : Super Admin, Admin École, Enseignant
- Redirection automatique vers le bon dashboard selon le rôle
- Données mockées pour simuler les utilisateurs

## 2. Super Admin
- **Dashboard global** : statistiques toutes écoles (nombre d'écoles, élèves, enseignants, recettes)
- **Gestion des écoles** : créer, modifier, lister les écoles
- **Attribution d'un Admin** à chaque école
- **Vue de supervision** : indicateurs clés par école

## 3. Admin École (Direction)
- **Dashboard école** : effectifs par classe, taux de réussite, recettes
- **Configuration** : année scolaire, cycles, classes, matières
- **Gestion des élèves** : inscription, matricule auto, affectation classe, historique
- **Gestion des enseignants** : création comptes, affectation classes/matières
- **Gestion de la scolarité** : paramétrage frais par classe, suivi paiements (payé/partiel/impayé), reçus
- **Emplois du temps** : création et visualisation par classe
- **Bulletins PDF** : génération de bulletins avec notes, moyennes, classement
- **Rapports** : effectifs, taux réussite, recettes par période, élèves en impayés

## 4. Enseignant
- **Dashboard** : vue de ses classes assignées
- **Liste des élèves** par classe
- **Saisie des notes** : contrôles et examens par matière
- **Marquage des présences/absences**
- **Consultation emploi du temps**

## 5. Fonctionnalités transversales
- **Sidebar de navigation** avec icônes, collapse possible
- **Notifications** (toasts) pour les actions
- **Tableaux de données** avec recherche et filtres
- **Génération PDF** des bulletins scolaires
- **Données mockées réalistes** pour tester toutes les fonctionnalités

---

## Approche MVP
On livre d'abord toutes ces fonctionnalités avec des données mockées. Le branchement à un vrai backend (Supabase) pourra se faire ensuite sans refonte majeure.

