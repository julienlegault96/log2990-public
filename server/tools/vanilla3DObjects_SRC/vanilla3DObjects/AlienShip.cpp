#include "AlienShip.h"
#include "Shape.h"

AlienShip::AlienShip(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
	:CompositeShape(coords, rotationAxis, rotation, scale)
{
	shapes_.push_back(
		new Shape(
			Shapelist::Tetrahedre,
			GRIS_CLAIR_POUR_TEXTURES,
			coords_,
			rotationAxis_,
			rotation_,
			scale_ * (GLfloat) 0.5
		)
	);

}