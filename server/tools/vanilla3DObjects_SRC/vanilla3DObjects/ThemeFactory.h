#ifndef THEME_FACTORY_H
#define THEME_FACTORY_H
#include "AbstractFactory.h"
class ThemeFactory : public AbstractFactory
{
public:
    ThemeFactory(const int & numberOfObject);
	void generateShapes(std::vector<AbstractShape*> * objects);
	void generateShape(std::vector<AbstractShape*> * objects);
    bool checkForCollision(const glm::vec3 & coords, std::vector<AbstractShape*> * objects) const;
private:
    enum possibleShapes { asteroid, planet, flyingSaucer, alienShip,
                          sun, fusee, heatShield, spaceship, satellite,
                          entreprisingSpaceship, spaceStation, teslaCar, ringworld, robot, navette,
                          enumSize
                        };
    short const MIN_DISTANCE = 9;
	bool sunPresent_ = false;
    bool rwPresent_ = false;

    short generateCoherentContentChoice() const;
};
#endif

