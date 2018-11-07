#pragma once

#include <cmath>
#include <string>
#include <vector>
#include <glm/vec3.hpp>
#include <glm/vec4.hpp>
#include "Default3DProgramState.h"
#include "AbstractShape.h"
#include "AbstractFactory.h"
#include "Drawer.h"


enum Modifications { ColorChange, AddObject, DeleteObject};
class Scene {
public:
  Scene(int numberShapes, bool theme);
  ~Scene();
  void modify();
  void parseModOptions(const std::string &optionString);
  std::vector<AbstractShape*> getObjects() const;
  bool isThematic() const;
  void accept(Drawer& visitor);

private:
    short const MOD_COUNT = 7;
    const char ADD_PARAMETER = 'a';
    const char SUP_PARAMETER = 's';
    const char COL_PARAMETER = 'c';
    std::string _banString;
    AbstractFactory* factory_;
    std::vector<AbstractShape*> objects_ = {};
    bool theme_;
    int numberShapes_ = 0;
	double dimBoite_;

	void changeColor(int index);
	void deleteShape(int index);
	void addShape();
};