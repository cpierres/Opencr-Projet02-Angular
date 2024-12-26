import {Component, Input, OnInit} from '@angular/core';
import {OlympicService} from "../../../core/services/olympic.service";
import {Observable, of} from "rxjs";
import {StatsForCountry} from "../../../core/models/stats/StatsForCountry";
import {ActivatedRoute} from "@angular/router";
import {AsyncPipe, NgIf} from "@angular/common";
import {LineChartModule} from "@swimlane/ngx-charts";
import {SeriesLine} from "../../../core/models/stats/SeriesLine";
import {LoadingService} from "../../../core/services/loading.service";
import {Stat} from "../../../core/models/stats/Stat";

@Component({
  selector: 'app-olympic-country-graph',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    LineChartModule
  ],
  templateUrl: './olympic-country-graph.component.html',
  styleUrls: ['./olympic-country-graph.component.scss', '../olympic-shared-graph.component.scss'],
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
    console.log(
      'OlympicCountryGraphComponent.ngOnInit');
  }
}
