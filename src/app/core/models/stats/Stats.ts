import {Stat} from "./Stat";

/**
 * Le composant box-stats peut afficher n boites de
 * statistiques et il y a également un titre global (name).
 */
export interface Stats {
  name: string;
  stats: Stat[];
}
