import {Component, OnInit} from '@angular/core';
import {OlympicService} from "../../../core/services/olympic.service";
import {Observable} from "rxjs";
import {StatsForCountry} from "../../../core/models/stats/StatsForCountry";
import {ActivatedRoute} from "@angular/router";
import {AsyncPipe, DecimalPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-olympic-country-graph',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './olympic-country-graph.component.html',
  styleUrls: ['./olympic-country-graph.component.scss','../olympic-shared-graph.component.scss']
})

export class OlympicCountryGraphComponent implements OnInit {
  statsForCountry$: Observable<StatsForCountry | undefined> | undefined;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const countryId: string | null = this.route.snapshot.paramMap.get('id');
    if (countryId) {
      this.statsForCountry$ = this.olympicService.getOlympicStatsForCountryId(+countryId);
    }
  }

}
