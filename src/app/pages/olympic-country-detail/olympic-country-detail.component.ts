import {Component} from '@angular/core';
import {
  OlympicCountryGraphComponent
} from "../../component/olympic-dashboard-stats/olympic-country-graph/olympic-country-graph.component";

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

}
