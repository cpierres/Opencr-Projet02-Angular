import {ChartLineSeries} from "./ChartLineSeries";

/**
 * Structure pour le composant app-detail-graph qui affiche un graphe de type Ligne.
 * Permet de changer les données globales du graphe comme les libellés de l'axe des X et de l'axe des Y.
 * Exemple :
 * xAxisLabel =  Dates
 * yAxisLabel = Nombre de médailles
 */
export interface ChartLine {
  xAxisLabel: string;
  yAxisLabel: string;
  seriesLines: ChartLineSeries[];
}
