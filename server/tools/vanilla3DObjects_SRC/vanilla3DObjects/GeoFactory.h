#ifndef GEO_FACTORY_H
#define GEO_FACTORY_H
#include "AbstractFactory.h"

class GeoFactory : public AbstractFactory
{
public:
    GeoFactory(const int &numberOfObject, const double& dimboite);
    void generateShapes(std::vector<AbstractShape*> & objects);
	AbstractShape* generateShape();
    bool checkForCollision(const glm::vec3 & coords);
private:
    short const MIN_DISTANCE = 12;
};

#endif

