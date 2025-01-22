/**
 * Structure parente : ChartLineSeries.ts
 * Détail de la structure attendue par le composant ngx-charts-line-chart lequel est inclus dans notre
 * composant detail-graph.
 * Une ChartLineSeries contient plusieurs ChartLineSeriesDetail.
 * Exemple :
 * name = 2020 (une année)
 * value = 125 (nombre de médailles pour cette année)
 */
export interface ChartLineSeriesDetail {
  name: string;
  value: number;
}
