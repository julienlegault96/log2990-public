#include "Planet.h"

Planet::Planet(ShapeThemelist type, glm::vec3 coords, glm::vec4 color, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale) : CompositeShape(coords, rotationAxis, rotation, scale)
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
		this->shapes_.push_back(new Shape(Shapelist::Sphere, this->baseColor_, this->coords_, this->rotationAxis_, this->rotation_, this->scale_*0.5));
		break;

	case(Mars):
		this->shapes_.push_back(new Shape(Shapelist::Sphere, this->baseColor_, this->coords_, this->rotationAxis_, this->rotation_, this->scale_*0.3));
		break;

	case(Moon):
		this->shapes_.push_back(new Shape(Shapelist::Sphere, this->baseColor_, this->coords_, this->rotationAxis_, this->rotation_, this->scale_*0.25));
		break;

	case(Sun):
		this->shapes_.push_back(new Shape(Shapelist::Sphere, this->baseColor_, this->coords_, this->rotationAxis_, this->rotation_, this->scale_*0.75));
		break;

	case(Neptune):
		this->shapes_.push_back(new Shape(Shapelist::Sphere, this->baseColor_, this->coords_, this->rotationAxis_, this->rotation_, this->scale_*0.65));
		break;

	case(Saturn):
		this->shapes_.push_back(new Shape(Shapelist::Sphere, this->baseColor_, this->coords_, this->rotationAxis_, this->rotation_, this->scale_*0.5));
		this->shapes_.push_back(new Shape(Shapelist::Tore, this->baseColor_, this->coords_, this->rotationAxis_, this->rotation_, this->scale_));
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
}