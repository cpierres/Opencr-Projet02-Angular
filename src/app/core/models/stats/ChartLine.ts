import {SeriesLine} from "./SeriesLine";

export interface ChartLine {
  xAxisLabel: string;
  yAxisLabel: string;
  seriesLines: SeriesLine[];
}
