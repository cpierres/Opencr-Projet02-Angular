import {Component} from '@angular/core';
import {
  OlympicCountryGraphComponent
} from "../../component/olympic-dashboard-stats/olympic-country-graph/olympic-country-graph.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-olympic-country-detail',
  standalone: true,
  imports: [
    OlympicCountryGraphComponent
  ],
  templateUrl: './olympic-country-detail.component.html',
  styleUrl: './olympic-country-detail.component.scss'
})
export class OlympicCountryDetailComponent {

  constructor(private router: Router) {
  }

  goHome(): void {
    console.log('goHome');
    this.router.navigate(['/']); // Navigue vers le chemin racine
  }
}
