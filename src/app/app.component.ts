import { Component } from '@angular/core';
import {LoadingService} from "./core/services/loading.service";
//import {OlympicService} from "./core/services/olympic.service";
//import {take} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  //providers: [LoadingService]
})
export class AppComponent {
  //constructor(private olympicService: OlympicService) {}

  constructor() {
  }

  ngOnInit(): void {
    console.log('app.component.ts ngOnInit()');
    //this.olympicService.loadInitialData().pipe(take(1)).subscribe();
  }
}
