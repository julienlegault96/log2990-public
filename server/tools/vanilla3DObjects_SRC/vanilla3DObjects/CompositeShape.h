#pragma once

#include <vector>
#include "AbstractShape.h"
#include "Drawer.h"


class CompositeShape : public AbstractShape {
public:
    CompositeShape(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);

    virtual void accept(Drawer & visitor);
private:
    std::vector<AbstractShape*> shapes_;


    ~CompositeShape();
};
