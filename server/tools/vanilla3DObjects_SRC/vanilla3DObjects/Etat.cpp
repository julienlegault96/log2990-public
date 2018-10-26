#include "Etat.h"

SINGLETON_DECLARATION_CPP(Etat);

/*bool Etat::enmouvement = false;
GLdouble Etat::rtri = 0.;
GLdouble Etat::rquad = 0.;
int Etat::choix = 0;
GLuint Etat::maTextureAVendre = 0, Etat::maTextureEchiquier = 0;
GLenum Etat::magFilter = GL_LINEAR, Etat::minFilter = GL_LINEAR;
*/

bool Etat::afficheAxes = false;
bool Etat::culling = false;
GLenum Etat::modePolygone = GL_FILL;
GLuint Etat::maTextureEchiquier = 0;
double Etat::dimBoite = 9.9;
