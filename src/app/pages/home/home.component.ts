import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ChartPie} from "../../core/models/stats/ChartPie";
import {OlympicService} from "../../core/services/olympic.service";
import {Stats} from "../../core/models/stats/Stats";
import {Router} from "@angular/router";
import {AppRoutes} from "../../app.routes";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  //Commentaires pour la revue de code
  //Le code en commentaire était présent dans le starter code.
  //Je ne vois pas l'intérêt d'associer l'observable du service
  //au niveau de la page. Il me semble plus judicieux de le faire
  //dans le composant standalone réutilisable, inclus dans la page.
  //D'autre part, j'ai des services spécifiques renvoyant les données
  //statistiques adéquates à chaque élément du composant.
  //Je n'ai pas besoin d'avoir l'observable olympics$ de base ici.
  //Ce sont mes services qui se basent sur cet observable olympics$

  //olympics$: Observable<Olympic[]> = of([]) ;
  boxStats$: Observable<Stats> | undefined;
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
   * Configuration de l'événement @Output onSelectSlicePie du composant app-olympic-global-graph.
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
