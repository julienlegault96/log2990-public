#pragma once
#include "CompositeShape.h"
class FlyingSaucer :
	public CompositeShape
{
public:
	FlyingSaucer(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale, glm::vec4 hullColor, glm::vec4 glassColor);
	~FlyingSaucer();
	glm::vec4 hullColor_;
	glm::vec4 glassColor_;
};

