import {Injectable} from '@angular/core';
import {BehaviorSubject, filter, Observable} from "rxjs";
import {IMessagesService} from "./messages.service.interface";


/**
 * Un service de gestion et de traitement des messages d'erreur. Le service utilise une approche réactive
 * avec BehaviorSubject pour stocker et exposer les messages d'erreur sous forme d'observable, permettant
 * ainsi un accès et des mises à jour contrôlés.
 * Pour utiliser le service partagé, il suffit d'appeler de n'importe où (après avoir injecté le service évidemment)
 * la méthode messagesService.showErrors(....).
 * Note : l'abonnement et désabonnement sont gérés automatiquement via le pipe async ; par conséquent, pas de risque
 * de fuite mémoire.
 */
//on ne veut pas Singleton car potentiellement plusieurs instances
@Injectable({
  providedIn: 'root'
})
//@Injectable()
export class MessagesService implements IMessagesService {

  //important de rendre le BehaviorSubject privé pour éviter une utilisation non souhaitable
  //de l'extérieur
  private subject = new BehaviorSubject<string[]>([]);

  //on expose seulement la partie Observable (pour empêcher de modifier directement la source)
  //et on ne conserve que ce qui est pertinent
  errors$: Observable<string[]> = this.subject.asObservable()
    .pipe(
      filter(messages => messages && messages.length > 0)
    );

  /**
   * Si nous voulons émettre de nouvelles erreurs, nous devons appeler showErrors
   * (donc d'une manière contrôlée par notre api)
   * @param errors liste de 1 à n messages
   */
  showErrors(...errors: string[]) {//nb arbitraire de message(s) (décomposition/rest operator)
    this.subject.next(errors);
  }
}
