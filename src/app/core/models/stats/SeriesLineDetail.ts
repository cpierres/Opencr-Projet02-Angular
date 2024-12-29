/**
 * Détail de la structure attendue par le composant
 * ngx-charts-line-chart lequel est inclus dans notre
 * composant detail-graph.
 * Une SeriesLine contient plusieurs SeriesLineDetail.
 */
export interface SeriesLineDetail {
  name: string;
  value: number;
}
