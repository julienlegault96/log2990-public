#include "Warpgate.h"
#include "Shape.h"

Warpgate::Warpgate(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
	: CompositeShape(coords, rotationAxis, rotation, scale*0.8) {
	shapes_.push_back(
		new Shape(
			Shapelist::Tore,
            GRIS_CLAIR_POUR_TEXTURES,
			DEFAULT_COORDS,
            DEFAULT_ROTATION_AXIS,
            DEFAULT_ROTATION,
            glm::vec3(0.2, 0.2, 0.3)
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Sphere,
			glm::vec4(0.0,0.8,0.0,0.8),
			glm::vec3(0,0,0),
			DEFAULT_ROTATION_AXIS,
			DEFAULT_ROTATION,
			1
		)
	);
	shapes_.push_back(
		new Shape(
			Shapelist::Tore,
			GRIS_CLAIR_POUR_TEXTURES,
			DEFAULT_COORDS,
			glm::vec3(1,0,0),
			30,
			glm::vec3(0.2, 0.2, 0.3)
		)
	);

}