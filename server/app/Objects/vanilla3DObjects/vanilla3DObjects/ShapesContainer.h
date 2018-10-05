#pragma once
#include "Shape.h"
class ShapesContainer {
public:
	
	ShapesContainer(int numberShapes, double dimBoite);

	~ShapesContainer();
private:
	std::vector<Shape*> shapes_;
	double dimBoite_;
	int numberShapes_ = 0;
	void generateShapes();
	float randFloat(const float& min, const float& max);
	void randCoords(glm::vec3 *coords);
	
};
ShapesContainer::ShapesContainer(int numberShapes, double dimBoite) {
	this->numberShapes_ = numberShapes;
	this->dimBoite_ = dimBoite;
}
void ShapesContainer::generateShapes() {
	for (int index = 0; index < numberShapes_; index++)
	{
		Shapelist type = Shapelist(rand() % Shapelist::Cylindre);
		glm::vec3 ColorShpere(randFloat(0, 1), randFloat(0, 1), randFloat(0, 1));

		glm::vec3 translateSphere(randFloat(-dimBoite_ / 2, dimBoite_ / 2),
			randFloat(-dimBoite_ / 2, dimBoite_ / 2),
			randFloat(0, dimBoite_ - 1));

		glm::vec3 RotateSphere(randFloat(0, 1), randFloat(0, 1),
			randFloat(0, 1));

		GLfloat scaleSphere = randFloat(0.5, 1.5);
		Shape *newShape = new Shape(type, translateSphere, ColorShpere, randFloat(0, 360), RotateSphere, scaleSphere);
		shapes_.push_back(newShape);
	}
}
ShapesContainer::~ShapesContainer() {}

float ShapesContainer::randFloat(const float& min, const float& max) {
	float range = max - min;
	float num = range * rand() / RAND_MAX;
	return (num + min);
}
void ShapesContainer::randCoords(glm::vec3 *coords) {
	coords->x = randFloat(-dimBoite_ / 3, dimBoite_ / 3);
	coords->y = randFloat(-dimBoite_ / 3, dimBoite_ / 3);
	coords->z = randFloat(0, dimBoite_);
}