#include "EntreprisingSpaceship.h"
#include "Shape.h"


EntreprisingSpaceship::EntreprisingSpaceship(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale, glm::vec4 color) 
	: CompositeShape(coords, rotationAxis, rotation, scale)
{
	color_ = color;
	shapes_.push_back(
		new Shape(
			Shapelist::Sphere,
			color_,
			glm::vec3(0, 0, 0),
			rotationAxis_,
			(GLfloat)0,
			(GLfloat) 0.8,
			glm::vec3(1, 1, 0.5)
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Cylindre,
			color_,
			glm::vec3(0, 0, -0.2),
			glm::vec3(1,0,0),
			(GLfloat)90,
			(GLfloat) 0.3,
			glm::vec3(1, 1, 6)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cylindre,
			color_,
			glm::vec3(0.15, -0.7, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)90,
			(GLfloat) 0.3,
			glm::vec3(1, 1, 3)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cylindre,
			color_,
			glm::vec3(-0.15, -0.7, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)90,
			(GLfloat) 0.3,
			glm::vec3(1, 1, 3)
		)
	);
}


EntreprisingSpaceship::~EntreprisingSpaceship()
{
}
