// vanilla3DObjects.cpp : Defines the entry point for the console application.
//

#pragma comment(lib,"opengl32.lib")
#include <math.h>
#include <time.h>
#include "inf2705-fenetre.h"
#include "Scene.h"



using namespace std;

std::string getAbsolutePath(const char * argv0)
{
	const char * PROGRAM_NAME = "genmulti";

	std::string absoluteRef(argv0);
    absoluteRef = absoluteRef.substr(0, absoluteRef.find(PROGRAM_NAME));

	return absoluteRef;
}

void help() 
{
	std::cout << "Usage de l'executable :" << std::endl
		<< "genmulti { geo | theme }   <quantite>	<modification>  <sortie>" << std::endl
		<< "Modifications possibles: " << std::endl
		<< "\t (a)-ajouter des objets a la scene initiale" << std::endl
		<< "\t (s)-supprimer des objets de la scene initiale" << std::endl
		<< "\t (c)-changer la couleur ou la texture d'objets de la scene initiale" << std::endl
		<< "par exemple genmulti geo 15 ac sortie" << std::endl
		<< "\t utilise des formes geometriques" << std::endl
		<< "\t la scene originales a 15 objets" << std::endl
		<< "\t les modifications autorisees sont ajouter et changer couleur" << std::endl
		<< "\t les fichiers de sortie vont commencer par sortie" << std::endl;
}

int main(int argc, char *argv[])
{
    const short EXPECTED_ARG_LENGTH = 5;
    if (argc != EXPECTED_ARG_LENGTH)
    { 
        help();
        return -1; 
    }

    //initialiser random
    srand(time(0));
    std::cout << "Generation begin: program seed is " << time(0);
	// créer une fenêtre
	Fenetre fenetre;
	// allouer des ressources et définir le contexte OpenGL
	const std::string absoluteRef = getAbsolutePath(argv[0]);
	fenetre.initialiser(absoluteRef, false, std::stoi(argv[2]), argv[3]);

    fenetre.genererMultivue((absoluteRef+ argv[4]).data());

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
