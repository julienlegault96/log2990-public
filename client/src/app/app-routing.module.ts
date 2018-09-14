import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { JeuSoloComponent } from "./jeu/jeu-solo/jeu-solo.component";

const routes: Routes = [
  { path: "jeuSolo", component: JeuSoloComponent }
];

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
