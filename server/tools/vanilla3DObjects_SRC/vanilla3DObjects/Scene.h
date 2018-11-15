#ifndef SCENE_H
#define SCENE_H

#include <cmath>
#include <string>
#include <vector>
#include <glm/vec3.hpp>
#include <glm/vec4.hpp>
#include "Default3DProgramState.h"
#include "AbstractShape.h"
#include "AbstractFactory.h"
#include "GeoFactory.h"
#include "ThemeFactory.h"

class Drawer;
enum Modifications { ColorChange, AddObject, DeleteObject};
class Scene {
public:
	Scene(int numberShapes, bool theme);
	~Scene();
	void modify();
	void parseModOptions(const std::string &optionString);
	std::vector<AbstractShape*> getObjects() const;
	void accept(Drawer *visitor);

private:
    short const MOD_COUNT = 7;
    short const MIN_OBJECT_AMOUNT = 10;
    short const MAX_OBJECT_AMOUNT = 200;
    const char ADD_PARAMETER = 'a';
    const char SUP_PARAMETER = 's';
    const char COL_PARAMETER = 'c';
    
    std::string _banString;
    AbstractFactory *factory_;
    std::vector<AbstractShape*> objects_ = {};

	void changeColor(int index);
	void deleteShape(int index);
	void addShape();
};

#endif