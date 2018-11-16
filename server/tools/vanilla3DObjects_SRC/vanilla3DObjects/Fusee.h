#pragma once
#ifndef FUSEE_H
#define FUSEE_H
#include "CompositeShape.h"
class Fusee :
	public CompositeShape
{
public:
	Fusee(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
private:
    const glm::vec4 COLOR_BODY = glm::vec4(0.2, 0.2, 0.5, 1);
    const glm::vec4 COLOR_FIRE_EXHAUST = glm::vec4(0.5, 0.5, 0.2, 0.3);
    const glm::vec4 COLOR_REACTOR_CONE = glm::vec4(0.2, 0.5, 0.2, 1);
};


#endif