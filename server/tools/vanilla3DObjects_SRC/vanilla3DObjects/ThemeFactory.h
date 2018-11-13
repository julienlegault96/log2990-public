#ifndef THEME_FACTORY_H
#define THEME_FACTORY_H
#include "AbstractFactory.h"
class ThemeFactory : public AbstractFactory
{
public:
    ThemeFactory(const int & numberOfObject, const double& dimboite);
	void generateShapes(std::vector<AbstractShape*> & objects);
	AbstractShape* generateShape();
    bool checkForCollision(const glm::vec3 & coords);
private: 
    enum possibleShapes { asteroid, planet, flyingSaucer, alienShip, enumSize, sun, fusee };
	short const MIN_DISTANCE = 12;
	bool isSun_ = false;
};
#endif

