#pragma once
#ifndef MARS_H
#define MARS_H
#include "CompositeShape.h"
class Mars :
	public CompositeShape
{
public:
	Mars(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
	~Mars();
};

#endif