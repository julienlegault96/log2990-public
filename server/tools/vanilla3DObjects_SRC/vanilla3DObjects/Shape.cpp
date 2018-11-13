#include "Shape.h"
#include "Drawer.h"

Shape::Shape(Shapelist type, glm::vec4 color, glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
    : AbstractShape(coords, rotationAxis, rotation, scale), color_(color) {
	deformation_ = glm::vec3(1, 1, 1);
    init(type);
}

Shape::Shape(Shapelist type, glm::vec4 color, glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale, glm::vec3 deformation) 
	: AbstractShape(coords, rotationAxis, rotation, scale), color_(color), deformation_(deformation) {
	init(type);
}

Shape::~Shape()
{
    delete forme_;
}

void Shape::init(Shapelist type) {
    switch (type)
    {
	case(Tore):
		forme_ = new FormeTore(0.5, 8, 8, true);
		break;
    case(Sphere):
        forme_ = new FormeSphere(0.5, 8, 8, true);
        break;

    case(Cone):
        forme_ = new FormeCylindre(0.5, 0.0, 0.8, 10, 1, true);
        break;

    case(Cube):
        forme_ = new FormeCube(0.75, true);
        break;

    case(Cylindre):
        forme_ = new FormeCylindre(0.4, 0.4, 0.6, 10, 1, true);
        break;

    case(Tetrahedre):
        forme_ = new FormeTetraedre(1.0, true);
        break;
    }
}

void Shape::setColor(glm::vec4 baseColor)
{
    color_ = baseColor;
    setModified();
}

glm::vec4 Shape::getColor() const
{
	return color_;
}

glm::vec3 Shape::getDeformation() const
{
	return deformation_;
}

void Shape::accept(const Drawer* visitor) const 
{
	visitor->draw(this);
}

void Shape::show() const
{
	forme_->afficher();
}
