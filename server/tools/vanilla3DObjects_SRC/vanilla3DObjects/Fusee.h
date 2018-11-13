#pragma once
#ifndef FUSEE_H
#define FUSEE_H
#include "CompositeShape.h"
class Fusee :
	public CompositeShape
{
public:
	Fusee(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
	~Fusee();
};


#endif