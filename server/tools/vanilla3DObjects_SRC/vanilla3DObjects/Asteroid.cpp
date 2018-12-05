#include "Asteroid.h"
#include "Shape.h"

Asteroid::Asteroid(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
    : CompositeShape(coords, rotationAxis, rotation, scale*0.8)
{
    shapes_.push_back(
        new Shape(
            Shapelist::Cube,
            GRIS_CLAIR_POUR_TEXTURES,
            glm::vec3(0.1, 0.0, 0.0),
            DEFAULT_ROTATION_AXIS,
            DEFAULT_ROTATION,
            (GLfloat) 0.35
        )
    );

    shapes_.push_back(
        new Shape(
            Shapelist::Sphere,
            GRIS_CLAIR_POUR_TEXTURES,
            glm::vec3(-0.1, 0.0, 0.0),
            glm::vec3(0.0, 0.0, -77),
            rotation_,
            (GLfloat) 0.27
        )
    );

    shapes_.push_back(
        new Shape(
            Shapelist::Sphere,
            GRIS_CLAIR_POUR_TEXTURES,
            glm::vec3(0.0, 0.0, -0.2),
            glm::vec3(0.0, 0.0, 7),
            rotation_,
            (GLfloat) 0.6
        )
    );

    shapes_.push_back(
        new Shape(
            Shapelist::Sphere,
            GRIS_CLAIR_POUR_TEXTURES,
            glm::vec3(0.15, 0.15, 0.0),
            glm::vec3(0.0, 0.0, -77),
            rotation_,
            (GLfloat) 0.25
        )
    );
}
