/**
 * Structure de données attendue par le composant ngx-charts-pie-chart qui est inclus dans notre composant global-graph
 */
export interface ChartPie {
  name: string;
  value: number;
  extra: { id: number };
}
