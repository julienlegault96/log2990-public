#pragma once
#ifndef ROBOT_H
#define ROBOT_H
#include "CompositeShape.h"
class Robot :
	public CompositeShape
{
public:
	Robot(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
	~Robot();
};

#endif
