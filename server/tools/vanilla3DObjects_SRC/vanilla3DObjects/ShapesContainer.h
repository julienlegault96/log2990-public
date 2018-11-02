#pragma once
#include <cmath>
#include <string>
#include "Shape.h"
enum Modifications { ColorChange, AddObject, DeleteObject};
class ShapesContainer {
public:
	
	ShapesContainer(int numberShapes, double dimBoite);
    void parseModOptions( const std::string & optionString);
    std::vector<Shape*> getShapes() const;
	void modify();
	~ShapesContainer();
private:
	float const MIN_SIZE_MODIFIER = 0.5;
	float const MAX_SIZE_MODIFIER = 1.5;
    short const MOD_COUNT = 7;
	short const MIN_DISTANCE = 12;
	short const ALLOCATED_SHAPE_VOLUME = 49;
    const char ADD_PARAMETER = 'a';
    const char SUP_PARAMETER = 's';
    const char COL_PARAMETER = 'c';
    std::string _banString;
    std::vector<Shape*> _shapes = {};
	int _numberShapes = 0;
	double _scalingFactor = 1;
	double _dimBoite;

	void generateShapes();
	float randFloat(const float& min, const float& max) const;
	void randCoords(glm::vec3 *coords);
	bool checkForCollision(glm::vec3 *coords);
	void changeColor(int index);
	void deleteShape(int index);
	void addShape();
	void generateShape();
	void calculateScalingFactor();
};

ShapesContainer::ShapesContainer(int numberShapes, double dimBoite) 
    : _numberShapes(numberShapes), _dimBoite(dimBoite) {
	calculateScalingFactor();
	generateShapes();
}

void ShapesContainer::parseModOptions(const std::string & optionString) {
    if (optionString.find(ADD_PARAMETER) == std::string::npos) { _banString.append(std::to_string((int)Modifications::AddObject)); }
    if (optionString.find(SUP_PARAMETER) == std::string::npos) { _banString.append(std::to_string((int)Modifications::DeleteObject)); }
    if (optionString.find(COL_PARAMETER) == std::string::npos) { _banString.append(std::to_string((int)Modifications::ColorChange)); }
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

	GLfloat scaleShape = randFloat(MIN_SIZE_MODIFIER * _scalingFactor, MAX_SIZE_MODIFIER*_scalingFactor);
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

void ShapesContainer::randCoords(glm::vec3 *coords) {
	do {
		coords->x = randFloat(-_dimBoite / 2, _dimBoite / 2);
		coords->y = randFloat(-_dimBoite  / 2, _dimBoite/ 2);
		coords->z = randFloat(0, _dimBoite - 1);
	} while (checkForCollision(coords));
}

bool ShapesContainer::checkForCollision(glm::vec3 *coords) {
	bool collision = false;
	double distance = 0;
	for (Shape* shape : _shapes)
	{
		distance = 
            pow(shape->coords_.x - coords->x, 2) +
            pow(shape->coords_.y - coords->y, 2) +
            pow(shape->coords_.z - coords->z, 2);

		collision = distance < MIN_DISTANCE * _scalingFactor;
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
        while (_banString.length() != 0
            && _banString.find(std::to_string(mod)) != std::string::npos) {
            mod = Modifications(rand() % (Modifications::DeleteObject + 1));
        }

		switch(mod) {
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
	_shapes.at(index)->hide();
}

void ShapesContainer::addShape() {
	calculateScalingFactor();
	generateShape();
	_shapes.at(_numberShapes++)->modified_ = true;
}

void ShapesContainer::calculateScalingFactor() {
	_scalingFactor = pow(_dimBoite, 3) / (ALLOCATED_SHAPE_VOLUME * _numberShapes);
}