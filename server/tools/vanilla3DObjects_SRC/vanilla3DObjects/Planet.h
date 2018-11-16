#ifndef PLANET_H
#define PLANET_H
#include "Shape.h"
#include "CompositeShape.h"


class  Planet : public CompositeShape
{
public:
	Planet(short randomseed, glm::vec3 coords, glm::vec4 color, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale);
private:
    enum ShapeThemelist { basicPlanet, ringPlanet, enumSize };
	void initPlanet(short type, glm::vec4 color);
};

#endif