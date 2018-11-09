#ifndef COMPOSITE_SHAPE_H
#define COMPOSITE_SHAPE_H

#include <vector>
#include "AbstractShape.h"

class Drawer;
class CompositeShape : public AbstractShape {
public:
    CompositeShape(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
	std::vector<AbstractShape*> getShapes() const;
    void accept(const Drawer * drawer) const;
protected:
    std::vector<AbstractShape*> shapes_;


    ~CompositeShape();
};

#endif;
