#include "Mars.h"
#include "Shape.h"

Mars::Mars(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale): CompositeShape(coords, rotationAxis, rotation, scale) {

	glm::vec4 color = glm::vec4(1.0, 0.2, 0.5, 1);

	shapes_.push_back(
		new Shape(
			Shapelist::Sphere,
			color,
			glm::vec3(4.9, 0.0, 0.0),
			DEFAULT_ROTATION_AXIS,
			DEFAULT_ROTATION,
			DEFAULT_SCALE
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Tore,
			color,
			DEFAULT_COORDS,
            DEFAULT_ROTATION_AXIS,
            DEFAULT_ROTATION,
            DEFAULT_SCALE
		)
	);

}

Mars::~Mars() {

}