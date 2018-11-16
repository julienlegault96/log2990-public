#include "TeslaCar.h"
#include "Shape.h"

TeslaCar::TeslaCar(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale) :CompositeShape(coords, rotationAxis, rotation, scale) {

glm::vec4 colorSph = glm::vec4(0.6, 0.5, 0.4, 1);
glm::vec4 colorH = glm::vec4(0.2, 0.2, 0.2, 0.7);
glm::vec3 deformationCyl = glm::vec3(.4, .4, 1.2);
glm::vec3 deformationSph = glm::vec3(1.2, 0.6, 0.6);
glm::vec3 deformationH = glm::vec3(0.6, 0.6, 0.6);
glm::vec4 colorCyl = glm::vec4(0.0, 0.4, 0.3, 1);

glm::vec3 axisRotation = glm::vec3(1.0, 0.0, 0.0);
GLfloat rotate = 90;

shapes_.push_back(
	new Shape(
		Shapelist::Sphere,
		colorSph,
		DEFAULT_COORDS,
		DEFAULT_ROTATION_AXIS,
		DEFAULT_ROTATION,
		deformationSph
	)
);

shapes_.push_back(
	new Shape(
		Shapelist::Sphere,
		colorH,
		glm::vec3(0.1, 0.0, 0.15),
		DEFAULT_ROTATION_AXIS,
		DEFAULT_ROTATION,
		deformationH
	)
);

shapes_.push_back(
	new Shape(
		Shapelist::Cylindre,
		colorCyl,
		glm::vec3(-0.3,0.35,-0.2),
		glm::vec3(1.0, 0.0, 0.0),
		(GLfloat)90,
		deformationCyl
	)
);

shapes_.push_back(
	new Shape(
		Shapelist::Cylindre,
		colorCyl,
		glm::vec3(0.3, 0.35, -0.2),
		glm::vec3(1.0, 0.0, 0.0),
		(GLfloat)90,
		deformationCyl
	)
);

}

TeslaCar::~TeslaCar() {

}