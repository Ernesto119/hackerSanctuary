import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonList,
  ],
})
export class HomePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
