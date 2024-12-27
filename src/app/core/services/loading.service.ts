import { Injectable } from '@angular/core';
import {BehaviorSubject, concatMap, finalize, Observable, of} from "rxjs";
import {tap} from "rxjs/operators";

/**
 * Service de loading (message d'attente) partagé réactif.
 * Le but est de rendre très simple pour les composants à différents niveaux de l'arborescence des
 * composants de pouvoir interagir les uns avec les autres de manière découplée et maintenable
 */
//@Injectable()//on ne veut pas Singleton car potentiellement plusieurs instances
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  /**
   * va dériver un observable du loadingSubject qui émet exactement les mêmes valeurs que le sujet,
   * mais ce sera simplement un observable ; donc l'observable loading$ ne nous permettra pas de contrôler
   * quelles valeurs sont émises avec le loadingSubject.
   * Nous pourrons uniquement nous y abonner et être avertis lorsque de nouvelles valeurs seront
   * disponibles tout en conservant la capacité d'émettre de nouvelles valeurs observables
   * à l'intérieur du LoadingService (via loadingSubject privé).
   */
  loading$ = this.loadingSubject.asObservable();

  constructor() {
    //console.log("LoadingService created ...");
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }

  /**
   * va prendre comme argument d'entrée un observable qui est l'observable dont nous voulons suivre
   * le cycle de vie afin de décider si l'indicateur de loading doit être utilisé ou non.
   * Et nous allons renvoyer comme sortie de cette méthode, un autre observable du même type.
   * Et cet observable que nous renvoyons ici va avoir des capacités d'indicateur de chargement.
   * Ainsi, ces nouveaux observables pourront activer et désactiver l'indicateur de chargement au moment approprié.
   * Comme ces méthodes devraient être compatibles avec les observables de tout type, nous définissons un
   * type générique, en ajoutant ici un argument de type générique à notre fonction.
   * Ainsi, nous pourrons avoir du code de type sécurisé avec n’importe quel type d’observable.
   * @param observable$
   */
  showLoaderUntilCompleted<T>(observable$: Observable<T>): Observable<T> {
    //console.log('showLoaderUntilCompleted()');
    return of(null)//on crée un observable null qui se complète/termine immédiatement et on enchaine avec la suite
      .pipe(
        tap(() => this.loadingOn()),//effet secondaire : on déclenche loadingOn() qui affiche l'indicateur
        concatMap(() => observable$),//les valeurs émises par le résultat observable vont être identiques
        // aux valeurs émises par l'observable d'entrée, à l'exception du fait
        // que l'indicateur de chargement a déjà été activé (via
        // loadingSubject défini dans loadingOn).
        finalize(() => this.loadingOff()) //lorsque cette entrée observable$ se termine ou génère une erreur,
        //on désactive l'indicateur de loading
      );
    //l'observable retourné sera de même type que l'observable$ en entrée
  }
}
