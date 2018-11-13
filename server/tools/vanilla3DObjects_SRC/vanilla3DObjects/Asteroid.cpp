#include "Asteroid.h"
#include "Shape.h"

Asteroid::Asteroid(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
    : CompositeShape(coords, rotationAxis, rotation, scale)
{
    shapes_.push_back(
        new Shape(
            Shapelist::Cube,
            GRIS_CLAIR_POUR_TEXTURES,
            coords_ + glm::vec3(0.5),
            rotationAxis_,
            rotation_,
            scale_ * (GLfloat) 0.5
        )
    );

    shapes_.push_back(
        new Shape(
            Shapelist::Tetrahedre,
            GRIS_CLAIR_POUR_TEXTURES,
            coords_ - glm::vec3(0.5),
            rotationAxis_ + glm::vec3(0.0,0.0,7),
            rotation_,
            scale_* (GLfloat) 1.5
        )
    );

    shapes_.push_back(
        new Shape(
            Shapelist::Tetrahedre,
            GRIS_CLAIR_POUR_TEXTURES,
            coords_,
            rotationAxis_ + glm::vec3(0.0, 0.0, -77),
            rotation_,
            scale_* (GLfloat) 1
        )
    );
}
