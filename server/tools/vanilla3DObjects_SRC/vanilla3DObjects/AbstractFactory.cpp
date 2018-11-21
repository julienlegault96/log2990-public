
#include "AbstractFactory.h"
#include <iostream>

AbstractFactory::AbstractFactory(const int & numberOfObject){
	dimboite_ = DEFAULT_BOX_DIMENTIONS;
	numberOfObject_ = numberOfObject;
    calculateScalingFactor();
}

//fonction retournant un float aleatoire
//source : https://www.gamedev.net/forums/topic/41147-random-glfloat-value/
float AbstractFactory::generateFloat(const float& min, const float& max) const {
    float range = max - min;
    float num = range * rand() / RAND_MAX;
    return (num + min);
}

void AbstractFactory::generateCoordinates(glm::vec3 & coords, std::vector<AbstractShape*> * objects) {
    do {
        coords.x = generateFloat(-dimboite_ / 2, dimboite_ / 2);
        coords.y = generateFloat(-dimboite_ , dimboite_);
        coords.z = generateFloat(0, dimboite_);
    } while (checkForCollision(coords, objects));
}

void AbstractFactory::calculateScalingFactor() {
    scalingFactor_ = pow(dimboite_, 3) / (ALLOCATED_SHAPE_VOLUME * numberOfObject_);
}

int AbstractFactory::getNumberOfObjects() const
{
    return numberOfObject_;
}

void AbstractFactory::incrNumberOfObjects()
{
    modMode_ = true;
    numberOfObject_++;
    calculateScalingFactor();
}

void AbstractFactory::decrNumberOfObjects()
{
    modMode_ = true;
    numberOfObject_--;
    calculateScalingFactor();
}

void AbstractFactory::addShape(std::vector<AbstractShape*> * objects)
{
    modMode_ = true;
    incrNumberOfObjects();
	generateShape(objects);
}
