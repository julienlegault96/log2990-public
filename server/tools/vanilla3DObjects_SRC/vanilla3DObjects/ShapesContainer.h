#pragma once
#include "Shape.h"
#include <math.h>
enum Modifications { ColorChange, AddObject, DeleteObject};
class ShapesContainer {
public:
	
	ShapesContainer(int numberShapes, double dimBoite);
	std::vector<Shape*> getShapes();
	void modify();
	~ShapesContainer();
private:
	std::vector<Shape*> _shapes;
	double const MIN_DISTANCE = 6;
	double _scalingFactor = 1;
	double _dimBoite;
	int _numberShapes = 0;
	void generateShapes();
	float randFloat(const float& min, const float& max);
	void randCoords(glm::vec3 *coords);
	bool checkForCollision(glm::vec3 *coords);
	void changeColor(int index);
	void deleteShape(int index);
	void addShape();
	void generateShape();
	
};

ShapesContainer::ShapesContainer(int numberShapes, double dimBoite) 
{
	this->_numberShapes = numberShapes;
	this->_dimBoite = dimBoite;
	_scalingFactor = pow(_dimBoite, 3) / (49*_numberShapes);
	generateShapes();
}

void ShapesContainer::generateShapes() 
{

	for (int index = 0; index < _numberShapes; index++)
	{
		generateShape();
	}
}

void ShapesContainer::generateShape()
 {
	Shapelist type = Shapelist(rand() % Shapelist::Cylindre + 1);
	glm::vec4 color(randFloat(0, 1), randFloat(0, 1), randFloat(0, 1), 1);

	glm::vec3 translateShape(0, 0, 0);
	randCoords(&translateShape);

	glm::vec3 RotateShape(randFloat(0, 1), randFloat(0, 1), randFloat(0, 1));

	GLfloat scaleShape = randFloat(0.5*_scalingFactor, 1.5*_scalingFactor);
	Shape *newShape = new Shape(type, translateShape, color, randFloat(0, 360), RotateShape, scaleShape);
	_shapes.push_back(newShape);
}

ShapesContainer::~ShapesContainer() 
{
	while(!_shapes.empty())
	{
		Shape *shape = _shapes.back();
		delete shape;
		_shapes.pop_back();
	}
}

//fonction retournant un float aleatoire
//source : https://www.gamedev.net/forums/topic/41147-random-glfloat-value/
float ShapesContainer::randFloat(const float& min, const float& max)
{
	float range = max - min;
	float num = range * rand() / RAND_MAX;
	return (num + min);
}

void ShapesContainer::randCoords(glm::vec3 *coords) 
{
	do {
		coords->x = randFloat(-_dimBoite / 2, _dimBoite / 2);
		coords->y = randFloat(-_dimBoite  / 2, _dimBoite/ 2);
		coords->z = randFloat(0, _dimBoite - 1);
	} while (checkForCollision(coords));
}

bool ShapesContainer::checkForCollision(glm::vec3 *coords) 
{
	bool collision = false;
	double distance = 0;
	auto shape = begin(_shapes);
	for (int i = 0; shape != end(_shapes) && !collision; ++shape, ++i)
	{
		distance = pow((*shape)->coords_.x - coords->x, 2) + pow((*shape)->coords_.y - coords->y, 2)+ pow((*shape)->coords_.z - coords->z, 2);
		collision = distance < 12*_scalingFactor;
	}
	return collision;
}

std::vector<Shape*> ShapesContainer::getShapes() 
{
	return _shapes;
}

void ShapesContainer::modify() 
{
	for (int i = 0; i < 7; i++)
	{


		int index = rand() % this->_numberShapes;
		while (this->_shapes.at(index)->modified_) {
			index = rand() % this->_numberShapes;
		}
		Modifications mod = Modifications(rand() % (Modifications::DeleteObject + 1));
		switch (mod)
		{
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

void ShapesContainer::changeColor(int index) 
{
	glm::vec4 newColor(randFloat(0, 1), randFloat(0, 1), randFloat(0, 1), 1);
	while(this->_shapes.at(index)->baseColor_ == newColor) {
		glm::vec4 newColor(randFloat(0, 1), randFloat(0, 1), randFloat(0, 1), 1);
	}
	this->_shapes.at(index)->ChangeColor(newColor);
}

void ShapesContainer::deleteShape(int index) 
{
	this->_shapes.at(index)->disappear();
}

void ShapesContainer::addShape() 
{
	generateShape();
	this->_shapes.at(this->_numberShapes)->modified_ = true;
	this->_numberShapes++;
}