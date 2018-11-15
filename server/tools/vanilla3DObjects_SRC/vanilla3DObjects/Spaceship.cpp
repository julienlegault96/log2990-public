#include "Spaceship.h"
#include "Shape.h"

Spaceship::Spaceship(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
	: CompositeShape(coords, rotationAxis, rotation, scale)
{
	shapes_.push_back(
		new Shape(
			Shapelist::Theiere,
			glm::vec4(0.4, 0.4, 0.4, 1.0),
			glm::vec3(0, 0, 0),
			rotationAxis_,
			(GLfloat)0,
			(GLfloat) 0.1
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			glm::vec4(0.1, 0.1, 0.1, 1.0),
			glm::vec3(0., 0., 0.2),
			glm::vec3(1., 0., 0.),
			(GLfloat)5,
			(GLfloat) 0.8,
			glm::vec3(0.5, 1.0, 0.1)
		)
	);
}