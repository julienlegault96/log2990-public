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
			rotationAxis_,
			(GLfloat)0,
			(GLfloat) 0.6,
			glm::vec3(1, 1, 1.3)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cylindre,
			bodyColor_,
			glm::vec3(-1, 0, 0),
			glm::vec3(0, 1, 0),
			(GLfloat)90,
			(GLfloat) 0.6,
			glm::vec3(0.1, 0.1, 5.3)
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			pannelColor_,
			glm::vec3(-0.5, 0, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)50,
			(GLfloat) 0.8,
			glm::vec3(0.3, 2, 0.1)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			pannelColor_,
			glm::vec3(0.5, 0, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)50,
			(GLfloat) 0.8,
			glm::vec3(0.3, 2, 0.1)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			pannelColor_,
			glm::vec3(-0.75, 0, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)50,
			(GLfloat) 0.8,
			glm::vec3(0.3, 2, 0.1)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			pannelColor_,
			glm::vec3(0.75, 0, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)50,
			(GLfloat) 0.8,
			glm::vec3(0.3, 2, 0.1)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			pannelColor_,
			glm::vec3(-1, 0, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)50,
			(GLfloat) 0.8,
			glm::vec3(0.3, 2, 0.1)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			pannelColor_,
			glm::vec3(1, 0, 0),
			glm::vec3(1, 0, 0),
			(GLfloat)50,
			(GLfloat) 0.8,
			glm::vec3(0.3, 2, 0.1)
		)
	);
}


SpaceStation::~SpaceStation()
{
}
