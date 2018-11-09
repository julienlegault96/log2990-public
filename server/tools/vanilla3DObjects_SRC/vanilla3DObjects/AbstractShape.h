#ifndef ABSTRACT_SHAPE_H
#define ABSTRACT_SHAPE_H
#include <GL/glew.h>

#include <glm/vec3.hpp>

class Drawer;
class AbstractShape {
public:
    AbstractShape(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
    bool isModded() const ;
    void setModified();
	glm::vec3 getCoordinates();
    void hide();

    void accept(Drawer& drawer);
protected:
    glm::vec3 coords_;
    glm::vec3 rotationAxis_;
    GLfloat rotation_;
    GLfloat scale_;
private:
    bool modified_ = false;
    bool appear_ = true;
};

#endif