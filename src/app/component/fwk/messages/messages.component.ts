import { Component, OnInit } from '@angular/core';
import {MessagesService} from "../../../core/services/messages.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Observable, of} from "rxjs";
import {tap} from "rxjs/operators";

/**
 * Le composant MessagesComponent est un composant Angular standalone chargé d'afficher les messages d'erreur.
 * Il utilise la programmation réactive pour afficher et gérer une liste de messages d'erreur.
 * Le composant s'abonne à un service de messages pour recevoir les mises à jour et gérer les interactions des
 * utilisateurs pour fermer l'affichage du message.
 * Pour utiliser le service partagé, il suffit d'appeler de n'importe où (après avoir injecté le service évidemment)
 * la méthode messagesService.showErrors(....).
 * Note : l'abonnement et désabonnement sont gérés automatiquement via le pipe async ; par conséquent, pas de risque
 * de fuite mémoire.
 */
@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})

export class MessagesComponent implements OnInit {
  showMessages: boolean = false;
  errors$: Observable<string[]> = of([]);

  /**
   * service en public pour :
   * - indiquer aux développeurs qu'il peut être utilisable à l'extérieur du composant lui-même (service partagé).
   *   Ainsi l'équipe peut comprendre que la méthode messagesService.showErrors(...) est accessible à l'extérieur.
   * - éventuellement, pour y accéder directement dans le template ; facilite son exploitation (Pas besoin de
   *   variables intermédiaires dans le composant pour exposer les données ou méthodes du service)
   *   mais je préfère tout de même une variable intermédiaire errors$ pour le flux afin de bénéficier du
   *   subscribe/unsubscribe automatique via le pipe async
   * @param messagesService service réactif partagé
   */
  constructor(public messagesService: MessagesService) {
    //console.log("MessagesComponent.constructor");
  }

  ngOnInit(): void {
    this.errors$ = this.messagesService.errors$
      .pipe(
        //à chaque nouvelle liste de messages reçue par l'observable
        //on indique au composant qu'il doit s'afficher
        tap(() => this.showMessages = true)
      );
  }

  /**
   *  Lorsqu'on clique sur le bouton de fermeture, le
   *  composant ne doit plus s'afficher.
   */
  onClose() {
    this.showMessages = false;
  }
}
