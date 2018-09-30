
#include <iostream>
#include <math.h>
#include "inf2705-matrice.h"
#include "inf2705-nuanceur.h"
#include "inf2705-fenetre.h"
#include "inf2705-forme.h"
#include <stdio.h>
#include <stdlib.h> 
#include <time.h> 



// variables pour l'utilisation des nuanceurs
GLuint progBase;  // le programme de nuanceurs de base
GLint locVertex = -1;
GLint locColor = -1;
GLint locmatrModel = -1;
GLint locmatrVisu = -1;
GLint locmatrProj = -1;

// matrices du pipeline graphique
MatricePipeline matrModel, matrVisu, matrProj;

// les formes
FormeCube *cubeFil = NULL;
FormeCube *cube = NULL;
FormeSphere *sphere = NULL;
FormeCylindre *cylindre = NULL;
FormeCylindre *cone = NULL;
FormeTetraedre *tetraedre = NULL;

// diverses variables d'état
struct Etat{ 
   bool afficheAxes;     // indique si on affiche les axes
   bool culling;         // indique si on veut ne pas afficher les faces arrières
   GLenum modePolygone;  // comment afficher les polygones (GL_LINE ou GL_FILL)
   int modele;           // le modèle à afficher
   double dimBoite;      // la dimension de la boite
} etat = { true, false, GL_LINE, 1, 10.0};

// variables pour définir le point de vue
const GLdouble thetaInit = 0., phiInit = 80., distInit = 40.;
class Camera
{
public:
   void definir()
   {           
         matrVisu.LookAt( dist*cos(glm::radians(theta))*sin(glm::radians(phi)),
                          dist*sin(glm::radians(theta))*sin(glm::radians(phi)),
                          dist*cos(glm::radians(phi)) + 5., // <= prennez note du +5
                          0., 0., 5.,  // <= prenez note du 5
                          0., 0., 1. );      

   }

   void verifierAngles() // vérifier que les angles ne débordent pas les valeurs permises
   {
      const GLdouble MINPHI = 0.01, MAXPHI = 180.0 - 0.01;
      if ( phi > MAXPHI ) phi = MAXPHI; else if ( phi < MINPHI ) phi = MINPHI;
      if ( theta > 360.0 ) theta -= 360.0; else if ( theta < 0.0 ) theta += 360.0;
   }
   double theta;         // angle de rotation de la caméra (coord. sphériques)
   double phi;           // angle de rotation de la caméra (coord. sphériques)
   double dist;          // distance (coord. sphériques)
   bool modeLookAt;      // on utilise LookAt (au lieu de Rotate et Translate)
} camera = { thetaInit, phiInit, distInit, true };

void chargerNuanceurs()
{
   // charger le nuanceur de base
   {
      // créer le programme
      progBase = glCreateProgram();

      // attacher le nuanceur de sommets
      {
         GLuint nuanceurObj = glCreateShader( GL_VERTEX_SHADER );
         glShaderSource( nuanceurObj, 1, &ProgNuanceur::chainesSommetsMinimal, NULL );
         glCompileShader( nuanceurObj );
         glAttachShader( progBase, nuanceurObj );
         ProgNuanceur::afficherLogCompile( nuanceurObj );
      }
      // attacher le nuanceur de fragments
      {
         GLuint nuanceurObj = glCreateShader( GL_FRAGMENT_SHADER );
         glShaderSource( nuanceurObj, 1, &ProgNuanceur::chainesFragmentsMinimal, NULL );
         glCompileShader( nuanceurObj );
         glAttachShader( progBase, nuanceurObj );
         ProgNuanceur::afficherLogCompile( nuanceurObj );
      }

      // faire l'édition des liens du programme
      glLinkProgram( progBase );
      ProgNuanceur::afficherLogLink( progBase );

      // demander la "Location" des variables
      if ( ( locVertex = glGetAttribLocation( progBase, "Vertex" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de Vertex" << std::endl;
      if ( ( locColor = glGetAttribLocation( progBase, "Color" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de Color" << std::endl;
      if ( ( locmatrModel = glGetUniformLocation( progBase, "matrModel" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de matrModel" << std::endl;
      if ( ( locmatrVisu = glGetUniformLocation( progBase, "matrVisu" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de matrVisu" << std::endl;
      if ( ( locmatrProj = glGetUniformLocation( progBase, "matrProj" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de matrProj" << std::endl;
   }
}

void FenetreTP::initialiser()
{
   // donner la couleur de fond
   glClearColor( 0.0, 0.0, 0.0, 1.0 );

   // activer les etats openGL
   glEnable( GL_DEPTH_TEST );

   // charger les nuanceurs
   chargerNuanceurs();

   // créer quelques autres formes
   glUseProgram( progBase );
   cubeFil = new FormeCube( 1.0, false );
   cube = new FormeCube( 1.0, true );
   sphere = new FormeSphere( 1.0, 8, 8, true );
   cylindre = new FormeCylindre( 1.0, 1.0, 1.0, 10, 1, true );
   cone = new FormeCylindre(1.0, 0.0, 1.5,10, 1, true);
   tetraedre = new FormeTetraedre(1.5, true);

}

void FenetreTP::conclure()
{
   delete cubeFil;
   delete cube;
   delete sphere;
   delete cylindre;
   delete cone;
   delete tetraedre;
}

// affiche la position courante du repère (pour débogage)
void afficherRepereCourant( int num = 0 )
{
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
   FenetreTP::afficherAxes( 1.5, 3.0 );
}

void afficherCylindre( )
{
   cylindre->afficher();
}

void afficherSphere( )
{
   sphere->afficher();
}

void afficherCube( )
{
   cube->afficher();
}

void afficherCone()
{
    cone->afficher();
}

void afficherTetraedre()
{
    tetraedre->afficher();
}
//fonction retournant un float aleatoire
//source : https://www.gamedev.net/forums/topic/41147-random-glfloat-value/

float randFloat(const float& min, const float& max) {
	float range = max - min;
	float num = range * rand() / RAND_MAX;
	return (num + min);
}

//Sphere
glm:: vec3 ColorShpere(randFloat(0,1),randFloat(0,1),randFloat(0,1));

glm::vec3 translateSphere(randFloat(-etat.dimBoite/2,etat.dimBoite/2),
                        randFloat(-etat.dimBoite/2,etat.dimBoite/2),
                        randFloat(0,etat.dimBoite-1));

glm::vec4 RotateSphere(randFloat(0,360), randFloat(0,1),
                       randFloat(0,1),randFloat(0,1));          

GLfloat scaleSphere = randFloat(0.5, 1.5);

//Cube
glm:: vec3 ColorCube(randFloat(0,1),randFloat(0,1),randFloat(0,1));

glm::vec3 translateCube(randFloat(-etat.dimBoite/2,etat.dimBoite/2),
                        randFloat(-etat.dimBoite/2,etat.dimBoite/2),
                        randFloat(0,etat.dimBoite-0.5));

glm::vec4 RotateCube(randFloat(0,360), randFloat(0,1),
                       randFloat(0,1),randFloat(0,1));  

GLfloat scaleCube= randFloat(0.5, 1.5);

void FenetreTP::afficherScene()
{
   // effacer l'ecran et le tampon de profondeur
   glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT );

   glUseProgram( progBase );

   // définir le pipeline graphique
   matrProj.Perspective( 20.0, (GLdouble) largeur_ / (GLdouble) hauteur_, 0.1, 100.0 );
   glUniformMatrix4fv( locmatrProj, 1, GL_FALSE, matrProj ); // informer la carte graphique des changements faits à la matrice

   camera.definir();
   glUniformMatrix4fv( locmatrVisu, 1, GL_FALSE, matrVisu ); // informer la carte graphique des changements faits à la matrice

   matrModel.LoadIdentity();
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel ); // informer la carte graphique des changements faits à la matrice


   // afficher les axes
   if ( etat.afficheAxes ) FenetreTP::afficherAxes();

   // tracer la boite englobante
   glVertexAttrib3f( locColor, 1.0, 1.0, 1.0 ); // équivalent au glColor() de OpenGL 2.x
   matrModel.PushMatrix();{      
      matrModel.Translate( 0, 0, 0.5*etat.dimBoite );
      matrModel.Scale( etat.dimBoite, etat.dimBoite, etat.dimBoite );
      glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
      cubeFil->afficher();
   }matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );

    // Mode plein ou en fil
   glPolygonMode( GL_FRONT_AND_BACK, etat.modePolygone );
   if ( etat.culling ) glEnable( GL_CULL_FACE ); else glDisable( GL_CULL_FACE );

    // afficherRepereCourant();    

    glVertexAttrib3f( locColor,ColorShpere.r, ColorShpere.b, ColorShpere.g ); 
    matrModel.PushMatrix();{
    matrModel.Translate(0,0,1);              
    matrModel.Translate(translateSphere.x,translateSphere.y,translateSphere.z); 
    matrModel.Scale(scaleSphere,scaleSphere,scaleSphere);
    matrModel.Rotate(RotateSphere.x,RotateSphere.y,RotateSphere.z,RotateSphere.w);
    glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
    afficherSphere(); 
    }matrModel.PopMatrix();     
    
    
   glVertexAttrib3f( locColor, ColorCube.r, ColorCube.b, ColorCube.g ); 
   matrModel.PushMatrix();{
   matrModel.Translate(0,0,0.5);              
   matrModel.Translate(translateCube.x,translateCube.y,translateCube.z); 
   matrModel.Scale(scaleCube,scaleCube,scaleCube);
   matrModel.Rotate(RotateCube.x,RotateCube.y,RotateCube.z,RotateCube.w);
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );  
   afficherCube();
   }matrModel.PopMatrix(); 

   glVertexAttrib3f( locColor, 0.0, 0.0, 1.0 ); //bleu
   matrModel.PushMatrix();{
   
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
   afficherCone();
   }matrModel.PopMatrix(); 

   glVertexAttrib3f( locColor, 1.0, 1.0, 0.0 ); // jaune
   matrModel.PushMatrix();{
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );   
   afficherCylindre();
   }matrModel.PopMatrix(); 

   glVertexAttrib3f( locColor, 1.0, 0.0, 1.0 ); // Rose
   matrModel.PushMatrix();{
   matrModel.Translate(0,0,0.75);  
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );   
   afficherTetraedre();
   }matrModel.PopMatrix(); 

}

void FenetreTP::redimensionner( GLsizei w, GLsizei h )
{
   glViewport( 0, 0, w, h );
}

void FenetreTP::clavier( TP_touche touche )
{
   switch ( touche )
   {
   case TP_ECHAP:
   case TP_q: // Quitter l'application
      quit();
      break;
   case TP_x: // Activer/désactiver l'affichage des axes
      etat.afficheAxes = !etat.afficheAxes;
      std::cout << "// Affichage des axes ? " << ( etat.afficheAxes ? "OUI" : "NON" ) << std::endl;
      break;
   case TP_i: // Réinitiliaser le point de vue
      camera.phi = phiInit; camera.theta = thetaInit; camera.dist = distInit;
      break;
   case TP_g: // Permuter l'affichage en fil de fer ou plein
      etat.modePolygone = ( etat.modePolygone == GL_FILL ) ? GL_LINE : GL_FILL;
      break;
   case TP_c: // Permuter l'affichage des faces arrières
      etat.culling = !etat.culling;
      break;
   case TP_SOULIGNE:
   case TP_MOINS: // Reculer la caméra
      camera.dist += 0.1;
      break;
   case TP_PLUS: // Avancer la caméra
   case TP_EGAL:
      if ( camera.dist > 1.0 ) camera.dist -= 0.1;
      break;
   case TP_b: // Incrémenter la dimension de la boite
      etat.dimBoite += 0.05;
      std::cout << " etat.dimBoite=" << etat.dimBoite << std::endl;
      break;
   case TP_h: // Décrémenter la dimension de la boite
      etat.dimBoite -= 0.05;
      if ( etat.dimBoite < 1.0 ) etat.dimBoite = 1.0;
      std::cout << " etat.dimBoite=" << etat.dimBoite << std::endl;
      break;
   default:
      std::cout << " touche inconnue : " << (char) touche << std::endl;
      imprimerTouches();
      break;
   }
}

glm::ivec2 sourisPosPrec(0,0);
static bool pressed = false;
void FenetreTP::sourisClic( int button, int state, int x, int y )
{
   // button est un parmi { TP_BOUTON_GAUCHE, TP_BOUTON_MILIEU, TP_BOUTON_DROIT }
   // state  est un parmi { TP_PRESSE, DL_RELEASED }
   pressed = ( state == TP_PRESSE );
   switch ( button )
   {
   case TP_BOUTON_GAUCHE: // Déplacer (modifier angles) la caméra
      sourisPosPrec.x = x;
      sourisPosPrec.y = y;
      break;
   }
}

void FenetreTP::sourisMolette( int x, int y )
{
   const int sens = +1;
   camera.dist -= 0.2 * sens*y;
   if ( camera.dist < 15.0 ) camera.dist = 15.0;
   else if ( camera.dist > 70.0 ) camera.dist = 70.0;
}

void FenetreTP::sourisMouvement( int x, int y )
{
   if ( pressed )
   {
      int dx = x - sourisPosPrec.x;
      int dy = y - sourisPosPrec.y;
      camera.theta -= dx / 3.0;
      camera.phi   -= dy / 3.0;
      sourisPosPrec.x = x;
      sourisPosPrec.y = y;

      camera.verifierAngles();
   }
}

int main( int argc, char *argv[] )
{
   // créer une fenêtre
   FenetreTP fenetre( "LOG2990" );

   // allouer des ressources et définir le contexte OpenGL
   fenetre.initialiser();

   bool boucler = true;
   while ( boucler )
   {

      // affichage
      fenetre.afficherScene();
      fenetre.swap();

      // récupérer les événements et appeler la fonction de rappel
      boucler = fenetre.gererEvenement();
   }

   // détruire les ressources OpenGL allouées
   fenetre.conclure();

   return 0;
}
