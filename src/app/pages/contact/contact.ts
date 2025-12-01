import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ScrollService } from '../../scroll.service';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, RevealOnScrollDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  showForm = false;
  form = {
    name: '',
    email: '',
    subject: '',
    message: '',
    availability: '',
  };

  constructor(private scroll: ScrollService) {}

  toggleForm() {
    this.showForm = !this.showForm;
  }

  scrollToTop() {
    this.scroll.scrollTo('home');
  }

  submit() {
    const params = new URLSearchParams({
      subject: this.form.subject || 'Contacto desde tu web',
      body: `Hola Brian,%0D%0A
Nombre: ${this.form.name}%0D%0A
Email: ${this.form.email}%0D%0A
Disponibilidad: ${this.form.availability}%0D%0A
Mensaje:%0D%0A${this.form.message}%0D%0A`,
    });
    window.location.href = `mailto:brianvillanuevagonzalez@gmail.com?${params.toString()}`;
  }
}
