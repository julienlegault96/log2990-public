#pragma once

#include "Shape.h"
enum ShapeThemelist {Earth, Mars, Moon, Sun, Neptune, Saturn };
class  Planet : public Shape
{
public:
	Planet(ShapeThemelist type, glm::vec3 coords, glm::vec4 color, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale);
	void initPlanet(ShapeThemelist type, glm::vec3 coords, glm::vec4 color, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale);		
	~Planet();		
	// void changeTexture(GLuint texture);
	// GLuint texture_;
};

Planet::Planet(ShapeThemelist type, glm::vec3 coords, glm::vec4 color, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale)
{
	initPlanet(type, coords, color, rotation, rotationAxis, scale);
}



void Planet::initPlanet(ShapeThemelist type, glm::vec3 coords, glm::vec4 color, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale)
 {
	this->coords_ = coords;
	// this->texture_ = texture;
    this->baseColor_ = color;
	this->rotation_ = rotation;
	this->rotationAxis_ = rotationAxis;
	this->scale_ = scale;
	switch (type)
	{
	case(Earth):
		forme = new FormeSphere(0.5, 8, 8, true);
		break;

	case(Mars):
		forme = new FormeSphere(0.3, 8, 8, true);
		break;

	case(Moon):
		forme = new FormeSphere(0.25, 8, 8, true);
		break;

	case(Sun):
		forme = new FormeSphere(0.75, 8, 8, true);
		break;

	case(Neptune):
		forme = new FormeSphere(0.65, 8, 8, true);
		// new forme 1 ....
		break;

	case(Saturn):
		// forme = new FormeSphere(0.65, 8, 8, true);
		// new forme 1 ....
		break;
	}
	
}
/*
void Planet::changeTexture(GLuint texture) 
{
	this->texture_ = texture;
	this->modified_ = true;
}
*/

Planet::~Planet()
{
	delete forme;
}