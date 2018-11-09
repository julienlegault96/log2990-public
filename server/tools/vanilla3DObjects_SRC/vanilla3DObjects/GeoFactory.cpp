#include "GeoFactory.h"
#include "Shape.h"



GeoFactory::GeoFactory(const int &numberOfObject, const double& dimboite)
    :AbstractFactory(numberOfObject, dimboite) { }

void GeoFactory::generateShapes(std::vector<AbstractShape*> & objects)
{
	this->shippingContainer_ = objects;
	objects.clear();
    calculateScalingFactor();
    for (int i = 0; i < this->numberOfObject_; i++)
    {
		generateShape();
    }
}

AbstractShape* GeoFactory::generateShape()
{
	Shapelist type = Shapelist(rand() % Shapelist::Cylindre + 1);
	glm::vec4 color(generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1), 1);

	glm::vec3 translate(0, 0, 0);
	generateCoordinates(translate);
	glm::vec3 rotate(generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1));

	GLfloat scale = generateFloat(MIN_SIZE_MODIFIER * scalingFactor_, MAX_SIZE_MODIFIER * scalingFactor_);
	Shape *newShape = new Shape(type, color, translate, rotate, generateFloat(0, 360),  scale);
	return newShape;
}

bool GeoFactory::checkForCollision(const glm::vec3 & coords) {
    bool collision = false;
    double distance = 0;
    for (AbstractShape* shape : shippingContainer_) {
        distance =
            pow(shape->getCoordinates().x - coords.x, 2) +
            pow(shape->getCoordinates().y - coords.y, 2) +
            pow(shape->getCoordinates().z - coords.z, 2);

        collision = distance < MIN_DISTANCE * scalingFactor_;
        if (collision) { break; }
    }
    return collision;
}
