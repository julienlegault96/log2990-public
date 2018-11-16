#pragma once
#include "CompositeShape.h"
class EntreprisingSpaceship :
	public CompositeShape
{
public:
	EntreprisingSpaceship(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale, glm::vec4 color);
private:
	glm::vec4 color_;
};

