import {Component} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {LoadingService} from "../../../core/services/loading.service";

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
