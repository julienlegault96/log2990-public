#include "Drawer.h"



Drawer::Drawer()
{
	objectLoc_ = new ObjectLoc();
}

Drawer::Drawer(const GLuint & prog, MatricePipeline * matrModel, MatricePipeline * matrVisu, MatricePipeline * matrProj)
	:matrModel_(matrModel), matrVisu_(matrVisu), matrProj_(matrProj)
{
	objectLoc_ = new ObjectLoc();
	extractObjetLoc(prog);
}


Drawer::~Drawer()
{
	delete objectLoc_;
	objectLoc_ = nullptr;
}

void Drawer::draw(const Shape * shape) const
{
	if (shape->isVisible())
	{
		glVertexAttrib4f(objectLoc_->locColor, shape->getColor().r, shape->getColor().b, shape->getColor().g, shape->getColor().a);
		matrModel_->PushMatrix(); {
			matrModel_->Translate(shape->getCoordinates());
			matrModel_->Scale(shape->getScale());
			matrModel_->Rotate(shape->getRotation(), shape->getRotationAxis());
			glUniformMatrix4fv(objectLoc_->locmatrModel, 1, GL_FALSE, *matrModel_);
			glUniformMatrix3fv(objectLoc_->locmatrNormale, 1, GL_TRUE, glm::value_ptr(glm::inverse(glm::mat3(matrVisu_->getMatr() * matrModel_->getMatr()))));
			shape->show();
		}matrModel_->PopMatrix();
	}
}

void Drawer::draw(const CompositeShape * compositeShape) const
{
	matrModel_->PushMatrix(); {
		matrModel_->Translate(compositeShape->getCoordinates());
		matrModel_->Scale(compositeShape->getScale());
		matrModel_->Rotate(compositeShape->getRotation(), compositeShape->getRotationAxis());
		glUniformMatrix4fv(objectLoc_->locmatrModel, 1, GL_FALSE, *matrModel_);
		glUniformMatrix3fv(objectLoc_->locmatrNormale, 1, GL_TRUE, glm::value_ptr(glm::inverse(glm::mat3(matrVisu_->getMatr() * matrModel_->getMatr()))));
		for (AbstractShape* shape : compositeShape->getShapes()) 
		{
			shape->accept(this);
		}
	}matrModel_->PopMatrix();
}

void Drawer::extractObjetLoc(const GLuint &prog)
{
	objectLoc_->extractLoc(prog);
}

void Drawer::setMatrModel(MatricePipeline * matrModel)
{
	matrModel_ = matrModel;
}

void Drawer::setmatrVisu(MatricePipeline * matrVisu)
{
	matrVisu_ = matrVisu;
}

void Drawer::setmatrProj(MatricePipeline * matrProj)
{
	matrProj_ = matrProj_;
}

