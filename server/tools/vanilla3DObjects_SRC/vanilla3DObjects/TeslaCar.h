#pragma once
#ifndef TESLACAR_H
#define TESLACAR_H
#include "CompositeShape.h"
class TeslaCar :
	public CompositeShape
{
public:
	TeslaCar(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
	~TeslaCar();
};


#endif