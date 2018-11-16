#ifndef ASTEROIDE_H
#define ASTEROIDE_H

#include "CompositeShape.h"
class Asteroid :
    public CompositeShape
{
public:
    Asteroid(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
};

#endif