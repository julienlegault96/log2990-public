#include "Shape.h"


Shape::Shape(Shapelist type, glm::vec4 color, glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
    : AbstractShape(coords, rotationAxis, rotation, scale), color_(color) {
    init(type);
}

Shape::~Shape()
{
    delete forme;
}

void Shape::init(Shapelist type) {
    switch (type)
    {
    case(Sphere):
        forme = new FormeSphere(0.5, 8, 8, true);
        break;

    case(Cone):
        forme = new FormeCylindre(0.5, 0.0, 0.8, 10, 1, true);
        break;

    case(Cube):
        forme = new FormeCube(0.75, true);
        break;

    case(Cylindre):
        forme = new FormeCylindre(0.4, 0.4, 0.6, 10, 1, true);
        break;

    case(Tetrahedre):
        forme = new FormeTetraedre(1.0, true);
        break;
    }
}

void Shape::setColor(glm::vec4 baseColor)
{
    color_ = baseColor;
    setModified();
}

void Shape::accept(Drawer& visitor) {

    forme->afficher();
}
