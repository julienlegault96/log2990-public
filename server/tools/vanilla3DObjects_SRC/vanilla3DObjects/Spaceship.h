#ifndef SPACESHIP_H
#define SPACESHIP_H

#include "CompositeShape.h"
class Spaceship :
	public CompositeShape
{
public:
	Spaceship(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
};
#endif