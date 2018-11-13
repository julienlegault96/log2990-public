#include "ThemeFactory.h"
#include "Planet.h"
#include "Asteroid.h"
#include "AlienShip.h"
#include "FlyingSaucer.h"
#include "Fusee.h"
// #include "Spaceship.h"

ThemeFactory::ThemeFactory(const int & numberOfObject, const double & dimboite): AbstractFactory(numberOfObject, dimboite){ }

void ThemeFactory::generateShapes(std::vector<AbstractShape*>& objects)
{
	this->shippingContainer_ = objects;
	objects.clear();
	calculateScalingFactor();
	for (int i = 0; i < this->numberOfObject_; i++)
	{
		objects.push_back(generateShape());
	}
}

AbstractShape * ThemeFactory::generateShape()
{
    CompositeShape* generatedObject = nullptr;
	glm::vec4 color(generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1));

	glm::vec3 translate(0, 0, 0);
	generateCoordinates(translate);
	glm::vec3 rotate(generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1));

	GLfloat scale = generateFloat(MIN_SIZE_MODIFIER * scalingFactor_, MAX_SIZE_MODIFIER * scalingFactor_);

    //TODO remettre random
    switch (possibleShapes(possibleShapes::flyingSaucer/*rand() % possibleShapes::enumSize*/)) {
    case asteroid:
        //generatedObject = new Asteroid(translate, rotate, generateFloat(0, 360), scale);
        break;
	case alienShip:
		generatedObject = new AlienShip(translate, rotate, generateFloat(0, 360), scale);
		break;
    case planet:
        //generatedObject = new Planet(translate, rotate, generateFloat(0, 360), scale);
        break;
	case flyingSaucer:
		glm::vec4 hullColor(generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1));
		glm::vec4 glassColor(generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1));
		generatedObject = new FlyingSaucer(translate, rotate, generateFloat(0, 360), scale, hullColor, glassColor);
		break;
	case fusee:
		generatedObject = new Fusee(translate, rotate, generateFloat(0, 360), scale);		// Arguments have to be changed. Just for test.

		break;
    default:
        throw std::exception("shape was not listed in the possible shapes");
    };
    
    return generatedObject;
}

bool ThemeFactory::checkForCollision(const glm::vec3 & coords)
{
	bool collision = false;
	double distance = 0;
	for (AbstractShape* shape : shippingContainer_) {
		distance =
			pow(shape->getCoordinates().x - coords.x, 2) +
			pow(shape->getCoordinates().y - coords.y, 2) +
			pow(shape->getCoordinates().y - coords.y, 2);

		collision = distance < MIN_DISTANCE * scalingFactor_;
		if (collision) { break; }
	}
	return collision;
}
