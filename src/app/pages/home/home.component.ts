import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ChartPie} from "../../core/models/stats/ChartPie";
import {OlympicService} from "../../core/services/olympic.service";
import {BoxStats} from "../../core/models/stats/BoxStats";
import {Router} from "@angular/router";
import {AppRoutes} from "../../app.routes";


/**
 * HomeComponent est le composant principal de l'application (dashboard), affichant des statistiques et un graphique
 * à secteurs (Pie) des médailles olympiques. Il récupère et traite les données de OlympicService et gère la navigation
 * vers les pages de détails pour les statistiques de pays spécifiques.
 *
 * Le template inclut les composants réutilisables :
 * - app-box-stats
 * - app-global-graph
 *
 * HomeComponent comprend les responsabilités suivantes :
 * - Récupérer et afficher les statistiques de la page d'accueil à l'aide du service.
 * - Gérer les interactions des utilisateurs avec le graphique à secteurs pour accéder à une vue détaillée d'un pays.
 * - Câblage de la communication pilotée par événement pour la sélection des tranches du graphique à secteurs.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  //olympics$: Observable<Olympic[]> = of([]) ;
  boxStats$: Observable<BoxStats> | undefined;
  medalPieData$: Observable<ChartPie[]> | undefined;

  constructor(
    private olympicService: OlympicService,
    private router: Router
    ) {
    //console.log('home.component.ts constructor()');
  }

  ngOnInit(): void {
    //console.log('home.component.ts ngOnInit()');
    this.boxStats$ = this.olympicService.getHomeStats();
    this.medalPieData$ = this.olympicService.getMedalsPieData();
  }

  /**
   * Configuration de l'événement @Output onSelectSlicePie du composant app-global-graph.
   * Gère la sélection d'une tranche de PieChart. Cette méthode enregistre l'élément sélectionné,
   * récupère l'ID de pays correspondant à partir de l'événement et accède à la page de détails
   * des statistiques du pays sélectionné.
   *
   * @param {ChartPie} event - L'objet événement est déclenché lorsqu'une tranche du PieChart
   * est sélectionnée. Il contient des détails sur la tranche sélectionnée, y compris une donnée
   * supplémentaire qui est l'ID du pays.
   */
  onSelectSlicePie(event: ChartPie): void {
    // console.log('onSelectSlicePie', JSON.parse(JSON.stringify(event)));
    const selectedCountryId: number = event.extra.id;
    // console.log('HomeComponent.onSelectSlicePie:', selectedCountryId);
    // Navigue vers l'écran olympic-country-detail avec l'ID du pays
    this.goToDetailCountryStats(selectedCountryId);
  }

  goToDetailCountryStats(countryId: number): void {
    // console.log('***** goToDetailCountryStats', countryId,' *****');
    this.router.navigate([AppRoutes.OLYMPIC_STATS + '/' + countryId]);
  }
}
