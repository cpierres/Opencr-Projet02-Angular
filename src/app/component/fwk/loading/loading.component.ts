import {Component} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {LoadingService} from "../../../core/services/loading.service";


/**
 * Composant responsable de l'affichage d'un indicateur de chargement.
 *
 * Ce composant est conçu pour fonctionner comme un composant autonome
 * et utilise la directive AsyncPipe et NgIf d'Angular pour la gestion dynamique du contenu.
 *
 * L'indicateur de chargement peut être contrôlé via le LoadingService fourni,
 * permettant à d'autres parties de l'application de gérer l'état de chargement.
 *
 * Le modèle et les styles associés sont définis dans `loading.component.html`
 * et `loading.component.scss`, respectivement.
 */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {

  constructor(public loadingService:LoadingService) {
  }

}
