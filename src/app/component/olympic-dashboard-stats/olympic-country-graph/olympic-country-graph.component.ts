import {Component, Input, OnInit} from '@angular/core';
import {LineChartModule} from "@swimlane/ngx-charts";
import {SeriesLine} from "../../../core/models/stats/SeriesLine";
import {LoadingService} from "../../../core/services/loading.service";
import {NgIf} from "@angular/common";

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
  @Input()
  lineChartData: SeriesLine[] | undefined | null = [];

  constructor() {
  }

  ngOnInit(): void {
    console.log('OlympicCountryGraphComponent.ngOnInit');
  }
}
