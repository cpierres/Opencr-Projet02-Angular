import {Component, Input, OnInit} from '@angular/core';
import {LoadingService} from "../../core/services/loading.service";
import {Observable, of, take} from "rxjs";
import {MedalPieData} from "../../core/models/stats/MedalPieData";
import {OlympicService} from "../../core/services/olympic.service";
import {Olympic} from "../../core/models/Olympic";

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
  }

  ngOnInit(): void {
    console.log('home.component.ts ngOnInit()');
    // this.loadingService.loadingOn();//mauvaise solution je sais : juste pour test ... mais KO aussi
    // setTimeout(() => {
    //   console.log('Attente terminée, continuer...');
    // }, 2000); // Attend 2 secondes
    // this.olympics$ = this.olympicService.loadInitialData().pipe(
    //   //switchMap pour ne garder qu'un flux rempli et éviter l'affichage des 0 avant vraies données sur réseau lent
    //   //switchMap(() => this.subject.pipe(filter(data => !!data && data.length > 0))),
    //   take(1)// Prend juste la 1ère donnée et se complète automatiquement (=> unsubscribe)
    //   // On met take(1) ici et non pas dans loadInitialData pour plus de flexibilité
    // ).subscribe((data: Olympic[]) => console.log('OlympicService.refreshDataCache() ; Data reçues dans subscribe : ', data));

    this.participationStats$ = this.olympicService.getParticipationStats();
    this.medalPieData$ = this.olympicService.getMedalsPieData();
    //this.loadingService.loadingOff();//mauvaise solution je sais : juste pour test ... mais KO aussi
  }

}
