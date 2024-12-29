import {SeriesLine} from "./SeriesLine";

/**
 * Structure pour le composant detail-graph qui
 * affiche un graphe de type Ligne.
 */
export interface ChartLine {
  xAxisLabel: string;
  yAxisLabel: string;
  seriesLines: SeriesLine[];
}
