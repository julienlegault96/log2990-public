#include "CompositeShape.h"

CompositeShape::CompositeShape(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation,  GLfloat scale)
    : AbstractShape(coords, rotationAxis, rotation, scale) { }

CompositeShape::~CompositeShape(){
    shapes_.clear();
}

void CompositeShape::accept(Drawer & visitor) {
    for (AbstractShape* shape : shapes_) {
        shape->accept(visitor);
    }
}
