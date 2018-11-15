#ifndef ABSTRACT_FACTORY_H
#define ABSTRACT_FACTORY_H

#include <vector>
#ifndef  INCLUDE_GLM_VEC3
#include <glm/vec3.hpp>
#endif 
class AbstractShape;
class AbstractFactory {
public:
    AbstractFactory(const int & numberOfObject);
    virtual void generateShapes(std::vector<AbstractShape*> * objects) = 0;
	virtual void generateShape(std::vector<AbstractShape*> * objects) = 0;
    float generateFloat(const float & min, const float & max) const;
    void generateCoordinates(glm::vec3 & coords, std::vector<AbstractShape*> * objects);

    int getNumberOfObjects() const;
    void incrNumberOfObjects();
    void decrNumberOfObjects();

    void calculateScalingFactor();
    virtual bool checkForCollision(const glm::vec3 & coords, std::vector<AbstractShape*> * objects) const = 0;

	void addShape(std::vector<AbstractShape*> * objects);
protected:
    const int DEFAULT_BOX_DIMENTIONS = 10;
    const float MIN_SIZE_MODIFIER = 0.5;
	const float MAX_SIZE_MODIFIER = 1.5;
	const short ALLOCATED_SHAPE_VOLUME = 50;

    bool modMode_ = false;
    int dimboite_;
	int numberOfObject_;
    float scalingFactor_;
};

#endif
