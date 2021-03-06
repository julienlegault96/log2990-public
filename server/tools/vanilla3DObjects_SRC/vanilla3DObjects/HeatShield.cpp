#include "HeatShield.h"
#include "Shape.h"

Heatshield::Heatshield(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
	:CompositeShape(coords, rotationAxis, rotation, scale)
{
	shapes_.push_back(
		new Shape(
			Shapelist::ConeTronque,
			glm::vec4(0.4, 0.4, 0.4, 1.0),
			DEFAULT_COORDS,
            DEFAULT_ROTATION_AXIS,
            DEFAULT_ROTATION,
			(GLfloat) 0.6
		)
	);

    shapes_.push_back(
        new Shape(
            Shapelist::Sphere,
            GRIS_CLAIR_POUR_TEXTURES + glm::vec4(0.3, -0.1, -0.2, 0.0),
            DEFAULT_COORDS,
            DEFAULT_ROTATION_AXIS,
            DEFAULT_ROTATION,
            glm::vec3(0.6, 0.6, 0.18)
        )
    );

}