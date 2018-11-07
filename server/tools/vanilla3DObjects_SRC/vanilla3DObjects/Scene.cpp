#include"Scene.h"
#include "GeoFactory.h"
#include "ThemeFactory.h"

bool Scene::isThematic() const
{
    return theme_;
}
Scene::Scene(int numberShapes, bool theme) : numberShapes_(numberShapes), theme_(theme)
{
    factory_ = theme_ ? ThemeFactory() : GeoFactory(objects_, dimBoite_);
    factory_->generateShapes(numberShapes_);
}

void Scene::parseModOptions(const std::string & optionString) {
    if (optionString.find(ADD_PARAMETER) == std::string::npos) { _banString.append(std::to_string((int)Modifications::AddObject)); }
    if (optionString.find(SUP_PARAMETER) == std::string::npos) { _banString.append(std::to_string((int)Modifications::DeleteObject)); }
    if (optionString.find(COL_PARAMETER) == std::string::npos) { _banString.append(std::to_string((int)Modifications::ColorChange)); }
}

Scene::~Scene() {
    objects_.clear();
}

std::vector<AbstractShape*> Scene::getObjects() const {
    return objects_;
}

void Scene::modify()
{
    if (_banString.length() == Modifications::DeleteObject + 1)
    {
        return /*all modifications banned*/;
    }
    for (int i = 0; i < MOD_COUNT; i++)
    {
        int index = rand() % this->numberShapes_;
        // only modify unmodified shapes
        while (this->objects_.at(index)->isModded()) {
            index = rand() % this->numberShapes_;
        }

        Modifications mod = Modifications(rand() % (Modifications::DeleteObject + 1));
        // only do unbanned modifications
        while (_banString.length() != 0
            && _banString.find(std::to_string(mod)) != std::string::npos) {
            mod = Modifications(rand() % (Modifications::DeleteObject + 1));
        }

        switch (mod) {
        case ColorChange:
            changeColor(index);
            break;

        case AddObject:
            addShape();
            break;

        case DeleteObject:
            deleteShape(index);
            break;
        }
    }
}

void Scene::changeColor(int index) {
    glm::vec4 newColor;
    do {
        newColor = glm::vec4(factory_->generateFloat(0, 1), factory_->generateFloat(0, 1), factory_->generateFloat(0, 1), 1);
    } while (this->objects_.at(index)->getColor() == newColor);
    objects_.at(index)->setColor(newColor);
}

void Scene::deleteShape(int index) {
    objects_.at(index)->hide();
}

void Scene::addShape() {
    factory_->generateShapes();
    objects_.at(numberShapes_++)->setModified();
}