#pragma once
#include "CompositeShape.h"
class Satellite :
	public CompositeShape
{
public:
	Satellite(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale, glm::vec4 pannelColor, glm::vec4 bodyColor);
private:
	glm::vec4 pannelColor_;
	glm::vec4 bodyColor_;
};

