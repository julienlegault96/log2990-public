#include "CompositeShape.h"
#include "Drawer.h"
CompositeShape::CompositeShape(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation,  GLfloat scale)
    : AbstractShape(coords, rotationAxis, rotation, scale) { }

std::vector<AbstractShape*> CompositeShape::getShapes() const
{
	return shapes_;
}

CompositeShape::~CompositeShape(){
    shapes_.clear();
}

void CompositeShape::accept(const Drawer  *visitor) const {
   visitor->draw(this);
}

void CompositeShape::setColor(glm::vec4 color) {
	for (AbstractShape* shape : this->getShapes())
	{
		shape->setColor(color);
	}
}

glm::vec4 CompositeShape::getColor() const {
	return glm::vec4(0.4, 0.4, 0.4, 1.0);
}
