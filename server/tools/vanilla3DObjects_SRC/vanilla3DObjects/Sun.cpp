#include "Sun.h"
#include "Shape.h"

Sunny::Sunny(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
	: CompositeShape(coords, rotationAxis, rotation, scale)
{
	shapes_.push_back(
		new Shape(
			Shapelist::Sphere,
            FIRE_ENGINE_RED,
			glm::vec3(0.0),
			glm::vec3(1.0),
            (GLfloat) 0,
			(GLfloat) 1.3
		)
	);

    shapes_.push_back(
        new Shape(
            Shapelist::Sphere,
            DEEP_SAFFRON,
            glm::vec3(0.0),
            glm::vec3(1.0),
            (GLfloat) 0,
            (GLfloat) 1.7
        )
    );

    shapes_.push_back(
        new Shape(
            Shapelist::Sphere,
            YELLOW_ROSE,
            glm::vec3(0.0),
            glm::vec3(1.0),
            (GLfloat) 0,
            (GLfloat) 1.8
        )
    );

    shapes_.push_back(
        new Shape(
            Shapelist::Sphere,
            LEMON_YELLOW,
            glm::vec3(0.0),
            glm::vec3(1.0),
            (GLfloat) 0,
            (GLfloat) 2
        )
    );
}