#pragma once
#include "inf2705-forme.h"
#include <GL/glew.h>
enum Shapelist {Sphere, Cone, Cube, Tetrahedre, Cylindre };
class  Shape
{
public:
	Shape(Shapelist type, glm::vec3 coords, glm::vec4 baseColor, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale);
	Shape();
    void init(Shapelist type, glm::vec3 coords, glm::vec4 baseColor, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale);
	glm::vec3 coords_;
	glm::vec4 baseColor_;
	GLfloat rotation_;
	glm::vec3 rotationAxis_;
	GLfloat scale_;
	
	bool modified_ = false;
	bool appear = true;
	void Draw();
	~Shape();
	void ChangeColor(glm::vec4 baseColor);
	void disappear();
	

protected:
	
	FormeBase2705 *forme;

};

void Shape::Draw()
{
	forme->afficher();
}

Shape::Shape()
{}

Shape::Shape(Shapelist type, glm::vec3 coords, glm::vec4 baseColor, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale)
{
	init(type, coords, baseColor, rotation, rotationAxis, scale);
}

void Shape::init(Shapelist type, glm::vec3 coords, glm::vec4 baseColor, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale)
 {
	this->coords_ = coords;
	this->baseColor_ = baseColor;
	this->rotation_ = rotation;
	this->rotationAxis_ = rotationAxis;
	this->scale_ = scale;
	switch (type)
	{
	case(Sphere):
		forme = new FormeSphere(0.5, 8, 8, true);
		break;

	case(Cone):
		forme = new FormeCylindre(0.5, 0.0, 0.8, 10, 1, true);
		break;

	case(Cube):
		forme = new FormeCube(0.75, true);
		break;

	case(Cylindre):
		forme = new FormeCylindre(0.4, 0.4, 0.6, 10, 1, true);
		break;

	case(Tetrahedre):
		forme = new FormeTetraedre(1.0, true);
		break;
	}
}

void Shape::ChangeColor(glm::vec4 baseColor) 
{
	this->baseColor_ = baseColor;
	this->modified_ = true;
}

void Shape::hide()
{
	this->appear = false;
	this->modified_ = true;
}

Shape::~Shape()
{
	delete forme;
}