#pragma once
#include <vector>
#include "AbstractShape.h"

class AbstractFactory {
public:
    AbstractFactory(std::vector<AbstractShape*>& container, double& dimboite);
    virtual void generateShape(const int commandAmount) = 0;
    float generateFloat(const float & min, const float & max) const;
    void generateCoordinates(glm::vec3 & coords);
    void calculateScalingFactor(const int commandAmount);
    virtual bool checkForCollision(const glm::vec3 & coords) = 0;
protected:
    std::vector<AbstractShape*>* shippingContainer_;
    double* dimboite_;
    float scalingFactor_;
    float const MIN_SIZE_MODIFIER = 0.5;
    float const MAX_SIZE_MODIFIER = 1.5;
    short const ALLOCATED_SHAPE_VOLUME = 49;
	short const DEFAULT_COMMAND_AMOUNT = 10;
};

