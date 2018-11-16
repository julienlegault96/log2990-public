#pragma once
#ifndef NAVETTE_H
#define NAVETTE_H
#include "CompositeShape.h"
class Navette :
	public CompositeShape
{
public:
	Navette(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
	~Navette();
};

#endif
