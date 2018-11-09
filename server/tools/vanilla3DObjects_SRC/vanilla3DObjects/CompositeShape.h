#ifndef COMPOSITE_SHAPE_H
#define COMPOSITE_SHAPE_H

#include <vector>
#include "AbstractShape.h"

class Drawer;
class CompositeShape : public AbstractShape {
public:
    CompositeShape(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);

    void accept(Drawer & drawer);
protected:
    std::vector<AbstractShape*> shapes_;


    ~CompositeShape();
};

#endif;
