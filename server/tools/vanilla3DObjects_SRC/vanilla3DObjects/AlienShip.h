#ifndef ALIEN_SHIP_H
#define AlIEN_SHIP_H

#include "CompositeShape.h"
class AlienShip :
	public CompositeShape
{
public:
	AlienShip(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
};

#endif
