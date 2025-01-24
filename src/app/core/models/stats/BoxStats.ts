import {BoxStat} from "./BoxStat";

/**
 * Le composant box-stats peut afficher n boites de statistiques et il y a également un titre global (name).
 */
export interface BoxStats {
  name: string; // Titre global de l'entête des statistiques
  stats: BoxStat[]; // Liste générique des éléments statistiques
}
