import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'world-map';
  selectedCountry: any = null;
hoveredCountryName: any;
   displayCountryInfo(countryData: any): void {
  this.selectedCountry = countryData;
 }
}
