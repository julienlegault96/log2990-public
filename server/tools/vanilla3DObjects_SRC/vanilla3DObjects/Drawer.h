#pragma once
#include "ObjetLoc.h"
#include "AbstractShape.h"
#include "Scene.h"

class Drawer
{
public:
    Drawer();
    ~Drawer();
    void visit(const AbstractShape& shape);
    void visit(const Scene& scene)
private:
};

