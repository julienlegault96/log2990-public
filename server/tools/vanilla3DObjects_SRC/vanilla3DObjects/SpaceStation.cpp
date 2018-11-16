#include "SpaceStation.h"
#include "Shape.h"


SpaceStation::SpaceStation(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale, glm::vec4 pannelColor, glm::vec4 bodyColor)
	: CompositeShape(coords, rotationAxis, rotation, scale)
{
	bodyColor_ = bodyColor;
	pannelColor_ = pannelColor;
	shapes_.push_back(
		new Shape(
			Shapelist::Cylindre,
			bodyColor_,
			glm::vec3(0, 0, -0.2),
			DEFAULT_ROTATION_AXIS,
			DEFAULT_ROTATION,
			glm::vec3(0.6, 0.6, 0.78)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cylindre,
			bodyColor_,
			glm::vec3(-1, 0, 0),
			glm::vec3(0, 1, 0),
			(GLfloat)90,
			glm::vec3(0.06, 0.06, 3.18)
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			pannelColor_,
			glm::vec3(-0.5, 0, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)50,
			glm::vec3(0.24, 1.6, 0.08)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			pannelColor_,
			glm::vec3(0.5, 0, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)50,
			glm::vec3(0.24, 1.6, 0.08)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			pannelColor_,
			glm::vec3(-0.75, 0, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)50,
            glm::vec3(0.24, 1.6, 0.08)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			pannelColor_,
			glm::vec3(0.75, 0, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)50,
            glm::vec3(0.24, 1.6, 0.08)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			pannelColor_,
			glm::vec3(-1, 0, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)50,
            glm::vec3(0.24, 1.6, 0.08)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			pannelColor_,
			glm::vec3(1, 0, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)50,
            glm::vec3(0.24, 1.6, 0.08)
		)
	);
}
