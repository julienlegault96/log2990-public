#pragma once
#include "AbstractFactory.h"
class ThemeFactory : public AbstractFactory
{
public:
public:
    ThemeFactory(std::vector<AbstractShape*>& container, double & scalingFactor);
    void generateShape(const int commandAmount);
    bool checkForCollision(const glm::vec3 & coords);
};

