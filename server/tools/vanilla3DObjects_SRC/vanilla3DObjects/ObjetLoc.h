#pragma once
class ObjetLoc
{
public: 
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
};