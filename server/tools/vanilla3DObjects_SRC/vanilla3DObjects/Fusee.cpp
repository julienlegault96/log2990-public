#include "Fusee.h"
#include "Shape.h"

Fusee::Fusee(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
	:CompositeShape(coords, rotationAxis, rotation, scale)
{
	glm::vec4 colorCyl = glm::vec4(0.2, 0.2, 0.5, 1); 
	glm::vec4 colorConeH = glm::vec4(0.5, 0.5, 0.2, 1);
	glm::vec4 colorConeB = glm::vec4(0.2, 0.5, 0.2, 1);

	shapes_.push_back(
		new Shape(
			Shapelist::Cylindre,
			colorCyl,
			coords_,
			rotationAxis_,
			rotation_,
			scale_ * (GLfloat) 1.0
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Cylindre,
			colorCyl,
			coords_ + glm::vec3(0.0, 0.0, scale_ * (GLfloat) 0.6),
			rotationAxis_,
			rotation_,
			scale_ * (GLfloat) 1.0
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Cone,
			colorConeH,
			coords_ + glm::vec3(0.0, 0.0, 2.0*scale_ * (GLfloat) 0.6),							
			rotationAxis_,
			rotation_,
			scale_ * (GLfloat) 1.0
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Cone,
			colorConeB,
			coords_ + glm::vec3(0.0, 0.0, scale_ * (GLfloat) -0.12),
			rotationAxis_,
			rotation_,
			scale_ * (GLfloat) 1.2
		)
	);
}

Fusee::~Fusee()
{
}
