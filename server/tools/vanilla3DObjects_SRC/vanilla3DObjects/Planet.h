#ifndef PLANET_H
#define PLANET_H
#include "Shape.h"
#include "CompositeShape.h"

enum ShapeThemelist {Earth, Mars, Moon, Sun, Neptune, Saturn };
class  Planet : public CompositeShape
{
public:
	Planet(ShapeThemelist type, glm::vec3 coords, glm::vec4 color, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale);
private:
	glm::vec4 baseColor_;
	void initPlanet(ShapeThemelist type, glm::vec3 coords, glm::vec4 color, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale);		
	~Planet();	
	// void changeTexture(GLuint texture);
	// GLuint texture_;
};

#endif