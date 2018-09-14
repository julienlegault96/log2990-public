import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SoloGameComponent } from "./game/solo-game/solo-game.component";

const routes: Routes = [
  { path: "soloGame", component: SoloGameComponent }
];

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
