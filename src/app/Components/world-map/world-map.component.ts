import { Component, ElementRef, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WorldbankApiService } from '../../Services/worldbank-api.service';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss']
})
export class WorldMapComponent implements OnInit, OnDestroy {
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;
  svgContent!: SafeHtml;
  selectedCountryInfo: any = null;
  hoveredCountryName: string | null = null;
  @Output() countrySelected = new EventEmitter<any>();

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private worldbankApiService: WorldbankApiService) {}

  ngOnInit(): void {
    this.loadSvgAndCountryNames();
    document.addEventListener('mousemove', this.updateTooltipPosition.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.updateTooltipPosition.bind(this));
  }

  loadSvgAndCountryNames(): void {
    this.http.get('assets/svg/world.svg', { responseType: 'text' }).subscribe((svg: string) => {
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
      this.worldbankApiService.loadCountryNames('assets/countries.csv').then(countryNames => {
        setTimeout(() => {
          this.addHoverEffectsAndRandomColors(countryNames);
        });
      });
    });
  }

  addHoverEffectsAndRandomColors(countryNames: { [key: string]: string }): void {
    const svgElement: SVGElement = this.svgContainer.nativeElement.querySelector('svg');
    const paths = svgElement.querySelectorAll('path');
    paths.forEach(path => {
      const countryCode = path.getAttribute('id');
      const randomColor = this.generateRandomDarkColor();
      path.style.fill = randomColor;
      path.setAttribute('data-original-color', randomColor);

      if (countryCode && countryNames[countryCode]) {
        const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleElement.textContent = countryNames[countryCode];
        path.appendChild(titleElement);
      }
      path.addEventListener('mouseenter', this.onMouseEnter);
      path.addEventListener('mouseleave', this.onMouseLeave);
    });
  }

  onMouseEnter(event: MouseEvent): void {
    const element = event.target as SVGElement;
    const titleElement = element.querySelector('title');
    element.style.fill = '#cccccc';
    if (titleElement) {
      this.hoveredCountryName = titleElement.textContent;
    }
  }

  onMouseLeave(event: MouseEvent): void {
    const element = event.target as SVGElement;
    const originalColor = element.getAttribute('data-original-color');
    if (originalColor) {
      element.style.fill = originalColor;
    }
    this.hoveredCountryName = null;
  }

  updateTooltipPosition(event: MouseEvent): void {
    const tooltip = document.querySelector('.tooltip') as HTMLElement;
    if (tooltip && this.hoveredCountryName) {
      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY + 10}px`;
    }
  }

  generateRandomDarkColor(): string {
    const r = Math.floor(Math.random() * 180);
    const g = Math.floor(Math.random() * 180);
    const b = Math.floor(Math.random() * 180);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  onCountryClick(event: MouseEvent): void {
    const clickedElement = event.target as SVGElement;
    const countryCode = clickedElement.getAttribute('id');
    if (countryCode) {
      this.worldbankApiService.getCountryInfoFromWorldbank(countryCode).subscribe(
        (data: any) => {
          this.selectedCountryInfo = data;
          this.countrySelected.emit(data);
          console.log('Country data:', data);
        },
        (error) => {
          console.error('Error fetching country data:', error);
          this.selectedCountryInfo = null;
        }
      );
    } else {
      console.error('No country code found');
      this.selectedCountryInfo = null;
    }
  }
}
