#include "FlyingSaucer.h"
#include "Shape.h"


FlyingSaucer::FlyingSaucer(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale, glm::vec4 hullColor, glm::vec4 glassColor)
	: CompositeShape(coords, rotationAxis, rotation, scale*0.8)
{
	hullColor_ = hullColor;
	glassColor_ = glassColor;
	shapes_.push_back(
		new Shape(
			Shapelist::Sphere,
			hullColor_,
			DEFAULT_COORDS,
			DEFAULT_ROTATION_AXIS,
			DEFAULT_ROTATION,
			glm::vec3(0.8, 0.8, 0.4)
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Sphere,
			glassColor_,
			glm::vec3(0, 0, 0.18),
			DEFAULT_ROTATION_AXIS,
			DEFAULT_ROTATION,
			(GLfloat) 0.3
		)
	);
}
