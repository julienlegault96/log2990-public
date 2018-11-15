#include "TeslaCar.h"
#include "Shape.h"

TeslaCar::TeslaCar(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale) :CompositeShape(coords, rotationAxis, rotation, scale) {

glm::vec4 colorSph = glm::vec4(0.6, 0.5, 0.4, 1);
glm::vec4 colorH = glm::vec4(0.2, 0.2, 0.2, 0.7);
glm::vec3 deformationCyl = glm::vec3(0.4, 1.2, 0.4);
glm::vec3 deformationSph = glm::vec3(1.0, 0.5, 0.5);
glm::vec3 deformationH = glm::vec3(1.0, 1.0, 1.0);
glm::vec4 colorCyl = glm::vec4(0.0, 0.4, 0.3, 1);

glm::vec3 axisRotation = glm::vec3(1.0, 0.0, 0.0);
GLfloat rotate = 90;

shapes_.push_back(
	new Shape(
		Shapelist::Sphere,
		colorSph,
		coords_,
		rotationAxis_,
		rotation_,
		scale_ * (GLfloat) 1.2,
		deformationSph
	)
);

shapes_.push_back(
	new Shape(
		Shapelist::Sphere,
		colorH,
		coords_ + glm::vec3(scale_ * (GLfloat) 0.1, 0.0, scale_ * (GLfloat) 0.15),
		rotationAxis_,
		rotation_ ,
		scale_ * (GLfloat) 0.6,
		deformationH
	)
);

shapes_.push_back(
	new Shape(
		Shapelist::Cylindre,
		colorCyl,
		coords_ + glm::vec3(scale_ * (GLfloat) 0.3, scale_ * (GLfloat) 0.35, scale_ * (GLfloat) -0.1),
		axisRotation,
		rotate,
		scale_ * (GLfloat) 1.0,
		deformationCyl
	)
);

shapes_.push_back(
	new Shape(
		Shapelist::Cylindre,
		colorCyl,
		coords_ - glm::vec3(scale_ * (GLfloat) 0.3, scale_ * (GLfloat) -0.35, scale_ * (GLfloat)0.1),
		axisRotation,
		rotate,
		scale_ * (GLfloat) 1.0,
		deformationCyl
	)
);

}

TeslaCar::~TeslaCar() {

}