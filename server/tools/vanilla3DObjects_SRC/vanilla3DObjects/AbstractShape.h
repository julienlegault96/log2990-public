#ifndef ABSTRACT_SHAPE_H
#define ABSTRACT_SHAPE_H
#include <GL/glew.h>
#include <glm/vec3.hpp>
#include <glm/vec4.hpp>


// circular
class Drawer;
class AbstractShape {
public:
    AbstractShape(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
    AbstractShape(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, glm::vec3 deformation);
    
	glm::vec3 getCoordinates() const;
	glm::vec3 getRotationAxis() const;
	GLfloat getRotation() const;
    glm::vec3 getScale() const;
	bool isVisible() const;
	bool isModded() const;

	void setCoords(glm::vec3 coords);
	void setRotationAxis(glm::vec3 rotationAxis);
	void setRotation(GLfloat rotation);
	void setScale(GLfloat scale);
	void setModified();
	virtual void setColor(glm::vec4 color) = 0;
	virtual glm::vec4 getColor() const = 0;

    void hide();
    virtual void accept(const Drawer *drawer) const = 0;

protected:
    glm::vec3 coords_;
    glm::vec3 rotationAxis_;
    GLfloat rotation_;
    glm::vec3 scale_;
private:
    bool modified_ = false;
    bool appear_ = true;
};

#endif