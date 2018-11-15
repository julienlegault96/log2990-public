#ifndef COMPOSITE_SHAPE_H
#define COMPOSITE_SHAPE_H

#include <vector>
#include <glm/vec4.hpp>
#include "AbstractShape.h"

class CompositeShape : public AbstractShape {
public:
    CompositeShape(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
	std::vector<AbstractShape*> getShapes() const;
    void accept(const Drawer * drawer) const;
protected:
    const glm::vec4 GRIS_CLAIR_POUR_TEXTURES = glm::vec4(0.7, 0.7, 0.7, 1.0);
    const glm::vec3 DEFAULT_COORDS = glm::vec3(0.0);
    const glm::vec3 DEFAULT_ROTATION_AXIS = glm::vec3(1.0);
    const GLfloat DEFAULT_ROTATION = (GLfloat) 0.0;
    const GLfloat DEFAULT_SCALE = (GLfloat) 1.0;

    std::vector<AbstractShape*> shapes_;

    virtual ~CompositeShape();
};

#endif;
