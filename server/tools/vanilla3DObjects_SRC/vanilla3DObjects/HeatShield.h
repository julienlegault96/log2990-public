#ifndef HEAT_SHIELD_H
#define HEAT_SHIELD_H

#include "CompositeShape.h"
class Heatshield :
	public CompositeShape
{
public:
	Heatshield(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
};

#endif
