#include "Asteroid.h"
#include "Shape.h"

Asteroid::Asteroid(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
    : CompositeShape(coords, rotationAxis, rotation, scale)
{
    shapes_.push_back(
        new Shape(
            Shapelist::Cube,
            GRIS_CLAIR_POUR_TEXTURES,
            glm::vec3(0.2, 0.0, 0.0),
            DEFAULT_ROTATION_AXIS,
            DEFAULT_ROTATION,
            (GLfloat) 0.7
        )
    );

    shapes_.push_back(
        new Shape(
            Shapelist::Sphere,
            GRIS_CLAIR_POUR_TEXTURES,
            glm::vec3(-0.2, 0.0, 0.0),
            glm::vec3(0.0, 0.0, -77),
            rotation_,
            (GLfloat) 0.54
        )
    );

    shapes_.push_back(
        new Shape(
            Shapelist::Sphere,
            GRIS_CLAIR_POUR_TEXTURES,
            glm::vec3(0.0, 0.0, -0.4),
            glm::vec3(0.0, 0.0, 7),
            rotation_,
            (GLfloat) 1.2
        )
    );

    shapes_.push_back(
        new Shape(
            Shapelist::Sphere,
            GRIS_CLAIR_POUR_TEXTURES,
            glm::vec3(0.3, 0.3, 0.0),
            glm::vec3(0.0, 0.0, -77),
            rotation_,
            (GLfloat) 0.5
        )
    );
}
