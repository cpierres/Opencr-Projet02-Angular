import {Component, OnInit} from '@angular/core';
import {OlympicService} from "../../../core/services/olympic.service";
import {Observable} from "rxjs";
import {AsyncPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {Router} from "@angular/router";
import {AppRoutes} from "../../../app.routes";

@Component({
  selector: 'app-olympic-global-graph',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    NgStyle
  ],
  templateUrl: './olympic-global-graph.component.html',
  styleUrls: ['./olympic-global-graph.component.scss', '../olympic-shared-graph.component.scss']
})
export class OlympicGlobalGraphComponent implements OnInit {
  participationStats$: Observable<{ countYearsJo: number; countCountries: number; }> | undefined;
  medalsCountByCountry$: Observable<{ id: number, country: string, medalsCount: number }[]> | undefined;

  constructor(private olympicService: OlympicService, private router: Router) {
  }

  ngOnInit(): void {
    this.participationStats$ = this.olympicService.getParticipationStats();
    this.medalsCountByCountry$ = this.olympicService.getMedalsCountByCountry();
  }

  goToDetailCountryStats(countryId: number): void {
    this.router.navigate([AppRoutes.OLYMPIC_STATS + '/' + countryId]);
  }

  getCardHeight(medalsCount: number): number {
    const baseHeight = 10;
    const scaleFactor = 1;
    const maxHeight = 400; // Limite supérieure
    const minHeight = 10; // Limite inférieure
    return Math.max(minHeight, Math.min(baseHeight + (medalsCount * scaleFactor), maxHeight));
  }

}
