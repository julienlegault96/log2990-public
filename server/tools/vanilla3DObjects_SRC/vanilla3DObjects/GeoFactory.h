#ifndef GEO_FACTORY_H
#define GEO_FACTORY_H
#include "AbstractFactory.h"

class GeoFactory : public AbstractFactory
{
public:
    GeoFactory(const int &numberOfObject);
    void generateShapes(std::vector<AbstractShape*> * objects);
	void generateShape(std::vector<AbstractShape*> * objects);
    bool checkForCollision(const glm::vec3 & coords, std::vector<AbstractShape*> * objects) const;
private:
    short const MIN_DISTANCE = 12;
};

#endif

