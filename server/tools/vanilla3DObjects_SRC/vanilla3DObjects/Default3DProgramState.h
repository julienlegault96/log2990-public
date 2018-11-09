#ifndef DEFAULT_3D_PROGRAM_STATE_H
#define DEFAULT_3D_PROGRAM_STATE_H

#include <GL/glew.h>
#include <glm/vec3.hpp>
#include <glm/vec4.hpp>
#include "Singleton.h"

//
// variables d'état
//

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
};

struct GeneralState {
    bool afficheAxes;     // indique si on affiche les axes
    bool culling;         // indique si on veut ne pas afficher les faces arrières
    GLenum modePolygone;  // comment afficher les polygones (GL_LINE ou GL_FILL);
    double dimBoite;      // la dimension de la boite
};

struct MaterialParameters
{
    glm::vec4 emission;
    glm::vec4 ambient;
    glm::vec4 diffuse;
    glm::vec4 specular;
    float shininess;
};

struct LightModelParameters
{
    glm::vec4 ambient; // couleur ambiante
    int localViewer;   // doit-on prendre en compte la position de l'observateur? (local ou à l'infini)
    int twoSide;       // éclairage sur les deux côtés ou un seul?
};

class Default3DProgramState : public Singleton<Default3DProgramState>
{
    SINGLETON_DECLARATION_CLASSE(Default3DProgramState);
    public:
        //State
        GeneralState state = { false, false, GL_FILL, 9.9 };
        // LightSourceParameters
        LightSourceParameters LightSource = { glm::vec4(1.0, 1.0, 1.0, 1.0),
                                                glm::vec4(1.0, 1.0, 1.0, 1.0),
                                                glm::vec4(1.0, 1.0, 1.0, 1.0),
                                                glm::vec4(10, 10, 10, 1.0),
                                                glm::vec3(0.0, 0.0, 1.0),
                                                1.0,       // l'exposant du cône
                                                180.0,     // l'angle du cône du spot
                                                1., 0., 0. 
                                            };

        MaterialParameters FrontMaterial = { glm::vec4(0.2, 0.2, 0.2, 1.0),
                                                glm::vec4(0.2, 0.2, 0.2, 1.0),
                                                glm::vec4(1.0, 1.0, 1.0, 1.0),
                                                glm::vec4(1.0, 1.0, 1.0, 1.0),
                                                20.0 
                                            };

        LightModelParameters LightModel = { glm::vec4(0,0,0,1), false, false };
};
#endif