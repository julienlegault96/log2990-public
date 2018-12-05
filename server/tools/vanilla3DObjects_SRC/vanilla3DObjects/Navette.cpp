#include "Navette.h"
#include "Shape.h"

Navette::Navette(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale) 
	:CompositeShape(coords, rotationAxis, rotation, scale) {

	glm::vec4 colorBody = glm::vec4(0.9, 0.9, 0.9, 1);
	glm::vec4 colorHead = glm::vec4(0.2, 0.2, 0.2, 1);	
	glm::vec4 colorReactor = glm::vec4(0.2, 0.5, 0.2, 1);
	glm::vec3 deformationTetra = glm::vec3(.50, .01, .35);
	glm::vec3 deformationBody = glm::vec3(.35, .60, .35);


	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			colorBody,
			DEFAULT_COORDS,
			DEFAULT_ROTATION_AXIS,
			DEFAULT_ROTATION,
			deformationBody
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::ConeTronque,
			colorBody,
			glm::vec3(0, .23, 0),
			glm::vec3(1, 0, 0),
			270,
			0.30
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::ConeTronque,
			colorHead,
			glm::vec3(0, .35, 0),
			glm::vec3(1, 0, 0),
			270,
			0.15
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Tetrahedre,
			colorBody,
			glm::vec3(0.15, 0.0, 0),
			glm::vec3(1, 0, 0),
			270,
			deformationTetra
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Tetrahedre,
			colorBody,
			glm::vec3(0.0, 0, 0.20),
			glm::vec3(0, 0, 1),
			90,
			deformationTetra
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Tetrahedre,
			colorBody,
			glm::vec3(0.0, 0, -0.20),
			glm::vec3(0, 0, 1),
			90,
			-deformationTetra
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Cone,
			colorReactor,
			glm::vec3(0.0, -.35, 0.0),
			glm::vec3(1, 0, 0),
			270,
			DEFAULT_SCALE * 0.4
		)
	);
}
Navette::~Navette() {}