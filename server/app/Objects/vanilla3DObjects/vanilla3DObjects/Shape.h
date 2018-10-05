#pragma once
#include "inf2705-forme.h"
#include <GL/glew.h>
#include <glm\glm.hpp>;
enum Shapelist {Sphere, Cone, Cube, Tetrahedre, Cylindre };
class  Shape
{
public:
	Shape(Shapelist type, glm::vec3 coords, glm::vec3 baseColor, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale);
	glm::vec3 coords_;
	glm::vec3 baseColor_;
	GLfloat rotation_;
	glm::vec3 rotationAxis_;
	GLfloat scale_;
	  void Draw();
	~  Shape();
	

private:
	
	FormeBase2705 *forme;

};

void Shape::Draw() {
	forme->afficher();
}
Shape::Shape(Shapelist type, glm::vec3 coords, glm::vec3 baseColor, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale)
{
	this->coords_ = coords;
	this->baseColor_ = baseColor;
	this->rotation_ = rotation;
	this->rotationAxis_ = rotationAxis;
	this->scale_ = scale;
	switch (type)
	{
	case(Sphere):
		forme = new FormeSphere(1.0, 8, 8, true);
		break;

	case(Cone):
		forme = new FormeCylindre(1.0, 0.0, 1.5, 10, 1, true);
		break;

	case(Cube):
		forme = new FormeCube(1.0, true);
		break;
	
	case(Cylindre):
		forme = new FormeCylindre(1.0, 1.0, 3.0, 10, 1, true);
		break;

	case(Tetrahedre):
		forme = new FormeTetraedre(1.5, true);
		break;
}

	  
}

  Shape::~  Shape()
{
}