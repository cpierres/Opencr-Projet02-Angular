import {Component, Input, OnInit} from '@angular/core';
import {LineChartModule} from "@swimlane/ngx-charts";
import {LoadingService} from "../../../core/services/loading.service";
import {NgIf} from "@angular/common";
import {ChartLine} from "../../../core/models/stats/ChartLine";

@Component({
  selector: 'app-detail-graph',
  standalone: true,
  imports: [
    NgIf,
    LineChartModule
  ],
  templateUrl: './detail-graph.component.html',
  styleUrls: ['./detail-graph.component.scss'],
  providers: [
    LoadingService
  ]
})

export class DetailGraphComponent implements OnInit {
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
      },
      // {
      //   name: 'Moyenne autres pays',
      //   series: [
      //     {name: '2012', value: 120},
      //     {name: '2016', value: 180},
      //     {name: '2021', value: 200},
      //     {name: '2024', value: 190}
      //   ]
      // },
    ]
  };

  constructor() {
  }

  ngOnInit(): void {
    //console.log('DetailGraphComponent.ngOnInit');
  }
}
