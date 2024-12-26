import {Component, OnInit} from '@angular/core';
import {
  OlympicCountryGraphComponent
} from "../../component/olympic-dashboard-stats/olympic-country-graph/olympic-country-graph.component";
import {ActivatedRoute, Router} from "@angular/router";
import {BoxStatsComponent} from "../../component/olympic-dashboard-stats/box-stats/box-stats.component";
import {OlympicService} from "../../core/services/olympic.service";
import {Observable, of} from "rxjs";
import {SeriesLine} from "../../core/models/stats/SeriesLine";
import {Stats} from "../../core/models/stats/Stats";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-olympic-country-detail',
  standalone: true,
  imports: [
    OlympicCountryGraphComponent,
    BoxStatsComponent,
    AsyncPipe
  ],
  templateUrl: './olympic-country-detail.component.html',
  styleUrl: './olympic-country-detail.component.scss'
})
export class OlympicCountryDetailComponent implements OnInit {
  boxStats$: Observable<Stats | undefined> | undefined;
  lineChartData$: Observable<SeriesLine[]| undefined > = of([]);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private olympicService: OlympicService) {
  }

  ngOnInit(): void {
    const countryId: string | null = this.activatedRoute.snapshot.paramMap.get('id');
    if (countryId) {
      this.boxStats$ = this.olympicService.getOlympicStatsOfCountryId(+countryId);
      this.lineChartData$ = this.olympicService.getMedalsSeriesLineByOlympic(+countryId);
    }
  }

  goToHome(): void {
    console.log('***** goToHome *****');
    this.router.navigate(['/']); // Navigue vers le chemin racine
  }
}
