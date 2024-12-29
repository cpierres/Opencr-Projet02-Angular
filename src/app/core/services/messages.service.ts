import {Injectable} from '@angular/core';
import {BehaviorSubject, filter, Observable} from "rxjs";

//on ne veut pas Singleton car potentiellement plusieurs instances
// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
/**
 * Service partagé que vous pouvez utiliser n'importe (en ayant injecté le service évidemment)
 */
export class MessagesService {

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
