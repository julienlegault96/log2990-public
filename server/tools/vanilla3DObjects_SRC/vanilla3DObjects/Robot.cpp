#include "Robot.h"
#include "Shape.h"

Robot::Robot(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale) :CompositeShape(coords, rotationAxis, rotation, scale*0.5) {

	glm::vec4 colorBody = glm::vec4(0.4, 0.4, 0.4, 1);
	glm::vec4 colorHead = glm::vec4(1.0, 0., 0.0, 1.);
    glm::vec4 colorFire = glm::vec4(0.5, 0.5, 0.2, 0.3);
	glm::vec4 colorReactor = glm::vec4(0.2, 0.5, 0.2, 1);
	glm::vec3 deformationBody = glm::vec3(.50, .70, .35);
	glm::vec3 deformationArm = glm::vec3(.15, 0.4, 0.15);
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

	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			colorHead,
			glm::vec3(0,.3,0),
			DEFAULT_ROTATION_AXIS,
			DEFAULT_ROTATION,
			0.25
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			colorHead,
			glm::vec3(0.20, 0, 0),
			DEFAULT_ROTATION_AXIS,
			DEFAULT_ROTATION,
			deformationArm
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Cube,
			colorHead,
			glm::vec3(-0.20, 0, 0),
			DEFAULT_ROTATION_AXIS,
			DEFAULT_ROTATION,
			deformationArm
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

	shapes_.push_back(
		new Shape(
			Shapelist::ConeTronque,
			colorFire,
			glm::vec3(0.0, -0.35, 0.0),
			glm::vec3(1.0, 0.0, 0.0),
			90,
			glm::vec3(0.2, 0.2, 0.8)
		)
	);
}
	Robot::~Robot() {}