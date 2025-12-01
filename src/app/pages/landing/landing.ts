import { Component } from '@angular/core';
import { Home } from '../home/home';
import { Portfolio } from '../portfolio/portfolio';
import { Contact } from '../contact/contact';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [Home, Portfolio, Contact],
  template: `
    <app-home></app-home>
    <app-portfolio></app-portfolio>
    <app-contact></app-contact>
  `,
})
export class Landing {}
