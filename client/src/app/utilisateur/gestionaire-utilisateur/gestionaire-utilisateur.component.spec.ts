import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionaireUtilisateurComponent } from './gestionaire-utilisateur.component';

describe('GestionaireUtilisateurComponent', () => {
  let component: GestionaireUtilisateurComponent;
  let fixture: ComponentFixture<GestionaireUtilisateurComponent>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionaireUtilisateurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionaireUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
