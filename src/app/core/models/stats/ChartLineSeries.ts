import {ChartLineSeriesDetail} from "./ChartLineSeriesDetail";

/**
 * Structure parente : ChartLine.ts
 * Structure attendue par le composant ngx-charts-line-chart
 * Chaque ChartLineSeriesDetail[] représente une ligne donnée dans le graphe.
 * Exemple :
 * - name = France (pays)
 * - puis les données de séries : ChartLineSeriesDetail[]
 */
export interface ChartLineSeries {
  name: string;
  series: ChartLineSeriesDetail[];
}
