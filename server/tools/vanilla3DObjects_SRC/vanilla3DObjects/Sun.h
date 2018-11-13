#ifndef SUN_H
#define SUN_H

#include "CompositeShape.h"
class Sunny :
	public CompositeShape
{
public:
	Sunny(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
	~Sunny();
};
#endif