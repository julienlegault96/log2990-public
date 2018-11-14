#include "HeatShield.h"
#include "Shape.h"

Heatshield::Heatshield(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
	:CompositeShape(coords, rotationAxis, rotation, scale)
{
	shapes_.push_back(
		new Shape(
			Shapelist::ConeTronque,
			GRIS_CLAIR_POUR_TEXTURES,
			glm::vec3(0.0),
			rotationAxis_,
            (GLfloat) 0,
			(GLfloat) 1
		)
	);

    shapes_.push_back(
        new Shape(
            Shapelist::Sphere,
            //teinte rouge
            GRIS_CLAIR_POUR_TEXTURES + glm::vec4(0.3, 0.0, 0.0, 0.0),
            glm::vec3(0.0, 0.0 , 0.0),
            rotationAxis_,
            (GLfloat) 0,
            (GLfloat) 1,
            glm::vec3(1, 1, 0.2)
        )
    );

}