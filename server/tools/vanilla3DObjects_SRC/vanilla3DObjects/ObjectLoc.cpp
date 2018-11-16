#include "ObjectLoc.h"

ObjectLoc::ObjectLoc()
{
}

void ObjectLoc::extractLoc(const GLuint & prog)
{
	// demander la "Location" des variables
	if ((locVertex = glGetAttribLocation(prog, "Vertex")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de Vertex" << std::endl;
	if ((locNormal = glGetAttribLocation(prog, "Normal")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de Normal (partie 1)" << std::endl;
	if ((locColor = glGetAttribLocation(prog, "Color")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de Color" << std::endl;
	if ((locmatrModel = glGetUniformLocation(prog, "matrModel")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de matrModel" << std::endl;
	if ((locmatrVisu = glGetUniformLocation(prog, "matrVisu")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de matrVisu" << std::endl;
	if ((locmatrProj = glGetUniformLocation(prog, "matrProj")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de matrProj" << std::endl;
	if ((locmatrNormale = glGetUniformLocation(prog, "matrNormale")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de matrNormale (partie 1)" << std::endl;
	if ((locplanCoupe = glGetUniformLocation(prog, "planCoupe")) == -1) std::cerr << "!!! pas trouvé la \"Location\" de planCoupe" << std::endl;
	if ((indLightSource = glGetUniformBlockIndex(prog, "LightSourceParameters")) == GL_INVALID_INDEX) std::cerr << "!!! pas trouvé l'\"index\" de LightSource" << std::endl;
	if ((indFrontMaterial = glGetUniformBlockIndex(prog, "MaterialParameters")) == GL_INVALID_INDEX) std::cerr << "!!! pas trouvé l'\"index\" de etat->FrontMaterial" << std::endl;
	if ((indLightModel = glGetUniformBlockIndex(prog, "LightModelParameters")) == GL_INVALID_INDEX) std::cerr << "!!! pas trouvé l'\"index\" de LightModel" << std::endl;

}
