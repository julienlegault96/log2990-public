
#include "AbstractFactory.h"

AbstractFactory::AbstractFactory(const int & numberOfObject, const double& dimboite){

	this->numberOfObject_ = numberOfObject;
    calculateScalingFactor();
}

void AbstractFactory::generateShapes(std::vector<AbstractShape*>& objects)
{
}

AbstractShape * AbstractFactory::generateShape()
{
	return nullptr;
}


//fonction retournant un float aleatoire
//source : https://www.gamedev.net/forums/topic/41147-random-glfloat-value/
float AbstractFactory::generateFloat(const float& min, const float& max) const {
    float range = max - min;
    float num = range * rand() / RAND_MAX;
    return (num + min);
}

void AbstractFactory::generateCoordinates(glm::vec3 & coords) {
    do {
        coords.x = generateFloat(-*dimboite_ / 2, *dimboite_ / 2);
        coords.y = generateFloat(-*dimboite_ / 2, *dimboite_ / 2);
        coords.z = generateFloat(0, *dimboite_ - 1);
    } while (checkForCollision(coords));
}

void AbstractFactory::calculateScalingFactor() {
    scalingFactor_ = pow(*dimboite_, 3) / (ALLOCATED_SHAPE_VOLUME * this->numberOfObject_);
}

bool AbstractFactory::checkForCollision(const glm::vec3 & coords)
{
	return false;
}

void AbstractFactory::addShape(std::vector<AbstractShape*>& objects)
{
	numberOfObject_++;
	calculateScalingFactor();
	objects.push_back(generateShape());
}
