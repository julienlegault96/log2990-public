#include "EntreprisingSpaceship.h"
#include "Shape.h"


EntreprisingSpaceship::EntreprisingSpaceship(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale, glm::vec4 color) 
	: CompositeShape(coords, rotationAxis, rotation, scale*0.5)
{
	color_ = color;
	shapes_.push_back(
		new Shape(
			Shapelist::Sphere,
			color_,
			DEFAULT_COORDS,
			DEFAULT_ROTATION_AXIS,
			DEFAULT_ROTATION,
			glm::vec3(0.8, 0.8, 0.4)
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Cylindre,
			color_,
			glm::vec3(0, 0, -0.2),
			glm::vec3(1,0,0),
			(GLfloat)90,
			glm::vec3(0.3, 0.3, 1.8)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cylindre,
			color_,
			glm::vec3(0.15, -0.7, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)90,
			glm::vec3(0.3, 0.3, 0.9)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cylindre,
			color_,
			glm::vec3(-0.15, -0.7, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)90,
			glm::vec3(0.3, 0.3, 0.9)
		)
	);
}
