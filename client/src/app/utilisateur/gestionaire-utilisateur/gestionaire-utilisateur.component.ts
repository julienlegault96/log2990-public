import { Component, OnInit } from '@angular/core';
import { utilisateur } from "../utilisateur";

@Component({
  selector: 'app-gestionaire-utilisateur',
  templateUrl: './gestionaire-utilisateur.component.html',
  styleUrls: ['./gestionaire-utilisateur.component.css']
})
export class GestionaireUtilisateurComponent implements OnInit {
  utilisateurBidon: utilisateur = {
    nom : "bidon"
  }
  constructor() { }

  ngOnInit() {
  }

}
