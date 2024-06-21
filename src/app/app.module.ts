import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 
import { AppComponent } from './app.component';
import { WorldMapComponent } from './Components/world-map/world-map.component';

@NgModule({
  declarations: [
    AppComponent,
    WorldMapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
