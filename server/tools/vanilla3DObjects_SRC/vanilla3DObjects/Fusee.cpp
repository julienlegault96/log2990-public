#include "Fusee.h"
#include "Shape.h"

Fusee::Fusee(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
	:CompositeShape(coords, rotationAxis, rotation, scale)
{
	shapes_.push_back(
		new Shape(
			Shapelist::Cylindre,
			GRIS_CLAIR_POUR_TEXTURES,
			DEFAULT_COORDS,
			DEFAULT_ROTATION_AXIS,
            DEFAULT_ROTATION,
			DEFAULT_SCALE
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Cone,
			GRIS_CLAIR_POUR_TEXTURES,
            DEFAULT_COORDS,
            DEFAULT_ROTATION_AXIS,
            DEFAULT_ROTATION,
            DEFAULT_SCALE
		)
	);
}
