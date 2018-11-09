#pragma once
#include <GL/glew.h>
class ObjetLoc
{
public: 
	GLint locVertex;
	GLint locNormal;
	GLint locColor;
	GLint locmatrModel;
	GLint locmatrVisu;
	GLint locmatrProj;
	GLint locmatrNormale;
	GLint locplanCoupe;
	GLuint indLightSource;
	GLuint indFrontMaterial;
	GLuint indLightModel;
};