import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BasicService } from "./basic.service";
import { HttpClientModule } from "@angular/common/http";
import { JeuSoloComponent } from './jeu-solo/jeu-solo.component';
import { AppRoutingModule } from './/app-routing.module';
import { ChronometreComponent } from './chronometre/chronometre.component';

@NgModule({
  declarations: [
    AppComponent,
    JeuSoloComponent,
    ChronometreComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [BasicService],
  bootstrap: [AppComponent]
})
export class AppModule { }
