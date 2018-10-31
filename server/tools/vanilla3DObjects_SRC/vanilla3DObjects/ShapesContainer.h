#pragma once
#include <cmath>
#include <string>
#include "Shape.h"
enum Modifications { ColorChange, AddObject, DeleteObject};
class ShapesContainer {
public:
	
	ShapesContainer(int numberShapes, double dimBoite);
    void setModBan( const std::string & banString);
    std::vector<Shape*> getShapes() const;
	void modify();
	~ShapesContainer();
private:
    short const MOD_COUNT = 7;
	short const MIN_DISTANCE = 6;
    std::string _banString = "";
    std::vector<Shape*> _shapes = {};
	int _numberShapes = 0;
	double _scalingFactor = 1;
	double _dimBoite;

	void generateShapes();
	float randFloat(const float& min, const float& max) const;
	void randCoords(glm::vec3 *coords) const;
	bool checkForCollision(glm::vec3 *coords) const;
	void changeColor(int index);
	void deleteShape(int index);
	void addShape();
	void generateShape();
};

ShapesContainer::ShapesContainer(int numberShapes, double dimBoite) 
    : _numberShapes(numberShapes), _dimBoite(dimBoite) {
	_scalingFactor = pow(_dimBoite, 3) / (49*_numberShapes);
	generateShapes();
}

void ShapesContainer::setModBan(const std::string & banString) {
    _banString = banString;
}

ShapesContainer::~ShapesContainer() {
    // call destructor for each contained shape
    _shapes.clear();
}

void ShapesContainer::generateShapes() {
	for (int index = 0; index < _numberShapes; index++)
	{
		generateShape();
	}
}

void ShapesContainer::generateShape()  {
	Shapelist type = Shapelist(rand() % Shapelist::Cylindre + 1);
	glm::vec4 color(randFloat(0, 1), randFloat(0, 1), randFloat(0, 1), 1);

	glm::vec3 translateShape(0, 0, 0);
	randCoords(&translateShape);

	glm::vec3 RotateShape(randFloat(0, 1), randFloat(0, 1), randFloat(0, 1));

	GLfloat scaleShape = randFloat(0.5*_scalingFactor, 1.5*_scalingFactor);
	Shape * newShape = new Shape(type, translateShape, color, randFloat(0, 360), RotateShape, scaleShape);
	_shapes.push_back(newShape);
}

//fonction retournant un float aleatoire
//source : https://www.gamedev.net/forums/topic/41147-random-glfloat-value/
float ShapesContainer::randFloat(const float& min, const float& max) const {
	float range = max - min;
	float num = range * rand() / RAND_MAX;
	return (num + min);
}

void ShapesContainer::randCoords(glm::vec3 *coords) const {
	do {
		coords->x = randFloat(-_dimBoite / 2, _dimBoite / 2);
		coords->y = randFloat(-_dimBoite  / 2, _dimBoite/ 2);
		coords->z = randFloat(0, _dimBoite - 1);
	} while (checkForCollision(coords));
}

bool ShapesContainer::checkForCollision(glm::vec3 *coords) const {
	bool collision = false;
	double distance = 0;
	for (Shape* shape : _shapes)
	{
		distance = 
            pow(shape->coords_.x - coords->x, 2) +
            pow(shape->coords_.y - coords->y, 2) +
            pow(shape->coords_.z - coords->z, 2);

		collision = distance < 12*_scalingFactor;
        if (collision) { break; }
	}
	return collision;
}

std::vector<Shape*> ShapesContainer::getShapes() const {
	return _shapes;
}

void ShapesContainer::modify() {
    if (_banString.length() == Modifications::DeleteObject + 1) {
        return /*all modifications banned*/;
    }

	for (int i = 0; i < MOD_COUNT; i++)
	{
		int index = rand() % this->_numberShapes;
        // only modify unmodified shapes
		while (this->_shapes.at(index)->modified_) {
			index = rand() % this->_numberShapes;
		}

		Modifications mod = Modifications(rand() % (Modifications::DeleteObject + 1));
        // only do unbanned modifications
        while (_banString.length() != 0 // no ban?
            && _banString.find_first_of(mod) != std::string::npos) {
            mod = Modifications(rand() % (Modifications::DeleteObject + 1));
        }

		switch (mod) {
		    case ColorChange:
			    changeColor(index);
			    break;
		    case AddObject:
			    addShape();
			    break;
		    case DeleteObject:
			    deleteShape(index);
			    break;
		}
	}
}

void ShapesContainer::changeColor(int index) {
	glm::vec4 newColor(randFloat(0, 1), randFloat(0, 1), randFloat(0, 1), 1);
	while(this->_shapes.at(index)->baseColor_ == newColor) {
		glm::vec4 newColor(randFloat(0, 1), randFloat(0, 1), randFloat(0, 1), 1);
	}
	_shapes.at(index)->ChangeColor(newColor);
}

void ShapesContainer::deleteShape(int index) {
	_shapes.at(index)->disappear();
}

void ShapesContainer::addShape() {
	generateShape();
	_shapes.at(_numberShapes++)->modified_ = true;
}