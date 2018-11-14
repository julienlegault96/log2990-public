#ifndef SUN_H
#define SUN_H

#include "CompositeShape.h"
class Sunny :
	public CompositeShape
{
public:
	Sunny(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
    //colorscheme utilisé
    //https://www.schemecolor.com/rocket-fire-color-scheme.php
    const glm::vec4 FIRE_ENGINE_RED = glm::vec4(0.81, 0.125, 0, 0.7);
    const glm::vec4 DEEP_SAFFRON = glm::vec4(1, 0.6, 0, 0.7);
    const glm::vec4 YELLOW_ROSE = glm::vec4(1, 0.941, 0, 0.7);
    const glm::vec4 LEMON_YELLOW = glm::vec4(0.980, 1, 0.278, 0.7);
private:

};
#endif