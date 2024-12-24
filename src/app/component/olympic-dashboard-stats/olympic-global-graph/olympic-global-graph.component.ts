import {Component, OnInit} from '@angular/core';
import {OlympicService} from "../../../core/services/olympic.service";
import {Observable} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {AppRoutes} from "../../../app.routes";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MedalPieData} from "../../../core/models/stats/MedalPieData";

@Component({
  selector: 'app-olympic-global-graph',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    //NgForOf,
    //NgStyle,
    BrowserAnimationsModule, // Obligatoire pour ngx-charts
    NgxChartsModule
  ],
  templateUrl: './olympic-global-graph.component.html',
  styleUrls: ['./olympic-global-graph.component.scss', '../olympic-shared-graph.component.scss']
})
export class OlympicGlobalGraphComponent implements OnInit {
  participationStats$: Observable<{ countYearsJo: number; countCountries: number; }> | undefined;
  //medalsCountByCountry$: Observable<{ id: number, country: string, medalsCount: number }[]> | undefined;
  medalPieData$: Observable<MedalPieData[]> | undefined;

  constructor(private olympicService: OlympicService, private router: Router) {
  }

  ngOnInit(): void {
    console.log(
      'OlympicGlobalGraphComponent.ngOnInit');
    this.participationStats$ = this.olympicService.getParticipationStats();
    //this.medalsCountByCountry$ = this.olympicService.getMedalsCountByCountry();
    this.medalPieData$ = this.olympicService.getMedalsPieData();
  }

  goToDetailCountryStats(countryId: number): void {
    console.log('***** goToDetailCountryStats', countryId),' *****';
    this.router.navigate([AppRoutes.OLYMPIC_STATS + '/' + countryId]);
  }

  // getCardHeight(medalsCount: number): number {
  //   const baseHeight = 10;
  //   const scaleFactor = 1;
  //   const maxHeight = 400; // Limite supérieure
  //   const minHeight = 10; // Limite inférieure
  //   return Math.max(minHeight, Math.min(baseHeight + (medalsCount * scaleFactor), maxHeight));
  // }

  /**
   * Handles the selection of a slice from the pie chart. This method logs the selected item,
   * retrieves the corresponding country ID from the event, and navigates to the detail page
   * for the selected country's statistics.
   *
   * @param {any} event - The event object triggered when a slice of the pie chart is selected.
   *                       It contains details about the selected slice, including extra data like the country ID.
   * @return {void} This method does not return any value.
   */
  onSelectSlicePie(event: MedalPieData): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(event)));
    const selectedCountryId: number = event.extra.id;
    console.log('OlympicGlobalGraphComponent.onSelectSlicePie:', selectedCountryId);
    // Navigue vers l'écran olympic-country-detail avec l'ID du pays
    this.goToDetailCountryStats(selectedCountryId);
  }

}
