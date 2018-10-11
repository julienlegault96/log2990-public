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
	std::vector<Shape*> shapes_;
	double const MIN_DISTANCE = 6;
	double scalingFactor = 1;
	double dimBoite_;
	int numberShapes_ = 0;
	void generateShapes();
	float randFloat(const float& min, const float& max);
	void randCoords(glm::vec3 *coords);
	bool checkForCollision(glm::vec3 *coords);
	void changeColor(int index);
	void deleteShape(int index);
	void addShape();
	void generateShape();
	
};
ShapesContainer::ShapesContainer(int numberShapes, double dimBoite) {
	this->numberShapes_ = numberShapes;
	this->dimBoite_ = dimBoite;
	scalingFactor = pow(dimBoite_, 3) / (36*numberShapes_);
	generateShapes();
}
void ShapesContainer::generateShapes() {

	for (int index = 0; index < numberShapes_; index++)
	{
		generateShape();
	}
}

void ShapesContainer::generateShape() {
	Shapelist type = Shapelist(rand() % Shapelist::Cylindre + 1);
	glm::vec4 color(randFloat(0, 1), randFloat(0, 1), randFloat(0, 1), 1);

	glm::vec3 translateShape(0, 0, 0);
	randCoords(&translateShape);

	glm::vec3 RotateShape(randFloat(0, 1), randFloat(0, 1), randFloat(0, 1));

	GLfloat scaleShape = randFloat(0.5*scalingFactor, 1.5*scalingFactor);
	Shape *newShape = new Shape(type, translateShape, color, randFloat(0, 360), RotateShape, scaleShape);
	shapes_.push_back(newShape);
}
ShapesContainer::~ShapesContainer() {
	while(!shapes_.empty())
	{
		Shape *shape = shapes_.back();
		delete shape;
		shapes_.pop_back();
	}
}
//fonction retournant un float aleatoire
//source : https://www.gamedev.net/forums/topic/41147-random-glfloat-value/
float ShapesContainer::randFloat(const float& min, const float& max) {
	float range = max - min;
	float num = range * rand() / RAND_MAX;
	return (num + min);
}
void ShapesContainer::randCoords(glm::vec3 *coords) {
	do {
		coords->x = randFloat(-dimBoite_ / 2, dimBoite_ / 2);
		coords->y = randFloat(-dimBoite_  / 2, dimBoite_/ 2);
		coords->z = randFloat(0, dimBoite_ - 1);
	} while (checkForCollision(coords));
}

bool ShapesContainer::checkForCollision(glm::vec3 *coords) {
	bool collision = false;
	double distance = 0;
	auto shape = begin(shapes_);
	for (int i = 0; shape != end(shapes_) && !collision; ++shape, ++i)
	{
		distance = pow((*shape)->coords_.x - coords->x, 2) + pow((*shape)->coords_.y - coords->y, 2)+ pow((*shape)->coords_.z - coords->z, 2);
		collision = distance < 12*scalingFactor;
	}
	return collision;
}

std::vector<Shape*> ShapesContainer::getShapes() {
	return shapes_;
}

void ShapesContainer::modify() {
	int index = rand() % this->numberShapes_;
	while (this->shapes_.at(index)->modified_) {
		index = rand() % this->numberShapes_ ;
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

void ShapesContainer::changeColor(int index) {
	glm::vec4 newColor(randFloat(0, 1), randFloat(0, 1), randFloat(0, 1), 1);
	while(this->shapes_.at(index)->baseColor_ == newColor) {
		glm::vec4 newColor(randFloat(0, 1), randFloat(0, 1), randFloat(0, 1), 1);
	}
	this->shapes_.at(index)->ChangeColor(newColor);
}
void ShapesContainer::deleteShape(int index) {
	this->shapes_.at(index)->disappear();
}

void ShapesContainer::addShape() {
	generateShape();
	this->shapes_.at(this->numberShapes_)->modified_ = true;
	this->numberShapes_++;
}