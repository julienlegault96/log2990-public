// vanilla3DObjects.cpp : Defines the entry point for the console application.
//

#pragma comment(lib,"opengl32.lib")
#include <iostream>
#include <math.h>
#include "inf2705-matrice.h"
#include "inf2705-nuanceur.h"
#include "inf2705-fenetre.h"
#include "inf2705-forme.h"
#include <stdio.h>
#include <stdlib.h> 
#include <time.h> 
#include "Shape.h"
#include "ShapesContainer.h"
#include "Pixel.h"
#include "Image.h"
#include "ImageHeader.h"

// variables pour l'utilisation des nuanceurs
GLuint progBase;  // le programme de nuanceurs de base
GLint locVertex = -1;
GLint locNormal;
GLint locColor = -1;
GLint locmatrModel = -1;
GLint locmatrVisu = -1;
GLint locmatrProj = -1;
GLint locmatrNormale;
GLint locplanCoupe;
GLuint indLightSource;
GLuint indFrontMaterial;
GLuint indLightModel;

GLuint ubo[3];
// matrices du pipeline graphique
MatricePipeline matrModel, matrVisu, matrProj;

// les formes
ShapesContainer *shapes = NULL;
// définition des lumières
struct LightSourceParameters
{
	glm::vec4 ambient;
	glm::vec4 diffuse;
	glm::vec4 specular;
	glm::vec4 position;       // dans le repère du monde (il faudra convertir vers le repère de la caméra pour les calculs)
	glm::vec3 spotDirection;  // dans le repère du monde (il faudra convertir vers le repère de la caméra pour les calculs)
	float spotExposant;
	float spotAngleOuverture; // angle d'ouverture delta du spot ([0.0,90.0] ou 180.0)
	float constantAttenuation;
	float linearAttenuation;
	float quadraticAttenuation;
} LightSource[1] = { { glm::vec4(1.0, 1.0, 1.0, 1.0),
					   glm::vec4(1.0, 1.0, 1.0, 1.0),
					   glm::vec4(1.0, 1.0, 1.0, 1.0),
					   glm::vec4(10, 10, 10, 1.0),
					   glm::vec3(0.0, 0.0, 1.0),
								 1.0,       // l'exposant du cône
								 180.0,     // l'angle du cône du spot
								 1., 0., 0. } };

// définition du matériau
struct MaterialParameters
{
	glm::vec4 emission;
	glm::vec4 ambient;
	glm::vec4 diffuse;
	glm::vec4 specular;
	float shininess;
} FrontMaterial = { glm::vec4(0.0, 0.0, 0.0, 1.0),
					glm::vec4(0.2, 0.2, 0.2, 1.0),
					glm::vec4(1.0, 1.0, 1.0, 1.0),
					glm::vec4(1.0, 1.0, 1.0, 1.0),
					          20.0 };

struct LightModelParameters
{
	glm::vec4 ambient; // couleur ambiante
	int localViewer;   // doit-on prendre en compte la position de l'observateur? (local ou à l'infini)
	int twoSide;       // éclairage sur les deux côtés ou un seul?
} LightModel = { glm::vec4(0,0,0,1), false, false };

// diverses variables d'état
struct Etat {
	bool afficheAxes;     // indique si on affiche les axes
	bool culling;         // indique si on veut ne pas afficher les faces arrières
	GLenum modePolygone;  // comment afficher les polygones (GL_LINE ou GL_FILL)
	double dimBoite;      // la dimension de la boite
} etat = { false, false, GL_FILL, 9.0 };

// variables pour définir le point de vue
const GLdouble thetaInit = 0., phiInit = 80., distInit = 40.;
class Camera
{
public:
	void definir()
	{
		matrVisu.LookAt(dist*cos(glm::radians(theta))*sin(glm::radians(phi)),
			dist*sin(glm::radians(theta))*sin(glm::radians(phi)),
			dist*cos(glm::radians(phi)) + 5., // <= prennez note du +5
			0., 0., 5.,  // <= prenez note du 5
			0., 0., 1.);

	}

	void verifierAngles() // vérifier que les angles ne débordent pas les valeurs permises
	{
		const GLdouble MINPHI = 0.01, MAXPHI = 180.0 - 0.01;
		if (phi > MAXPHI) phi = MAXPHI; else if (phi < MINPHI) phi = MINPHI;
		if (theta > 360.0) theta -= 360.0; else if (theta < 0.0) theta += 360.0;
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
		const GLchar *chainesSommets[2] = { "#version 410\n#define NUANCEUR_SOMMETS\n", ProgNuanceur::lireNuanceur("nuanceurs.glsl") };
		if (chainesSommets[1] != NULL)
		{
			GLuint nuanceurObj = glCreateShader(GL_VERTEX_SHADER);
			glShaderSource(nuanceurObj, 2, chainesSommets, NULL);
			glCompileShader(nuanceurObj);
			glAttachShader(progBase, nuanceurObj);
			ProgNuanceur::afficherLogCompile(nuanceurObj);
			delete[] chainesSommets[1];
		}
		// attacher le nuanceur de fragments
		const GLchar *chainesFragments[2] = { "#version 410\n#define NUANCEUR_FRAGMENTS\n", ProgNuanceur::lireNuanceur("nuanceurs.glsl") };
		if (chainesFragments[1] != NULL)
		{
			GLuint nuanceurObj = glCreateShader(GL_FRAGMENT_SHADER);
			glShaderSource(nuanceurObj, 2, chainesFragments, NULL);
			glCompileShader(nuanceurObj);
			glAttachShader(progBase, nuanceurObj);
			ProgNuanceur::afficherLogCompile(nuanceurObj);
			delete[] chainesFragments[1];
		}

		// faire l'édition des liens du programme
		glLinkProgram(progBase);
		ProgNuanceur::afficherLogLink(progBase);

		// demander la "Location" des variables
		if ((locVertex = glGetAttribLocation(progBase, "Vertex")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de Vertex" << std::endl;
		if ((locNormal = glGetAttribLocation(progBase, "Normal")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de Normal (partie 1)" << std::endl;
		if ((locColor = glGetAttribLocation(progBase, "Color")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de Color" << std::endl;
		if ((locmatrModel = glGetUniformLocation(progBase, "matrModel")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de matrModel" << std::endl;
		if ((locmatrVisu = glGetUniformLocation(progBase, "matrVisu")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de matrVisu" << std::endl;
		if ((locmatrProj = glGetUniformLocation(progBase, "matrProj")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de matrProj" << std::endl;
		if ((locmatrNormale = glGetUniformLocation(progBase, "matrNormale")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de matrNormale (partie 1)" << std::endl;
		if ((locplanCoupe = glGetUniformLocation(progBase, "planCoupe")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de planCoupe" << std::endl;
		if ((indLightSource = glGetUniformBlockIndex(progBase, "LightSourceParameters")) == GL_INVALID_INDEX) std::cerr << "!!! pas trouvé l'\"index\" de LightSource" << std::endl;
		if ((indFrontMaterial = glGetUniformBlockIndex(progBase, "MaterialParameters")) == GL_INVALID_INDEX) std::cerr << "!!! pas trouvé l'\"index\" de FrontMaterial" << std::endl;
		if ((indLightModel = glGetUniformBlockIndex(progBase, "LightModelParameters")) == GL_INVALID_INDEX) std::cerr << "!!! pas trouvé l'\"index\" de LightModel" << std::endl;

		// charger les ubo
		{
			glBindBuffer(GL_UNIFORM_BUFFER, ubo[0]);
			glBufferData(GL_UNIFORM_BUFFER, sizeof(LightSource), &LightSource, GL_DYNAMIC_COPY);
			glBindBuffer(GL_UNIFORM_BUFFER, 0);
			const GLuint bindingIndex = 0;
			glBindBufferBase(GL_UNIFORM_BUFFER, bindingIndex, ubo[0]);
			glUniformBlockBinding(progBase, indLightSource, bindingIndex);
		}
		{
			glBindBuffer(GL_UNIFORM_BUFFER, ubo[1]);
			glBufferData(GL_UNIFORM_BUFFER, sizeof(FrontMaterial), &FrontMaterial, GL_DYNAMIC_COPY);
			glBindBuffer(GL_UNIFORM_BUFFER, 0);
			const GLuint bindingIndex = 1;
			glBindBufferBase(GL_UNIFORM_BUFFER, bindingIndex, ubo[1]);
			glUniformBlockBinding(progBase, indFrontMaterial, bindingIndex);
		}
		{
			glBindBuffer(GL_UNIFORM_BUFFER, ubo[2]);
			glBufferData(GL_UNIFORM_BUFFER, sizeof(LightModel), &LightModel, GL_DYNAMIC_COPY);
			glBindBuffer(GL_UNIFORM_BUFFER, 0);
			const GLuint bindingIndex = 2;
			glBindBufferBase(GL_UNIFORM_BUFFER, bindingIndex, ubo[2]);
			glUniformBlockBinding(progBase, indLightModel, bindingIndex);
		}
	}
}

void FenetreTP::initialiser()
{
	// donner la couleur de fond
	glClearColor(0.2, 0.21, 0.26, 1.0);
	// allouer les UBO pour les variables uniformes
	glGenBuffers(3, ubo);
	// activer les etats openGL
	glEnable(GL_DEPTH_TEST);
	glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
	glEnable(GL_BLEND);
	// charger les nuanceurs
	chargerNuanceurs();

	// créer quelques autres formes
	glUseProgram(progBase);
}

void FenetreTP::conclure()
{
	glDeleteBuffers(3, ubo);
	delete shapes;
}

// affiche la position courante du repère (pour débogage)
void afficherRepereCourant(int num = 0)
{
	glUniformMatrix4fv(locmatrModel, 1, GL_FALSE, matrModel);
	FenetreTP::afficherAxes(1.5, 3.0);
}

void FenetreTP::afficherScene()
{
	// effacer l'ecran et le tampon de profondeur
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

	glUseProgram(progBase);

	// définir le pipeline graphique
	matrProj.Perspective(20.0, (GLdouble)largeur_ / (GLdouble)hauteur_, 0.1, 100.0);
	glUniformMatrix4fv(locmatrProj, 1, GL_FALSE, matrProj); // informer la carte graphique des changements faits à la matrice

	camera.definir();
	glUniformMatrix4fv(locmatrVisu, 1, GL_FALSE, matrVisu); // informer la carte graphique des changements faits à la matrice

	matrModel.LoadIdentity();
	glUniformMatrix4fv(locmatrModel, 1, GL_FALSE, matrModel); // informer la carte graphique des changements faits à la matrice

	glUniformMatrix3fv(locmatrNormale, 1, GL_TRUE, glm::value_ptr(glm::inverse(glm::mat3(matrVisu.getMatr() * matrModel.getMatr()))));

															  // afficher les axes
	if (etat.afficheAxes) FenetreTP::afficherAxes();

	// mettre à jour les blocs de variables uniformes
	{
		glBindBuffer(GL_UNIFORM_BUFFER, ubo[0]);
		GLvoid *p = glMapBuffer(GL_UNIFORM_BUFFER, GL_WRITE_ONLY);
		memcpy(p, &LightSource, sizeof(LightSource));
		glUnmapBuffer(GL_UNIFORM_BUFFER);
	}
	{
		glBindBuffer(GL_UNIFORM_BUFFER, ubo[1]);
		GLvoid *p = glMapBuffer(GL_UNIFORM_BUFFER, GL_WRITE_ONLY);
		memcpy(p, &FrontMaterial, sizeof(FrontMaterial));
		glUnmapBuffer(GL_UNIFORM_BUFFER);
	}
	{
		glBindBuffer(GL_UNIFORM_BUFFER, ubo[2]);
		GLvoid *p = glMapBuffer(GL_UNIFORM_BUFFER, GL_WRITE_ONLY);
		memcpy(p, &LightModel, sizeof(LightModel));
		glUnmapBuffer(GL_UNIFORM_BUFFER);
	}

	// Mode plein ou en fil
	glPolygonMode(GL_FRONT_AND_BACK, etat.modePolygone);
	if (etat.culling) glEnable(GL_CULL_FACE); else glDisable(GL_CULL_FACE);


	for (auto &shape : shapes->getShapes()) // access by reference to avoid copying
	{
		if (shape->appear)
		{
			glVertexAttrib4f(locColor, shape->baseColor_.r, shape->baseColor_.b, shape->baseColor_.g, shape->baseColor_.a);
			matrModel.PushMatrix(); {
				matrModel.Translate(shape->coords_);
				matrModel.Scale(shape->scale_);
				matrModel.Rotate(shape->rotation_, shape->rotationAxis_);
				glUniformMatrix4fv(locmatrModel, 1, GL_FALSE, matrModel);
				glUniformMatrix3fv(locmatrNormale, 1, GL_TRUE, glm::value_ptr(glm::inverse(glm::mat3(matrVisu.getMatr() * matrModel.getMatr()))));
				shape->Draw();
			}matrModel.PopMatrix();
		}
	}
	
}

void FenetreTP::redimensionner(GLsizei w, GLsizei h)
{
	glViewport(0, 0, w, h);
}

void FenetreTP::clavier(TP_touche touche)
{
	switch (touche)
	{
	case TP_ECHAP:
	case TP_q: // Quitter l'application
		quit();
		break;
	case TP_x: // Activer/désactiver l'affichage des axes
		etat.afficheAxes = !etat.afficheAxes;
		std::cout << "// Affichage des axes ? " << (etat.afficheAxes ? "OUI" : "NON") << std::endl;
		break;
	case TP_i: // Réinitiliaser le point de vue
		camera.phi = phiInit; camera.theta = thetaInit; camera.dist = distInit;
		break;
	case TP_g: // Permuter l'affichage en fil de fer ou plein
		etat.modePolygone = (etat.modePolygone == GL_FILL) ? GL_LINE : GL_FILL;
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
		if (camera.dist > 1.0) camera.dist -= 0.1;
		break;
	case TP_b: // Modifier
		shapes->modify();
		break;
	case TP_h: // Décrémenter la dimension de la boite
		etat.dimBoite -= 0.05;
		if (etat.dimBoite < 1.0) etat.dimBoite = 1.0;
		std::cout << " etat.dimBoite=" << etat.dimBoite << std::endl;
		break;
	default:
		std::cout << " touche inconnue : " << (char)touche << std::endl;
		imprimerTouches();
		break;
	}
}

glm::ivec2 sourisPosPrec(0, 0);
static bool pressed = false;
void FenetreTP::sourisClic(int button, int state, int x, int y)
{
	// button est un parmi { TP_BOUTON_GAUCHE, TP_BOUTON_MILIEU, TP_BOUTON_DROIT }
	// state  est un parmi { TP_PRESSE, DL_RELEASED }
	pressed = (state == TP_PRESSE);
	switch (button)
	{
	case TP_BOUTON_GAUCHE: // Déplacer (modifier angles) la caméra
		sourisPosPrec.x = x;
		sourisPosPrec.y = y;
		break;
	}
}

void FenetreTP::sourisMolette(int x, int y)
{
	const int sens = +1;
	camera.dist -= 0.2 * sens*y;
	if (camera.dist < 15.0) camera.dist = 15.0;
	else if (camera.dist > 70.0) camera.dist = 70.0;
}

void FenetreTP::sourisMouvement(int x, int y)
{
	if (pressed)
	{
		int dx = x - sourisPosPrec.x;
		int dy = y - sourisPosPrec.y;
		camera.theta -= dx / 3.0;
		camera.phi -= dy / 3.0;
		sourisPosPrec.x = x;
		sourisPosPrec.y = y;

		camera.verifierAngles();
	}
}
void screenshot() {
	GLubyte couleur[3];
	Image image(DEFAULT_24BIT_BMP_HEADER.biWidth, DEFAULT_24BIT_BMP_HEADER.biHeight);
	for (int x = 0; x < DEFAULT_24BIT_BMP_HEADER.biWidth; x++)
	{
		for (int y = 0; y < DEFAULT_24BIT_BMP_HEADER.biHeight; y++)
		{
			glReadPixels(x+100, y, 1, 1, GL_RGB, GL_UNSIGNED_BYTE, couleur);
			Pixel pixel(couleur[0], couleur[1], couleur[2]);
			image.setPixel(x, y, pixel);
		}
	}
	ImageHeader header(DEFAULT_24BIT_BMP_HEADER);
	header.biClrUsed = (uint32_t)image.colorsUsed.size();
	ofstream bmpOutputFile;
	bmpOutputFile.open("Side1Org.bmp", ios::out | ios::binary);
	bmpOutputFile << DEFAULT_24BIT_BMP_HEADER;
	bmpOutputFile << image;
	bmpOutputFile.close();
}
int main(int argc, char *argv[])
{
	// créer une fenêtre
	FenetreTP fenetre("LOG2990");

	// allouer des ressources et définir le contexte OpenGL
	fenetre.initialiser();
	srand(time(0));
	std::cout << time(0);
	shapes = new ShapesContainer(50, etat.dimBoite);
	
	bool boucler = true;
	while (boucler)
	{

		// affichage
		fenetre.afficherScene();
		fenetre.swap();

		// récupérer les événements et appeler la fonction de rappel
		boucler = fenetre.gererEvenement();
	}
	screenshot();
	// détruire les ressources OpenGL allouées
	fenetre.conclure();

	return 0;
}
