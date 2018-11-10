#include "ThemeFactory.h"

ThemeFactory::ThemeFactory(const int & numberOfObject, const double & dimboite): AbstractFactory(numberOfObject, dimboite)
{
	
}

void ThemeFactory::generateShapes(std::vector<AbstractShape*>& objects)
{
}

AbstractShape * ThemeFactory::generateShape()
{
	return nullptr;
}

bool ThemeFactory::checkForCollision(const glm::vec3 & coords)
{
	return false;
}
