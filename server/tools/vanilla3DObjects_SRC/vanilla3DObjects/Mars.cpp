#include "Mars.h"
#include "Shape.h"

Mars::Mars(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale): CompositeShape(coords, rotationAxis, rotation, scale) {

	glm::vec4 color = glm::vec4(1.0, 0.2, 0.5, 1);

	shapes_.push_back(
		new Shape(
			Shapelist::Sphere,
			color,
			coords_ + +glm::vec3(scale_ * (GLfloat)4.9, 0.0, 0.0),		// scale_ * (GLfloat) 5.0
			rotationAxis_,
			rotation_,
			scale_ * (GLfloat) 1.0
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Tore,
			color,
			coords_ ,
			rotationAxis_,
			rotation_,
			scale_ * (GLfloat) 1.0
		)
	);

}

Mars::~Mars() {

}