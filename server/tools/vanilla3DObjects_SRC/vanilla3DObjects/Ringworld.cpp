#include "Ringworld.h"
#include "Shape.h"

Ringworld::Ringworld(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
	: CompositeShape(coords, rotationAxis, rotation, scale*0.5) {
	shapes_.push_back(
		new Shape(
			Shapelist::Tore,
            GRIS_CLAIR_POUR_TEXTURES,
			DEFAULT_COORDS,
            DEFAULT_ROTATION_AXIS,
            DEFAULT_ROTATION,
            glm::vec3(0.2, 0.2, 0.1)
		)
	);

}