#include "Planet.h"

Planet::Planet(short randomseed, glm::vec3 coords, glm::vec4 color, GLfloat rotation, glm::vec3 rotationAxis, GLfloat scale)
    : CompositeShape(coords, rotationAxis, rotation, scale)
{
	initPlanet(randomseed % ShapeThemelist::enumSize, color);
}


void Planet::initPlanet(short type, glm::vec4 color)
{
	switch (type)
	{
	case(ringPlanet):
		shapes_.push_back(
            new Shape(
                Shapelist::Sphere,
                GRIS_CLAIR_POUR_TEXTURES,
                DEFAULT_COORDS,
                DEFAULT_ROTATION_AXIS,
                DEFAULT_ROTATION,
                DEFAULT_SCALE
            )
        );

		shapes_.push_back(
            new Shape(
                Shapelist::Tore,
                color,
                DEFAULT_COORDS,
                DEFAULT_ROTATION_AXIS,
                DEFAULT_ROTATION,
                glm::vec3(0.14)
            )
        ); 

        shapes_.push_back(
            new Shape(
                Shapelist::Tore,
                color,
                DEFAULT_COORDS,
                DEFAULT_ROTATION_AXIS,
                DEFAULT_ROTATION,
                glm::vec3(0.126, 0.126, 0.1)
            )
        );

        shapes_.push_back(
            new Shape(
                Shapelist::Tore,
                color - glm::vec4(0.166, 0.166, 0.1, 0.0),
                DEFAULT_COORDS,
                DEFAULT_ROTATION_AXIS,
                DEFAULT_ROTATION,
                glm::vec3(0.166, 0.166, 0.1)
            )
        );
        break;

    default:
        shapes_.push_back(
            new Shape(
                Shapelist::Sphere,
                GRIS_CLAIR_POUR_TEXTURES,
                DEFAULT_COORDS,
                DEFAULT_ROTATION_AXIS,
                DEFAULT_ROTATION,
                DEFAULT_SCALE
            )
        );
        break;

	}
}
/*
void Planet::changeTexture(GLuint texture)
{
	texture_ = texture;
	modified_ = true;
}
*/