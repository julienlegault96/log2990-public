#include "AbstractShape.h"

AbstractShape::AbstractShape(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
    : coords_(coords), rotation_(rotation), rotationAxis_(rotationAxis), scale_(scale) { }

bool AbstractShape::isModded() const
{
    return modified_;
}

void AbstractShape::setModified()
{
    modified_ = true;
}

glm::vec3 AbstractShape::getCoordinates()
{
	return coords_;
}
void AbstractShape::hide()
{
    appear_ = false;
    setModified();
}

void AbstractShape::accept(Drawer & drawer)
{
}
