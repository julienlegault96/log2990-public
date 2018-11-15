#include "TeslaCar.h"
#include "Shape.h"

TeslaCar::TeslaCar(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale) :CompositeShape(coords, rotationAxis, rotation, scale) {

glm::vec4 colorCyl = glm::vec4(0.2, 0.2, 0.5, 1);
glm::vec4 colorConeH = glm::vec4(0.5, 0.5, 0.2, 1);
glm::vec4 colorConeB = glm::vec4(0.2, 0.5, 0.2, 1);
glm::vec4 colorConeD = glm::vec4(1, 0.5, 0.2, 1);
/*
shapes_.push_back(
	new Shape(
		Shapelist::Sphere,
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
		colorConeH,
		coords_ - glm::vec3(0.0, 0.0, scale_ * (GLfloat) 0.6),			//  + glm::vec3(0.0, 0.0, scale_ * (GLfloat) 0.6)
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
*/
shapes_.push_back(
	new Shape(
		Shapelist::Disque,
		colorConeD,
		coords_ - glm::vec3(0.0, 0.0, scale_ * (GLfloat) 0.6),
		rotationAxis_,
		rotation_,
		scale_ * (GLfloat) 1.0
	)
);
}

TeslaCar::~TeslaCar() {

}