#pragma once
#include "AbstractFactory.h"

class GeoFactory : public AbstractFactory
{
public:
    GeoFactory(std::vector<AbstractShape*>& container, double & scalingFactor);
    void generateShape(const int commandAmount);
    bool checkForCollision(const glm::vec3 & coords);
private:
    short const MIN_DISTANCE = 12;
};

