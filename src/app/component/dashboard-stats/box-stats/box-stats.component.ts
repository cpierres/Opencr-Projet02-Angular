import {Component, Input} from '@angular/core';
import {Stats} from "../../../core/models/stats/Stats";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-box-stats',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './box-stats.component.html',
  styleUrl: './box-stats.component.scss'
})
export class BoxStatsComponent {
  @Input()
  boxStats: Stats | null | undefined = {
    name: 'Titre stats',
    stats: [
      { label: 'stat1', value: 10 },
      { label: 'stat2', value: 20 },
      { label: 'stat3', value: 20 }
    ]
  };
}
