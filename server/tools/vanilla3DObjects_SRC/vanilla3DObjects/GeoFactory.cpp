#include "GeoFactory.h"
#include "Shape.h"

GeoFactory::GeoFactory(const int &numberOfObject): AbstractFactory(numberOfObject) { }

void GeoFactory::generateShapes(std::vector<AbstractShape*> * objects)
{
    calculateScalingFactor();
    for (int i = 0; i < this->numberOfObject_; i++)
    {
		generateShape(objects);
    }
}

void GeoFactory::generateShape(std::vector<AbstractShape*> * objects)
{
	Shapelist type = Shapelist(rand() % Shapelist::ConeTronque + 1);
	glm::vec4 color(generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1), 1);

	glm::vec3 translate(0, 0, 0);
	generateCoordinates(translate, objects);
	glm::vec3 rotate(generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1));

	GLfloat scale = generateFloat(MIN_SIZE_MODIFIER * scalingFactor_, MAX_SIZE_MODIFIER * scalingFactor_);
	Shape *newShape = new Shape(type, color, translate, rotate, generateFloat(0, 360),  scale);
    if (modMode_) { newShape->setModified(); };

	objects->push_back(newShape);
}

bool GeoFactory::checkForCollision(const glm::vec3 & coords, std::vector<AbstractShape*> * objects) const {
    double distance = 0;
    for (AbstractShape* shape : *objects) {
        distance =
            pow(shape->getCoordinates().x - coords.x, 2) +
            pow(shape->getCoordinates().y - coords.y, 2) +
            pow(shape->getCoordinates().z - coords.z, 2);

        if (distance < MIN_DISTANCE * scalingFactor_) { return true; }
    }
    return false;
}
