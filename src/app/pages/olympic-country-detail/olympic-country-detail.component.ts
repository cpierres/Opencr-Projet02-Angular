import {Component, OnInit} from '@angular/core';
import {
  DetailGraphComponent
} from "../../component/dashboard-stats/detail-graph/detail-graph.component";
import {ActivatedRoute, Router} from "@angular/router";
import {BoxStatsComponent} from "../../component/dashboard-stats/box-stats/box-stats.component";
import {OlympicService} from "../../core/services/olympic.service";
import {Stats} from "../../core/models/stats/Stats";
import {AsyncPipe} from "@angular/common";
import {Observable} from "rxjs";
import {ChartLine} from "../../core/models/stats/ChartLine";

@Component({
  selector: 'app-olympic-country-detail',
  standalone: true,
  imports: [
    DetailGraphComponent,
    BoxStatsComponent,
    AsyncPipe
  ],
  templateUrl: './olympic-country-detail.component.html',
  styleUrl: './olympic-country-detail.component.scss'
})
export class OlympicCountryDetailComponent implements OnInit {
  boxStats$: Observable<Stats | undefined> | undefined;
  lineChartData$: Observable<ChartLine | undefined> | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private olympicService: OlympicService) {
  }

  ngOnInit(): void {
    const countryId: string | null = this.activatedRoute.snapshot.paramMap.get('id');
    if (countryId) {
      this.boxStats$ = this.olympicService.getOlympicStatsOfCountryId(+countryId);
      this.lineChartData$ = this.olympicService.getMedalsChartLineByOlympic(+countryId);
    }
  }

  goToHome(): void {
    //console.log('***** goToHome *****');
    this.router.navigate(['/']); // Navigue vers le chemin racine
  }
}
