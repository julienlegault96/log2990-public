#pragma once
#include "Shape.h"
#include <math.h>
class ShapesContainer {
public:
	
	ShapesContainer(int numberShapes, double dimBoite);
	std::vector<Shape*> getShapes();
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
		Shapelist type = Shapelist(rand() % Shapelist::Cylindre+1);
		glm::vec3 ColorShpere(randFloat(0, 1), randFloat(0, 1), randFloat(0, 1));

		glm::vec3 translateSphere(0,0,0);
		randCoords(&translateSphere);

		glm::vec3 RotateSphere(randFloat(0, 1), randFloat(0, 1),
			randFloat(0, 1));

		GLfloat scaleSphere = randFloat(0.5*scalingFactor, 1.5*scalingFactor);
		Shape *newShape = new Shape(type, translateSphere, ColorShpere, randFloat(0, 360), RotateSphere, scaleSphere);
		shapes_.push_back(newShape);
	}
}
ShapesContainer::~ShapesContainer() {}
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