import {Component, Input, OnInit} from '@angular/core';
import {LoadingService} from "../../core/services/loading.service";
import {Observable} from "rxjs";
import {MedalPieData} from "../../core/models/stats/MedalPieData";
import {OlympicService} from "../../core/services/olympic.service";

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
  titre: string = 'Médailles par pays';
  participationStats$: Observable<{ countYearsJo: number; countCountries: number; }> | undefined;
  medalPieData$: Observable<MedalPieData[]> | undefined;

  //constructor(private olympicService: OlympicService) {}
  constructor(private olympicService: OlympicService, private loadingService: LoadingService) {
    console.log('home.component.ts constructor()');
    console.log('LoadingService instance (from home.component) :', this.loadingService);
    this.loadingService.loadingOn();
  }

  ngOnInit(): void {
    console.log('home.component.ts ngOnInit()');
    //this.olympics$ = this.olympicService.getOlympics();

    this.participationStats$ = this.olympicService.getParticipationStats();
    this.medalPieData$ = this.olympicService.getMedalsPieData();
    this.loadingService.loadingOff();
  }

}
