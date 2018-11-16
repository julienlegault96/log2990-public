#pragma once
#include <GL/glew.h>
#include <iostream>
class ObjectLoc
{
public: 
	ObjectLoc();

	void extractLoc(const GLuint & prog);
	GLint locVertex=-1;
	GLint locNormal=-1;
	GLint locColor=-1;
	GLint locmatrModel=-1;
	GLint locmatrVisu=-1;
	GLint locmatrProj=-1;
	GLint locmatrNormale=-1;
	GLint locplanCoupe=-1;
	GLuint indLightSource=-1;
	GLuint indFrontMaterial=-1;
	GLuint indLightModel=-1;

};