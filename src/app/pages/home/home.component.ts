import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {MedalPieData} from "../../core/models/stats/MedalPieData";
import {OlympicService} from "../../core/services/olympic.service";
import {Stats} from "../../core/models/stats/Stats";

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
  medalPieData$: Observable<MedalPieData[]> | undefined;

  constructor(private olympicService: OlympicService) {
    console.log('home.component.ts constructor()');
  }

  ngOnInit(): void {
    console.log('home.component.ts ngOnInit()');
    this.boxStats$ = this.olympicService.getHomeStats();
    this.medalPieData$ = this.olympicService.getMedalsPieData();
  }

}
