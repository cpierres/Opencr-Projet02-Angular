import {SerieName} from "./SerieName";

/**
 * Structure pour le composant DetailGraphComponent qui affiche un graphe de type Ligne.
 * Permet de changer les données globales du graphe comme les libellés de l'axe des X et de l'axe des Y.
 * Exemple :
 * - xAxisLabel = Dates/Années
 * - yAxisLabel = Nombre de médailles
 * - serieNames = il y a une série (une ligne) pour l'évolution du nbre de médailles par année pour le pays.
 * On pourrait avoir une 2ème série pour représenter le nombre moyen de médailles des autres pays.
 */
export interface DetailGraph {
  xAxisLabel: string;
  yAxisLabel: string;
  serieNames: SerieName[];
}
