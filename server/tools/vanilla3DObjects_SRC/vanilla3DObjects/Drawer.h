#ifndef DRAWER_H
#define DRAWER_H
#include "inf2705-matrice.h"
#include "Shape.h"
#include "CompositeShape.h"
#include "ObjectLoc.h"

//circular reference workaround
class Shape;
class CompositeShape;

class Drawer
{
public:
    Drawer();
	Drawer(const GLuint &prog, MatricePipeline * matrModel, MatricePipeline * matrVisu, MatricePipeline * matrProj);
    ~Drawer();
    void draw(const Shape * shape) const ;
	void draw(const CompositeShape * compositeShape) const;
	void extractObjetLoc(const GLuint &prog);
	void setMatrModel(MatricePipeline * matrModel);
	void setmatrVisu(MatricePipeline * matrVisu);
	void setmatrProj(MatricePipeline * matrProj);
private:
	ObjectLoc *objectLoc_;
	//aggregation
	MatricePipeline * matrModel_;
	MatricePipeline * matrVisu_;
	MatricePipeline * matrProj_;
};
#endif
