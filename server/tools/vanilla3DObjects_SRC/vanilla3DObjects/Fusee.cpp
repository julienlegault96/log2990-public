#include "Fusee.h"
#include "Shape.h"

Fusee::Fusee(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
	:CompositeShape(coords, rotationAxis, rotation, scale)
{

    shapes_.push_back(
        new Shape(
            Shapelist::ConeTronque,
            COLOR_BODY,
            DEFAULT_COORDS,
            DEFAULT_ROTATION_AXIS,
            DEFAULT_ROTATION,
            glm::vec3(0.3, 0.3, 0.5)
        )
    );

	shapes_.push_back(
		new Shape(
			Shapelist::Cylindre,
            COLOR_BODY,
            glm::vec3(0.0, 0.0, - 0.6),
			DEFAULT_ROTATION_AXIS,
            DEFAULT_ROTATION,
			glm::vec3(0.4, 0.4, 1.0)
		)
	);

    shapes_.push_back(
        new Shape(
            Shapelist::Cone,
            COLOR_REACTOR_CONE,
            glm::vec3(0.0, 0.0, -0.72),
            DEFAULT_ROTATION_AXIS,
            DEFAULT_ROTATION,
            DEFAULT_SCALE * 0.4
        )
    );

	shapes_.push_back(
		new Shape(
			Shapelist::ConeTronque,
            COLOR_FIRE_EXHAUST,
            glm::vec3(0.0, 0.0, -0.7),
            glm::vec3(1.0, 0.0, 0.0),
            180,
            glm::vec3(0.2, 0.2, 0.8)
		)
	);


}
