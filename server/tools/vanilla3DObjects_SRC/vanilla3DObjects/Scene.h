#pragma once
#include <cmath>
#include <string>
#include <glm/vec3.hpp>
#include <glm/vec4.hpp>
#include "Shape.h"
#include "Planet.h"
#include <math.h>
enum Modifications { ColorChange, AddObject, DeleteObject};
class Scene {
public:
  Scene(int numberShapes, double dimBoite, bool theme);
  ~Scene();
  void modify();
  void parseModOptions(const std::string &optionString);
  std::vector<Shape*> getShapes() const;
  std::vector<Planet*> getPlanets() const;
  bool getTheme() const;

private:
	float const MIN_SIZE_MODIFIER = 0.5;
	float const MAX_SIZE_MODIFIER = 1.5;
    short const MOD_COUNT = 7;
	short const MIN_DISTANCE = 12;
	short const ALLOCATED_SHAPE_VOLUME = 49;
    const char ADD_PARAMETER = 'a';
    const char SUP_PARAMETER = 's';
    const char COL_PARAMETER = 'c';
    std::string _banString;
    std::vector<Shape*> _shapes = {};
    std::vector<Planet*> _planets = {};
    bool _theme;
    int _numberShapes = 0;
	double _scalingFactor = 1;
	double _dimBoite;

    void generateShapes();
    float randFloat(const float& min, const float& max) const;
	void randCoords(glm::vec3 *coords);
	bool checkForCollision(glm::vec3 *coords);
	void changeColor(int index);
	void deleteShape(int index);
	void addShape();
	void generateShape();
	void calculateScalingFactor();
};