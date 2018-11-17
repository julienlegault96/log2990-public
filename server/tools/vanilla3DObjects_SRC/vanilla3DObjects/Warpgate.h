
#ifndef WARPGATE_H
#define WARPGATE_H
#include "CompositeShape.h"
class Warpgate :
	public CompositeShape
{
public:
    Warpgate(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
};

#endif