import { Component } from '@angular/core';
import {OlympicService} from "./core/services/olympic.service";
import {take} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    console.log('appel app.component.ts loadInitialData');
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
  }
}
