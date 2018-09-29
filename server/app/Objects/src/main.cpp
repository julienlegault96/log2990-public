// Prénoms, noms et matricule des membres de l'équipe:
// - Julien Legault (1847125)
// - Samuel Meilleur (1846337)

#include <iostream>
#include <math.h>
#include "inf2705-matrice.h"
#include "inf2705-nuanceur.h"
#include "inf2705-fenetre.h"
#include "inf2705-forme.h"
#include "inf2705-theiere.h"


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
FormeTore *tore = NULL;
FormeTetraedre *tetraedre = NULL;

// diverses variables d'état
struct Etat
{
  // bool enmouvement;     // le modèle est en mouvement automatique ou non
   bool afficheAxes;     // indique si on affiche les axes
   bool culling;         // indique si on veut ne pas afficher les faces arrières
   GLenum modePolygone;  // comment afficher les polygones (GL_LINE ou GL_FILL)
   int modele;           // le modèle à afficher
   double dimBoite;      // la dimension de la boite
 //  bool teteOrientee;    // l'orientation de la tête est toujours vers l'avant?
} etat = { /*false*/, true, false, GL_LINE, 1, 10.0,/* false*/ };

// variables pour définir le point de vue
const GLdouble thetaInit = 0., phiInit = 80., distInit = 40.;
class Camera
{
public:
   void definir()
   {
      if ( modeLookAt )
      {
         matrVisu.LookAt( dist*cos(glm::radians(theta))*sin(glm::radians(phi)),
                          dist*sin(glm::radians(theta))*sin(glm::radians(phi)),
                          dist*cos(glm::radians(phi)) + 5., // <= prennez note du +5
                          0., 0., 5.,  // <= prenez note du 5
                          0., 0., 1. );
      }
      else
      {
         // Indice : l'appel ci-dessus est équivalent à
         // matrVisu.LookAt( dist*cos(glm::radians(theta))*sin(glm::radians(phi)),
         //                  dist*sin(glm::radians(theta))*sin(glm::radians(phi)),
         //                  dist*cos(glm::radians(phi)),
         //                  0., 0., 0.,
         //                  0., 0., 1. );
         // matrVisu.Translate( 0., 0., -5. );

         matrVisu.LoadIdentity( );          
         // utilisez matrVisu.Translate(), matrVisu.Rotate(), ...
         matrVisu.Translate( 0., 0., -dist );
         //ajustement de la camera pour avoir une vue de cote
         matrVisu.Rotate(-phi,1,0,0);
         // rotation de la camera pour voir initialement la bestiole de face
         matrVisu.Rotate(-90,0,0,1); 
         // permet la rotation de la camera selon laxe des Y (bleu)
         matrVisu.Rotate(-theta,0,0,1);      
         matrVisu.Translate(0, 0, -5);
      }
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

// partie 1: la bestiole
class Bestiole
{
public:
   void verifierAngles() // vérifier que les angles ne débordent pas les valeurs permises
   {
      if ( anglePatte > 90.0 ) anglePatte = 90.0; else if ( anglePatte < 0.0 ) anglePatte = 0.0;
      if ( angleAile > 90.0 ) angleAile = 90.0; else if ( angleAile < 0.0 ) angleAile = 0.0;
   }
   glm::vec3 position;       // position courante de la bestiole
   GLfloat taille;           // facteur d'échelle du corps
   GLfloat angleCorps;       // angle de rotation (en degrés) de la bestiole
   GLfloat angleAile;        // angle de rotation (en degrés) des ailes
   GLfloat anglePatte;       // angle de rotation (en degrés) des pattes
   const GLfloat longPatte;  // longueur des pattes
   const GLfloat largPatte;  // largeur des pattes
} bestiole = { glm::vec3(0.0, 0.0, 2.0), 0.5, 0.0, 0.0, 0.0, 0.7, 0.1 };

// partie 2: utilisaiton de vbo et vao
GLuint vao[2] = {0,0};
GLuint vboAileSommets = 0;
GLuint vboTheiereSommets = 0;
GLuint vboTheiereConnec = 0;

void calculerPhysique( )
{
   if ( etat.enmouvement )
   {
      static int sens[6] = { +1, +1, +1, +1, +1, +1 };
      glm::vec3 vitesse( 0.03, 0.02, 0.05 );
      // mouvement en X
      if ( bestiole.position.x-bestiole.taille <= -0.5*etat.dimBoite ) sens[0] = +1.0;
      else if ( bestiole.position.x+bestiole.taille >= 0.5*etat.dimBoite ) sens[0] = -1.0;
      bestiole.position.x += vitesse.x * sens[0];
      // mouvement en Y
      if ( bestiole.position.y-bestiole.taille <= -0.5*etat.dimBoite ) sens[1] = +1.0;
      else if ( bestiole.position.y+bestiole.taille >= 0.5*etat.dimBoite ) sens[1] = -1.0;
      bestiole.position.y += vitesse.y * sens[1];
      // mouvement en Z
      if ( bestiole.position.z-bestiole.taille <= 0.0 ) sens[2] = +1.0;
      else if ( bestiole.position.z+bestiole.taille >= etat.dimBoite ) sens[2] = -1.0;
      bestiole.position.z += vitesse.z * sens[2];

      // angle des pattes et des ailes
      if ( bestiole.anglePatte <= 0.0 ) sens[3] = +1.0;
      else if ( bestiole.anglePatte >= 90.0 ) sens[3] = -1.0;
      bestiole.anglePatte += 1.0 * sens[3];
      if ( bestiole.angleAile <= 0.0 ) sens[4] = +1.0;
      else if ( bestiole.angleAile >= 90.0 ) sens[4] = -1.0;
      bestiole.angleAile += 2.0 * sens[4];

      // taille du corps
      if ( bestiole.taille <= 0.25 ) sens[5] = +1.0;
      else if ( bestiole.taille >= 1.0 ) sens[5] = -1.0;
      bestiole.taille += 0.005 * sens[5];

      // rotation du corps
      if ( bestiole.angleCorps > 360.0 ) bestiole.angleCorps -= 360.0;
      bestiole.angleCorps += 0.5;
   }
}

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

   // allouer les objets OpenGL
   glGenVertexArrays( 2, vao );

   // initialiser le premier VAO (aile)
   glBindVertexArray( vao[0] );

   // créer le VBO pour les sommets
   GLfloat sommetsAile[] = { 0.0, 0.0,  0.5, -0.5,  0.5, 0.5,  -0.5, 0.5,  -0.5, -0.5,  0.5, -0.5 };
   glGenBuffers( 1, &vboAileSommets );
   glBindBuffer( GL_ARRAY_BUFFER, vboAileSommets );
   glBufferData( GL_ARRAY_BUFFER, sizeof(sommetsAile), sommetsAile, GL_STATIC_DRAW );
   // faire le lien avec l'attribut du nuanceur de sommets
   glVertexAttribPointer( locVertex, 2, GL_FLOAT, GL_FALSE, 0, 0 );
   glEnableVertexAttribArray(locVertex);

   glBindVertexArray(0);

   // initialiser le second VAO (théière)
   glBindVertexArray( vao[1] );

   // (partie 2) MODIFICATIONS ICI ... 
         
   // generer le VBO
    glGenBuffers(1, &vboTheiereSommets);
   // lier l objet 
    glBindBuffer(GL_ARRAY_BUFFER, vboTheiereSommets);
   // Chargement du tableau de sommets sur le serveur
    glBufferData(GL_ARRAY_BUFFER, sizeof(gTheiereSommets),gTheiereSommets, GL_STATIC_DRAW);
   // faire le lien avec l attribut du nuanceur de sommets
   glVertexAttribPointer( locVertex, 3, GL_FLOAT, GL_FALSE, 0, 0 );
   glEnableVertexAttribArray(locVertex);   

   // créer le VBO la connectivité
   glGenBuffers(1, &vboTheiereConnec);
   // liaison de l objet tampon pour l utiliser
   glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, vboTheiereConnec);
    // charger le tableau de connectivite sur le serveur
   glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(gTheiereConnec), gTheiereConnec, GL_STATIC_DRAW);

   glBindVertexArray(0);

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
   glDeleteBuffers( 1, &vboAileSommets );
   glDeleteBuffers( 1, &vboTheiereSommets );
   glDeleteBuffers( 1, &vboTheiereConnec );
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

// (partie 1) Vous devez vous servir des quatre fonctions ci-dessous (*sans les modifier*) pour tracer tous les parties des objets.
// affiche un cylindre de rayon 1.0 et de longueur 1.0, dont la base est centrée en (0,0,0)
void afficherCylindre( )
{
   cylindre->afficher();
}
// affiche une sphère de rayon 0.25, centrée en (0,0,0)
void afficherSphere( )
{
   sphere->afficher();
}
// affiche un cube d'arête 1.0, centrée en (0,0,0)
void afficherCube( )
{
   cube->afficher();
}
// affiche un aile d'arête 1
void afficherQuad( )
{
   glBindVertexArray( vao[0] );
   glDrawArrays( GL_TRIANGLE_FAN, 0, 6 );
   glBindVertexArray(0);
}

void afficherCone()
{
    cone->afficher();
}

void afficherTetraedre()
{
    tetraedre->afficher();
}


// (partie 2) Vous modifierez cette fonction pour utiliser les VBOs
// affiche une théière, dont la base est centrée en (0,0,0)
void afficherTheiere()
{
   glBindVertexArray( vao[1] );
   // (partie 2) MODIFICATIONS ICI ...
   // vous pouvez utiliser temporairement cette fonction pour la première partie du TP, mais vous ferez mieux dans la seconde partie du TP
  /* glBegin( GL_TRIANGLES );
   for ( unsigned int i = 0 ; i < sizeof(gTheiereConnec)/sizeof(GLuint) ; i++ )
      glVertex3fv( &(gTheiereSommets[3*gTheiereConnec[i]] ) );
   glEnd( );*/
   
   //tracer la primitive 
   glDrawElements(GL_TRIANGLES,sizeof(gTheiereSommets), GL_UNSIGNED_INT, 0 );

   glBindVertexArray(0);
}

// afficher le corps de la bestiole
void afficherCorps()
{
    // couleur
	glVertexAttrib3f( locColor, 0.0, 1.0, 0.0 );

   // avec l'angle de rotation "bestiole.angleCorps" et de la taille "bestiole.taille"
	afficherRepereCourant( );

	
   matrModel.PushMatrix();{
	  // Place le corps a la position de la bestiole
	  matrModel.Translate( bestiole.position[0], bestiole.position[1], bestiole.position[2] );
	  // Oriente le corps afin qu'il pointe vers le haut
	  matrModel.Rotate( 90.0, 1.0, 0.0, 0.0 );
	  // Applique la rotation variable
	  matrModel.Rotate( bestiole.angleCorps, 0.0, 1.0, 0.0 );

      // afficher le bon modèle
      switch ( etat.modele )
      {
      default:
      case 1: // une bestiole (plutôt extraterrestre)
		 matrModel.PushMatrix(); {
			// oriente et deplace la bestiole pour l'aligner avec le model de la theiere
			matrModel.Rotate( -90.0, 0.0, 1.0, 0.0);
			matrModel.Translate(0.0, 0.0, -bestiole.taille);
			
			// afficher le corps
			glVertexAttrib3f( locColor, 0.0, 1.0, 0.0 ); // vert;
			matrModel.PushMatrix();{
				matrModel.Scale(bestiole.taille, bestiole.taille, 2 * bestiole.taille);
				glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
				afficherCylindre();
			}matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );

			 // afficher la tête
			 glVertexAttrib3f( locColor, 1.0, 0.0, 1.0 ); // magenta;
			 matrModel.PushMatrix();{
				matrModel.Translate( 0.0, bestiole.taille, 0.0 );
				glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
				afficherSphere();
			 }matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
		
		 } matrModel.PopMatrix();
         break;

      case 2: // une théière
         glVertexAttrib3f( locColor, 0.0, 1.0, 0.0 ); // vert; équivalent au glColor() de OpenGL 2.x
         matrModel.PushMatrix();{
            matrModel.Scale( 0.45 * bestiole.taille, 0.45 * bestiole.taille, 0.45 * bestiole.taille );
            matrModel.Translate( 0.0, -2.0, 0.0 );
            glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
            afficherTheiere();
         } matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
         break;
      }
   }matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
}

// afficher les deux ailes
void afficherAiles()
{
   glVertexAttrib3f( locColor, 1.0, 1.0, 0.0 ); // jaune;

   matrModel.PushMatrix(); {
	  // Applique la translation et rotation du corps aux ailes.
    matrModel.Translate( bestiole.position[0], bestiole.position[1], bestiole.position[2] + bestiole.taille / 2);
	  matrModel.Rotate( bestiole.angleCorps, 0.0, 0.0, 1.0 );
	  // Scaling des  ailes
      matrModel.Scale(2 * bestiole.taille, 2 * bestiole.taille, 2 * bestiole.taille);
      
      // aile 1
      matrModel.PushMatrix(); {
		  // place le centre de l'aile sur l'arete du cylindre (centre de rotation voulu)
		  matrModel.Translate( 0.0, 0.4, 0.0 );
		  matrModel.Rotate( bestiole.angleAile, 1.0, 0.0, 0.0 );
		  // place l'aile a la bonne position apres la rotation
		  matrModel.Translate( 0.0, 0.5, 0.0);
		  glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
		  afficherQuad();
	  } matrModel.PopMatrix();
	  // aile 2
      matrModel.PushMatrix(); {
		  matrModel.Translate( 0.0, -0.4, 0.0 );
		  matrModel.Rotate( -bestiole.angleAile, 1.0, 0.0, 0.0 );
		  matrModel.Translate( 0.0, -0.5, 0.0 );
		  glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
		  afficherQuad();
	  } matrModel.PopMatrix();
	  
   } matrModel.PopMatrix(); 
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
}

// afficher les quatre pattes
void afficherPattes()
{
   glVertexAttrib3f( locColor, 0.5, 0.5, 1.0 ); // bleu foncé

      matrModel.PushMatrix();{      
       // Applique la translation et rotation du corps aux pattes.
      matrModel.Translate( bestiole.position[0], bestiole.position[1], bestiole.position[2] ); 
      matrModel.Rotate(bestiole.angleCorps, 0.0, 0.0, 1.0 ); 
      
      // Patte 1
      matrModel.PushMatrix();{   
      // place la patte sur l'arete du cylindre         
      matrModel.Translate(bestiole.taille, 0.85*bestiole.taille,-bestiole.taille);
      matrModel.Rotate(-bestiole.anglePatte,-1.0, 1.0, 0.0); 
      // Scalling des Pattes     
      matrModel.Scale(bestiole.largPatte, bestiole.largPatte, bestiole.longPatte);     
      glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
      afficherCube();
      } matrModel.PopMatrix();
       // Patte 2
      matrModel.PushMatrix();{          
      matrModel.Translate(bestiole.taille, -0.85*bestiole.taille,-bestiole.taille);
      matrModel.Rotate(-bestiole.anglePatte,1.0, 1.0, 0.0); 
       matrModel.Scale(bestiole.largPatte, bestiole.largPatte, bestiole.longPatte);     
      glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
      afficherCube();
      } matrModel.PopMatrix();  
      // Patte 3
      matrModel.PushMatrix();{          
      matrModel.Translate(-bestiole.taille, 0.85*bestiole.taille,-bestiole.taille);
      matrModel.Rotate(-bestiole.anglePatte,-1.0, -1.0, 0.0); 
       matrModel.Scale(bestiole.largPatte, bestiole.largPatte, bestiole.longPatte);     
      glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
      afficherCube();
      } matrModel.PopMatrix();  
      // Patte 4
      matrModel.PushMatrix();{          
      matrModel.Translate(-bestiole.taille, -0.85*bestiole.taille,-bestiole.taille);
      matrModel.Rotate(-bestiole.anglePatte,1.0, -1.0, 0.0); 
       matrModel.Scale(bestiole.largPatte, bestiole.largPatte, bestiole.longPatte);     
      glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
      afficherCube();
      } matrModel.PopMatrix();   
    
   }matrModel.PopMatrix(); 
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
}
     
void afficherBestiole()
{
   // afficherRepereCourant( ); // débogage
   matrModel.PushMatrix();{ // sauvegarder la tranformation courante

      // afficher le corps
      afficherCorps();

      // afficher les deux ailes
      afficherAiles();

      // afficher les quatre pattes
      afficherPattes();

   }matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel ); // informer ...
}

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
   glVertexAttrib3f( locColor, 1.0, 0.5, 0.5 ); // équivalent au glColor() de OpenGL 2.x
   matrModel.PushMatrix();{
      matrModel.Translate( 0, 0, 0.5*etat.dimBoite );
      matrModel.Scale( etat.dimBoite, etat.dimBoite, etat.dimBoite );
      glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
      cubeFil->afficher();
   }matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );

   // tracer la bestiole à pattes
   glPolygonMode( GL_FRONT_AND_BACK, etat.modePolygone );
   if ( etat.culling ) glEnable( GL_CULL_FACE ); else glDisable( GL_CULL_FACE );

    glVertexAttrib3f( locColor, 1.0, 0.0, 0.0 ); //rouge
    afficherSphere(); 

   matrModel.Translate(-2,2,0);
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
   glVertexAttrib3f( locColor, 0.0, 1.0, 0.0 ); //vert
   afficherCube();

   matrModel.Translate(2,-2,0);
   matrModel.Translate(-2,-2,0);
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
   glVertexAttrib3f( locColor, 0.0, 0.0, 1.0 ); //bleu
   afficherCone();


   matrModel.Translate(2,2,0);
   matrModel.Translate(2,-2,0);
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
   glVertexAttrib3f( locColor, 1.0, 1.0, 0.0 ); // jaune
   afficherCylindre();


    matrModel.Translate(-2,2,0);
   matrModel.Translate(2,2,0);
   glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
   glVertexAttrib3f( locColor, 1.0, 0.0, 1.0 ); // Rose
   afficherTetraedre();


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

   // case TP_v: // Recharger les fichiers des nuanceurs et recréer le programme
   //    chargerNuanceurs();
   //    std::cout << "// Recharger nuanceurs" << std::endl;
   //    break;

   case TP_i: // Réinitiliaser le point de vue
      camera.phi = phiInit; camera.theta = thetaInit; camera.dist = distInit;
      break;
   case TP_g: // Permuter l'affichage en fil de fer ou plein
      etat.modePolygone = ( etat.modePolygone == GL_FILL ) ? GL_LINE : GL_FILL;
      break;
   case TP_c: // Permuter l'affichage des faces arrières
      etat.culling = !etat.culling;
      break;

   case TP_l: // Utiliser LookAt ou Translate+Rotate pour placer la caméra
      camera.modeLookAt = !camera.modeLookAt;
      std::cout << " camera.modeLookAt=" << camera.modeLookAt << std::endl;
      break;

   case TP_m: // Choisir le modèle affiché: cube, théière
      if ( ++etat.modele > 2 ) etat.modele = 1;
      std::cout << " etat.modele=" << etat.modele << std::endl;
      break;

   case TP_SOULIGNE:
   case TP_MOINS: // Reculer la caméra
      camera.dist += 0.1;
      break;
   case TP_PLUS: // Avancer la caméra
   case TP_EGAL:
      if ( camera.dist > 1.0 ) camera.dist -= 0.1;
      break;

   case TP_DROITE: // Déplacer la bestiole vers +X
      if ( bestiole.position.x + bestiole.taille < 0.5*etat.dimBoite ) bestiole.position.x += 0.1;
      break;
   case TP_GAUCHE: // Déplacer la bestiole vers -X
      if ( bestiole.position.x - bestiole.taille > -0.5*etat.dimBoite ) bestiole.position.x -= 0.1;
      break;
   case TP_PAGEPREC: // Déplacer la bestiole vers +Y
      if ( bestiole.position.y + bestiole.taille < 0.5*etat.dimBoite ) bestiole.position.y += 0.1;
      break;
   case TP_PAGESUIV: // Déplacer la bestiole vers -Y
      if ( bestiole.position.y - bestiole.taille > -0.5*etat.dimBoite ) bestiole.position.y -= 0.1;
      break;
   case TP_BAS: // Déplacer la bestiole vers +Z
      if ( bestiole.position.z + bestiole.taille < etat.dimBoite ) bestiole.position.z += 0.1;
      break;
   case TP_HAUT: // Déplacer la bestiole vers -Z
      if ( bestiole.position.z - bestiole.taille > 0.0 ) bestiole.position.z -= 0.1;
      break;

   case TP_FIN:
   case TP_f: // Diminuer la taille du corps
      if ( bestiole.taille > 0.25 ) bestiole.taille -= 0.05;
      bestiole.verifierAngles();
      std::cout << " bestiole.taille=" << bestiole.taille << " bestiole.angleCorps=" << bestiole.angleCorps << " bestiole.angleAile=" << bestiole.angleAile << " bestiole.anglePatte=" << bestiole.anglePatte << std::endl;
      break;
   case TP_DEBUT:
   case TP_r: // Augmenter la taille du corps
      bestiole.taille += 0.05;
      bestiole.verifierAngles();
      std::cout << " bestiole.taille=" << bestiole.taille << " bestiole.angleCorps=" << bestiole.angleCorps << " bestiole.angleAile=" << bestiole.angleAile << " bestiole.anglePatte=" << bestiole.anglePatte << std::endl;
      break;

   case TP_VIRGULE: // Tourner la bestiole dans le sens anti-horaire
      bestiole.angleCorps -= 2.0;
      std::cout << " bestiole.taille=" << bestiole.taille << " bestiole.angleCorps=" << bestiole.angleCorps << " bestiole.angleAile=" << bestiole.angleAile << " bestiole.anglePatte=" << bestiole.anglePatte << std::endl;
      break;
   case TP_POINT: // Tourner la bestiole dans le sens horaire
      bestiole.angleCorps += 2.0;
      std::cout << " bestiole.taille=" << bestiole.taille << " bestiole.angleCorps=" << bestiole.angleCorps << " bestiole.angleAile=" << bestiole.angleAile << " bestiole.anglePatte=" << bestiole.anglePatte << std::endl;
      break;

   case TP_CROCHETDROIT:
   case TP_o: // Diminuer l'angle des pattes
      bestiole.anglePatte -= 2.0;
      bestiole.verifierAngles();
      std::cout << " bestiole.taille=" << bestiole.taille << " bestiole.angleCorps=" << bestiole.angleCorps << " bestiole.angleAile=" << bestiole.angleAile << " bestiole.anglePatte=" << bestiole.anglePatte << std::endl;
      break;
   case TP_CROCHETGAUCHE:
   case TP_p: // Augmenter l'angle des pattes
      bestiole.anglePatte += 2.0;
      bestiole.verifierAngles();
      std::cout << " bestiole.taille=" << bestiole.taille << " bestiole.angleCorps=" << bestiole.angleCorps << " bestiole.angleAile=" << bestiole.angleAile << " bestiole.anglePatte=" << bestiole.anglePatte << std::endl;
      break;

   case TP_j: // Diminuer l'angle des ailes
      bestiole.angleAile -= 2.0;
      bestiole.verifierAngles();
      std::cout << " bestiole.taille=" << bestiole.taille << " bestiole.angleCorps=" << bestiole.angleCorps << " bestiole.angleAile=" << bestiole.angleAile << " bestiole.anglePatte=" << bestiole.anglePatte << std::endl;
      break;
   case TP_u: // Augmenter l'angle des ailes
      bestiole.angleAile += 2.0;
      bestiole.verifierAngles();
      std::cout << " bestiole.taille=" << bestiole.taille << " bestiole.angleCorps=" << bestiole.angleCorps << " bestiole.angleAile=" << bestiole.angleAile << " bestiole.anglePatte=" << bestiole.anglePatte << std::endl;
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

   case TP_ESPACE: // Mettre en pause ou reprendre l'animation
      etat.enmouvement = !etat.enmouvement;
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

       
      
      // mettre à jour la physique
      calculerPhysique( );

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
