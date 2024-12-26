import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {AppRoutes} from "../../../app.routes";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MedalPieData} from "../../../core/models/stats/MedalPieData";
import {LoadingService} from "../../../core/services/loading.service";

@Component({
  selector: 'app-olympic-global-graph',
  standalone: true,
  imports: [
    BrowserAnimationsModule, // Obligatoire pour ngx-charts
    NgxChartsModule,
  ],
  templateUrl: './olympic-global-graph.component.html',
  styleUrls: ['./olympic-global-graph.component.scss', '../olympic-shared-graph.component.scss'],
  providers: [
    LoadingService
  ]
})
export class OlympicGlobalGraphComponent implements OnInit {

  @Input()
  medalPieData: MedalPieData[]  | null | undefined;

  @Output() pieChartClickEmitter = new EventEmitter<string>();

  onGraphClick(event: string): void {
    this.pieChartClickEmitter.emit(event);
  }

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    console.log(
      'OlympicGlobalGraphComponent.ngOnInit');
  }

  goToDetailCountryStats(countryId: number): void {
    console.log('***** goToDetailCountryStats', countryId,' *****');
    this.router.navigate([AppRoutes.OLYMPIC_STATS + '/' + countryId]);
  }

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
    console.log('onSelectSlicePie', JSON.parse(JSON.stringify(event)));
    const selectedCountryId: number = event.extra.id;
    console.log('OlympicGlobalGraphComponent.onSelectSlicePie:', selectedCountryId);
    // Navigue vers l'écran olympic-country-detail avec l'ID du pays
    this.goToDetailCountryStats(selectedCountryId);
  }
}
