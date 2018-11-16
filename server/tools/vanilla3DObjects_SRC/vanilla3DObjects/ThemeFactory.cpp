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
#include "TeslaCar.h"
#include "Ringworld.h"
#include "Navette.h"
#include "Robot.h"

ThemeFactory::ThemeFactory(const int & numberOfObject): AbstractFactory(numberOfObject){ }

void ThemeFactory::generateShapes(std::vector<AbstractShape*>* objects)
{
	calculateScalingFactor();
	for (int i = 0; i < this->numberOfObject_; i++)
	{
		generateShape(objects);
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
                ok = !sunPresent_ && !modMode_;
            case ringworld:
                ok = !rwPresent_ && !modMode_;
                break;
            default:
                ok = true;
                break;
        };
    } while (!ok);

    return choice;
}

void ThemeFactory::generateShape(std::vector<AbstractShape*> * objects)
{
    CompositeShape* generatedObject = nullptr;
	glm::vec4 baseColor(generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1), 1);
	glm::vec4 secondaryColor(generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1), 1);
	glm::vec3 translate(0, 0, 0);
	generateCoordinates(translate, objects);
	glm::vec3 rotate(generateFloat(0, 1), generateFloat(0, 1), generateFloat(0, 1));
    GLfloat rotateAngle(generateFloat(0, 360));

	GLfloat scale = generateFloat(MIN_SIZE_MODIFIER * scalingFactor_, MAX_SIZE_MODIFIER * scalingFactor_);

    Default3DProgramState* state = Default3DProgramState::obtenirInstance();

    switch (generateCoherentContentChoice()) {
		case robot:
			generatedObject = new Robot(translate, rotate, rotateAngle, scale);
			break;
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
			generatedObject = new Sunny(translate, rotate, rotateAngle, scale);
			sunPresent_ = true;
            state->LightSource.position = glm::vec4(translate, 1.0);
			break;
	    case flyingSaucer:		    
		    generatedObject = new FlyingSaucer(translate, rotate, rotateAngle, scale, baseColor, secondaryColor);
		    break;
	    case fusee:
		    generatedObject = new Fusee(translate, rotate, rotateAngle, scale);
		    break;
		case navette:
			generatedObject = new Navette(translate, rotate, rotateAngle, scale);
			break;
	    case heatShield:
		    generatedObject = new Heatshield(translate, rotate, rotateAngle, scale);
		    break;
	    case spaceship:
		    generatedObject = new Spaceship(translate, rotate, rotateAngle, scale);
		    break;
		case satellite:
			generatedObject = new Satellite(translate, rotate, rotateAngle, scale, secondaryColor, baseColor);
			break;
		case entreprisingSpaceship:
			generatedObject = new EntreprisingSpaceship(translate, rotate, rotateAngle, scale, baseColor);
			break;
		case spaceStation:
			generatedObject = new SpaceStation(translate, rotate, rotateAngle, scale, secondaryColor, baseColor);
			break;
		case teslaCar:
		    generatedObject = new TeslaCar(translate, rotate, rotateAngle, scale);
		    break;
	    case ringworld:
		    generatedObject = new Ringworld(glm::vec3(0,0,5.5), rotate, rotateAngle, (scale));
            rwPresent_ = true;
		    break;
        default:
            throw std::exception("shape was not listed in the possible shapes");
    };
    if (modMode_) { generatedObject->setModified(); };

    objects->push_back(generatedObject);
}

bool ThemeFactory::checkForCollision(const glm::vec3 & coords, std::vector<AbstractShape*> * objects) const
{
	double distance = 0;
	for (AbstractShape* shape : *objects) {
        if (shape->isVisible()) {
            distance =
                pow(shape->getCoordinates().x - coords.x, 2) +
                pow(shape->getCoordinates().y - coords.y, 2) +
                pow(shape->getCoordinates().z - coords.z, 2);

            if (distance < MIN_DISTANCE * scalingFactor_) { return true; }
        }
	}
	return false;
}
