#include "FlyingSaucer.h"
#include "Shape.h"


FlyingSaucer::FlyingSaucer(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale, glm::vec4 hullColor, glm::vec4 glassColor)
	: CompositeShape(coords, rotationAxis, rotation, scale)
{
	hullColor_ = hullColor;
	glassColor_ = glassColor;
	shapes_.push_back(
		new Shape(
			Shapelist::Sphere,
			hullColor_,
			coords_,
			rotationAxis_,
			rotation_,
			scale_ * (GLfloat) 0.8,
			glm::vec3(1, 1, 0.5)
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Sphere,
			glassColor_,
			coords_ + glm::vec3(0,0, (scale_ * (GLfloat) 0.8)*0.6- (scale_ * (GLfloat) 0.3)),
			rotationAxis_ + glm::vec3(0.0, 0.0, 7),
			rotation_,
			scale_* (GLfloat) 0.3
		)
	);
}


FlyingSaucer::~FlyingSaucer()
{
}
