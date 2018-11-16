#pragma once
#ifndef RINGWORLD_H
#define RINGWORLD_H
#include "CompositeShape.h"
class Ringworld :
	public CompositeShape
{
public:
    Ringworld(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
};

#endif