import {Component, Input, OnInit} from '@angular/core';
import {LineChartModule} from "@swimlane/ngx-charts";
import {SeriesLine} from "../../../core/models/stats/SeriesLine";
import {LoadingService} from "../../../core/services/loading.service";
import {NgIf} from "@angular/common";
import {ChartLine} from "../../../core/models/stats/ChartLine";

@Component({
  selector: 'app-olympic-country-graph',
  standalone: true,
  imports: [
    NgIf,
    LineChartModule
  ],
  templateUrl: './olympic-country-graph.component.html',
  styleUrls: ['./olympic-country-graph.component.scss'],
  providers: [
    LoadingService
  ]
})

export class OlympicCountryGraphComponent implements OnInit {
  @Input() chartLineData: ChartLine | undefined | null = {
    xAxisLabel: 'Axe des X',
    yAxisLabel: 'Axe des Y',
    seriesLines: [
      {
        name: 'France',
        series: [
          {name: '2012', value: 100},
          {name: '2016', value: 200},
          {name: '2021', value: 210},
          {name: '2024', value: 220}
        ]
      }]
  };

  constructor() {
  }

  ngOnInit(): void {
    //console.log('OlympicCountryGraphComponent.ngOnInit');
  }
}
