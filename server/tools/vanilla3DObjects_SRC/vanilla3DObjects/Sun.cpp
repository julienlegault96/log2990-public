#include "Sun.h"
#include "Shape.h"

Sunny::Sunny(glm::vec3 coords, glm::vec3 rotationAxis, GLfloat rotation, GLfloat scale)
	: CompositeShape(coords, rotationAxis, rotation, scale)
{
	shapes_.push_back(
		new Shape(
			Shapelist::Sphere,
			GRIS_CLAIR_POUR_TEXTURES,
			coords_,
			rotationAxis_,
			rotation_,
			scale_ * (GLfloat) 1.0
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Tetrahedre,
			GRIS_CLAIR_POUR_TEXTURES,
			coords_ + glm::vec3(0.0, 0.0, scale_/2),
			rotationAxis_ + glm::vec3(0.0, 0.0, 7),
			rotation_,
			scale_* (GLfloat) 0.5
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Tetrahedre,
			GRIS_CLAIR_POUR_TEXTURES,
			coords_ + glm::vec3(0.0, -scale_ /2.5, 0.0),
			rotationAxis_ + glm::vec3(0.0, 0.0, 7),
			rotation_,
			scale_* (GLfloat) 0.5
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Tetrahedre,
			GRIS_CLAIR_POUR_TEXTURES,
			coords_ + glm::vec3(0.0, scale_ / 2.5, 0.0),
			rotationAxis_ + glm::vec3(0.0, 0.0, 7),
			rotation_,
			scale_* (GLfloat) 0.5
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Tetrahedre,
			GRIS_CLAIR_POUR_TEXTURES,
			coords_ + glm::vec3(scale_ /3, scale_ /4, 0.0),
			rotationAxis_ + glm::vec3(0.0, 0.0, 7),
			rotation_,
			scale_* (GLfloat) 0.5
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Tetrahedre,
			GRIS_CLAIR_POUR_TEXTURES,
			coords_ + glm::vec3(-scale_ / 5, -scale_ / 5, -scale_ / 5),
			rotationAxis_ + glm::vec3(0.0, 0.0, 7),
			rotation_,
			scale_* (GLfloat) 0.5
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Tetrahedre,
			GRIS_CLAIR_POUR_TEXTURES,
			coords_ + glm::vec3(scale_ / 5, -scale_ / 5, -scale_ / 5),
			rotationAxis_ + glm::vec3(0.0, 0.0, 7),
			rotation_,
			scale_* (GLfloat) 0.5
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Tetrahedre,
			GRIS_CLAIR_POUR_TEXTURES,			
			coords_ + glm::vec3(-scale_ / 4, -scale_ / 4, scale_ / 4),
			rotationAxis_ + glm::vec3(0.0, 0.0, 7),
			rotation_,
			scale_* (GLfloat) 0.5
		)
	);

	shapes_.push_back(
		new Shape(
			Shapelist::Tetrahedre,
			GRIS_CLAIR_POUR_TEXTURES,
			coords_ + glm::vec3(-scale_ / 4, scale_ / 4, scale_ / 4),
			rotationAxis_ + glm::vec3(0.0, 0.0, 7),
			rotation_,
			scale_* (GLfloat) 0.5
		)
	);



}
Sunny::~Sunny()
{
}