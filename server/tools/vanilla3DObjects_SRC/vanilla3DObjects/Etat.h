#ifndef __ETAT_H__
#define __ETAT_H__

#include <GL/glew.h>
#include <glm/glm.hpp>
#include "Singleton.h"

//
// variables d'état
//
class Etat : public Singleton<Etat>
{
   SINGLETON_DECLARATION_CLASSE(Etat);
public:
  /*Etat(bool p_afficheAxe = false, bool p_culling = false, 
       GLenum p_modePolygone = GL_FILL, static GLuint p_maTextureEchiquier = 0, double p_dimBoite = 9.9) :      
       afficheAxes(p_afficheAxe),culling(p_culling), modePolygone(p_modePolygone), maTextureEchiquier(p_maTextureEchiquier), 
       dimBoite() {} */

  static bool afficheAxes;    // indique si on affiche les axes
  static bool culling;        // indique si on veut ne pas afficher les faces arrières
  static GLenum modePolygone; // comment afficher les polygones (GL_LINE ou GL_FILL)
  static GLuint maTextureEchiquier;
  static double dimBoite;      // la dimension de la boite
};

#endif
