#include "AbstractShape.h"

AbstractShape::AbstractShape(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
    : coords_(coords), rotation_(rotation), rotationAxis_(rotationAxis), scale_(glm::vec3(scale)) { }

AbstractShape::AbstractShape(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, glm::vec3 deformation)
    : coords_(coords), rotation_(rotation), rotationAxis_(rotationAxis), scale_(deformation) { }

bool AbstractShape::isModded() const
{
    return modified_;
}

void AbstractShape::setModified()
{
    modified_ = true;
}

glm::vec3 AbstractShape::getCoordinates() const
{
	return coords_;
}
glm::vec3 AbstractShape::getRotationAxis() const
{
	return rotationAxis_;
}
GLfloat AbstractShape::getRotation() const
{
	return rotation_;
}

glm::vec3 AbstractShape::getScale() const
{
	return scale_;
}
void AbstractShape::hide()
{
    appear_ = false;
    setModified();
}

bool AbstractShape::isVisible() const
{
	return appear_;
}

void AbstractShape::setCoords(glm::vec3 coords)
{
	coords_ = coords;
}

void AbstractShape::setRotationAxis(glm::vec3 rotationAxis)
{
	rotationAxis_ = rotationAxis;
}

void AbstractShape::setRotation(GLfloat rotation)
{
	rotation_ = rotation;
}

void AbstractShape::setScale(GLfloat scale)
{
	scale_ = glm::vec3(scale);
}
