import { Component, OnInit } from '@angular/core';


/**
 * NotFoundComponent est un composant Angular chargé d'afficher une page "non trouvée", utilisée pour indiquer que la
 * ressource ou la page demandée n'existe pas.
 *
 * Ce composant est configuré avec le sélecteur "app-not-found".
 */
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
