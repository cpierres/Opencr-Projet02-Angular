import {SeriesLineDetail} from "./SeriesLineDetail";

/**
 * Structure attendue par le composant ngx-charts-line-chart
 * lequel est inclus dans notre composant detail-graph
 */
export interface SeriesLine {
  name: string;
  series: SeriesLineDetail[];
}
