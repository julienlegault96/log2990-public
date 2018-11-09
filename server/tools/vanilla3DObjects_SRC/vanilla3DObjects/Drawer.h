#ifndef DRAWER_H
#define DRAWER_H
#include "ObjetLoc.h"
#include "Shape.h"
#include "CompositeShape.h"

class Shape;
class CompositeShape;
class Drawer
{
public:
    Drawer();
    ~Drawer();
    void draw(const Shape &shape);
	void draw(const CompositeShape &compositeShape);
};
#endif
