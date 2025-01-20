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


/**
 * Le composant OlympicCountryDetailComponent est responsable de l'affichage des détails
 * d'un pays olympique, y compris des données statistiques et un graphique linéaire des médailles.
 * Il récupère les données de manière dynamique à l'aide du service olympique en fonction d'un identifiant de pays
 * récupéré à partir des paramètres ActivatedRoute.
 *
 * Il intègre les composants enfants suivants :
 * - BoxStatsComponent : affiche des statistiques récapitulatives dans un format de type boîte.
 * - DetailGraphComponent : affiche des détails graphiques dans un graphe linéaire (potentiellement, d'autres séries
 * peuvent être ajoutées.
 *
 * Il utilise également AsyncPipe d'Angular pour gérer les flux de données asynchrones.
 *
 * Principales fonctionnalités :
 * - Récupère et affiche les statistiques olympiques pour un pays spécifique.
 * - Récupère et restitue un graphique linéaire représentant les tendances des médailles du pays pour chaque participation.
 * - Fournit une fonctionnalité de navigation pour revenir à la vue d'accueil.
 *
 * Méthodes :
 * - ngOnInit : initialise le composant, récupère l'identifiant du pays à partir de l'URL et récupère les données nécessaires.
 * - goToHome : revient à la page d'accueil.
 */
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
