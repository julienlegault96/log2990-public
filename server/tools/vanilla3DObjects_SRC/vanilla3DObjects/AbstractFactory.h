#ifndef ABSTRACT_FACTORY_H
#define ABSTRACT_FACTORY_H

#include <vector>
#ifndef  INCLUDE_GLM_VEC3
#include <glm/vec3.hpp>
#endif 
class AbstractShape;
class AbstractFactory {
public:
    AbstractFactory(const int & numberOfObject, const double& dimboite);
    void generateShapes(std::vector<AbstractShape*> & objects);
	AbstractShape* generateShape();
    float generateFloat(const float & min, const float & max) const;
    void generateCoordinates(glm::vec3 & coords);
    void calculateScalingFactor();
    bool checkForCollision(const glm::vec3 & coords);
	void addShape(std::vector<AbstractShape*> & objects);
protected:
    std::vector<AbstractShape*> shippingContainer_;
    double* dimboite_;
    float scalingFactor_;
	int numberOfObject_;
    const float MIN_SIZE_MODIFIER = 0.5;
	const float MAX_SIZE_MODIFIER = 1.5;
	const short ALLOCATED_SHAPE_VOLUME = 49;
};

#endif
