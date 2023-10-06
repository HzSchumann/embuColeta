import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { CompanyService } from './CompanyService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isMobileLayout = false;

  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private companyService: CompanyService
  ) { }

  title = 'embuColeta';

  panelOpenState = false;

  ngOnInit(): void {
    this.checkWindowSize();

    this.form = this.formBuilder.group({
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      description: ['', Validators.required],
    });

    let loader = new Loader({
      apiKey: 'AIzaSyAlHqgkM5VjGpS717H3DEl6dh47BwFFF3U'
    });

    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: -23.8308, lng: -46.8122 },
        zoom: 14,
      });

      const locations = [
        { lat: -23.828078, lng: -46.814641, name: 'Sucataria Braga', tel: '(11) 4661-4850', address: 'Rua Boa Vista, 263, Centro, Embu-Guaçu/SP' },
        { lat: -23.837750, lng: -46.824737, name: 'Edson Reciclagem Ltda', tel: '(11) 4661-3399', address: 'Avenida Pedro De Moraes, 300, Pq Industrial, Embu-Guaçu/SP' },
        { lat: -23.849745, lng: -46.823597, name: 'Rm Comercio De Sucatas', tel: '(11) 4661-7640', address: 'Rua Armando Conti, 14, Chacara Nunes, Embu-Guaçu/SP' },
        { lat: -23.848795, lng: -46.821204, name: 'M Dias Reciclagem', tel: '(11) 4661-3399', address: 'Rua Darci De Moraes, 78, Jd Florida, Embu-Guaçu/SP' },
        { lat: -23.828182, lng: -46.814705, name: 'Mr Sustentavel', tel: '(11) 4185-8650', address: 'Rua Boa Vista, 135, Centro, Embu-Guaçu/SP' },
      ];

      for (const location of locations) {
        const marker = new google.maps.Marker({
          position: location,
          map: map,
          title: location.name,
        });

        const infoContent = `
          <h1>${location.name}</h1>
          <p>${location.tel}</p>
          <p>${location.address}</p>
        `;

        const infoWindow = new google.maps.InfoWindow({
          content: infoContent,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      }
    });

  }


  @HostListener('window:resize')
  onResize() {
    this.checkWindowSize();
    this.closeMobileMenu();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    const navMenu = this.elementRef.nativeElement.querySelector('.nav-menu');
    const menuBtn = this.elementRef.nativeElement.querySelector('.mobile-menu-btn');
    if (menuBtn && this.isMobileLayout && !menuBtn.contains(event.target) && !navMenu.contains(event.target)) {
      navMenu.classList.remove('mobile-menu');
    }
  }



  onClickHamburguer() {
    const navMenu = this.elementRef.nativeElement.querySelector('.nav-menu');
    const menuBtn = this.elementRef.nativeElement.querySelector('.mobile-menu-btn');
    if (menuBtn && this.isMobileLayout) {
      navMenu.classList.toggle('mobile-menu');
    }
  }

  private checkWindowSize() {
    this.isMobileLayout = window.innerWidth <= 991;
  }

  closeMobileMenu() {
    const navMenu = this.elementRef.nativeElement.querySelector('.nav-menu');
    if (navMenu && this.isMobileLayout) {
      navMenu.classList.remove('mobile-menu');
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;

      this.companyService.enviarDados(formData).subscribe(
        (response) => {
          console.log('Dados enviados com sucesso!', response);

        },
        (error) => {
          console.error('Erro ao enviar dados:', error);
        }
      );
    }
  }

}
