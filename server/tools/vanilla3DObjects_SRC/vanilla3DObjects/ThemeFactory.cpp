#include "ThemeFactory.h"
#include "Default3DProgramState.h"
#include "Planet.h"
#include "Asteroid.h"
#include "AlienShip.h"
#include "FlyingSaucer.h"
#include "Sun.h"
#include "Fusee.h"
#include "HeatShield.h"
#include "Spaceship.h"
#include "Satelite.h"
#include "EntreprisingSpaceship.h"
#include "SpaceStation.h"

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

short ThemeFactory::generateCoherentContentChoice() const {

    short choice;
    bool ok = false;

    do {
        // Implement case specific rules;
        choice = rand() % possibleShapes::enumSize;
        switch (choice) {
            case sun:
                ok = !sunPresent_;
                break;
            default:
                ok = true;
                break;
        };
    } while (!ok);

    return choice;
}

AbstractShape * ThemeFactory::generateShape()
{
    CompositeShape* generatedObject = nullptr;
	glm::vec4 baseColor(generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1), 1);
	glm::vec4 secondaryColor(generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1), 1);
	glm::vec3 translate(0, 0, 0);
	generateCoordinates(translate);
	glm::vec3 rotate(generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1));
    GLfloat rotateAngle(generateFloat(0, 360));

	GLfloat scale = generateFloat(MIN_SIZE_MODIFIER * scalingFactor_, MAX_SIZE_MODIFIER * scalingFactor_);

    Default3DProgramState* state = Default3DProgramState::obtenirInstance();
    //TODO remettre random
    switch (generateCoherentContentChoice()) {
        case asteroid:
            generatedObject = new Asteroid(translate, rotate, rotateAngle, scale);
            break;
	    case alienShip:
		    generatedObject = new AlienShip(translate, rotate, rotateAngle, scale);
		    break;
        case planet:
            generatedObject = new Planet(rand(), translate, baseColor, rotateAngle, rotate, scale);
            break;
	    case sun:
			generatedObject = new Sunny(translate, rotate, generateFloat(0, 360), scale);
			sunPresent_ = true;
            state->LightSource.position = glm::vec4(translate, 1.0);
			break;
	    case flyingSaucer:		    
		    generatedObject = new FlyingSaucer(translate, rotate, generateFloat(0, 360), scale, baseColor, secondaryColor);
		    break;
	    case fusee:
		    generatedObject = new Fusee(translate, rotate, generateFloat(0, 360), scale);
		    break;
	    case heatShield:
		    generatedObject = new Heatshield(translate, rotate, generateFloat(0, 360), scale);
		    break;
	    case spaceship:
		    generatedObject = new Spaceship(translate, rotate, generateFloat(0, 360), scale);
		    break;
		case satellite:
			generatedObject = new Satellite(translate, rotate, generateFloat(0, 360), scale, secondaryColor, baseColor);
			break;
		case entreprisingSpaceship:
			generatedObject = new EntreprisingSpaceship(translate, rotate, generateFloat(0, 360), scale, baseColor);
			break;
		case spaceStation:
			generatedObject = new SpaceStation(translate, rotate, generateFloat(0, 360), scale, secondaryColor, baseColor);
			break;
        default:
            throw std::exception("shape was not listed in the possible shapes");
    };
    
    return generatedObject;
}

bool ThemeFactory::checkForCollision(const glm::vec3 & coords)
{
	double distance = 0;
	for (AbstractShape* shape : shippingContainer_) {
		distance =
			pow(shape->getCoordinates().x - coords.x, 2) +
			pow(shape->getCoordinates().y - coords.y, 2) +
			pow(shape->getCoordinates().y - coords.y, 2);

        if (distance < MIN_DISTANCE * scalingFactor_) { return true; }
	}
	return false;
}
