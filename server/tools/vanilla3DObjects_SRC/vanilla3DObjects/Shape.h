#ifndef __SCENE_H
#define __SCENE_H
#ifndef INCLUDE_FORME_H
#define INCLUDE_FORME_H
#include "inf2705-forme.h"
#endif 


#include "AbstractShape.h"

enum Shapelist {Sphere, Cone, Cube, Tetrahedre, Cylindre, ConeTronque, Theiere, Tore };

class  Shape : public AbstractShape {
public:
    
    /*Texture texture_*/

	Shape(Shapelist type, glm::vec4 color, glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale);
	Shape(Shapelist type, glm::vec4 color, glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, glm::vec3 deformation);
    void init(Shapelist type);
	~Shape();

	void setColor(glm::vec4 baseColor);
	glm::vec4 getColor() const;
    /*void setTexture(Texture texture);*/
    void accept(const Drawer * visitor) const;
	void show() const;

private:
	FormeBase2705 *forme_;
	glm::vec4 color_;
};

#endif