#include "Robot.h"
#include "Shape.h"

Robot::Robot(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale) :CompositeShape(coords, rotationAxis, rotation, scale) {

	glm::vec4 colorBody = glm::vec4(0.4, 0.4, 0.4, 1);
	glm::vec4 colorHead = glm::vec4(1.0, 0.5, 0.0, 0.0);
	glm::vec3 deformationLeg = glm::vec3(.4, .4, 1.2);
	glm::vec3 deformationBody = glm::vec3(1., 2., 1.);
	//glm::vec3 deformationArm = glm::vec3(.5, 0.6, 0.6);
	glm::vec3 deformationH = glm::vec3(0.6, 0.6, 0.6);
	glm::vec4 colorCyl = glm::vec4(0.0, 0.4, 0.3, 1);

	glm::vec3 axisRotation = glm::vec3(1.0, 0.0, 0.0);
	GLfloat rotate = 90;

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
}
	Robot::~Robot() {}