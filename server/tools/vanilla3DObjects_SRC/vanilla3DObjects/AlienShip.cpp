#include "AlienShip.h"
#include "Shape.h"

AlienShip::AlienShip(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
	:CompositeShape(coords, rotationAxis, rotation, scale)
{
	shapes_.push_back(
		new Shape(
			Shapelist::Tetrahedre,
			glm::vec4(0.0, 0.0, 1.0, 1.0),
			glm::vec3(0, 0, 0),
			rotationAxis_,
			(GLfloat)0,
			(GLfloat) 0.5
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			glm::vec4(0.1, 0.1, 0.1, 1.0),
			glm::vec3(0., .2, -0.3),
			glm::vec3(0.5, -0.3, 0.),
			(GLfloat)-45,
			(GLfloat) 0.8,
			glm::vec3(0.5, 0.5, 0.05)
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			glm::vec4(0.1, 0.1, 0.1, 1.0),
			glm::vec3(0., -.2, -0.3),
			glm::vec3(0.5, 0.3, 0.),
			(GLfloat)45,
			(GLfloat) 0.8,
			glm::vec3(0.5, 0.5, 0.05)
		)
	);


}