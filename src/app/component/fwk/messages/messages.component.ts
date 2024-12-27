import { Component, OnInit } from '@angular/core';
import {MessagesService} from "../../../core/services/messages.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Observable, of} from "rxjs";
import {tap} from "rxjs/operators";

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

  constructor(public messagesService: MessagesService) {
    //console.log("MessagesComponent.constructor");
  }

  ngOnInit(): void {
    this.errors$ = this.messagesService.errors$
      .pipe(
        tap(() => this.showMessages = true)
      );
  }

  onClose() {
    this.showMessages = false;
  }
}
