#include"Scene.h"

void Scene::accept(Drawer  *drawer)
{
	for(AbstractShape *shape : objects_  )
	{
		shape->accept(drawer);
	}
}
Scene::Scene(int numberShapes, bool theme)
{
    if (numberShapes < MIN_OBJECT_AMOUNT || numberShapes > MAX_OBJECT_AMOUNT) {
        throw std::invalid_argument("the amount of objects you can ask of the program must be between 10 and 200");
    }

    if (theme) {
        factory_ = new ThemeFactory(numberShapes);
    }
    else {
        factory_ = new GeoFactory(numberShapes);
    }
    factory_->generateShapes(&objects_);
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
        int index = rand() % factory_->getNumberOfObjects();
        // only modify unmodified shapes
        while (objects_.at(index)->isModded()) {
            index = rand() % factory_->getNumberOfObjects();
        }

        Modifications mod = Modifications(rand() % (Modifications::DeleteObject + 1));
        // only do unbanned modifications
        while (_banString.length() != 0
            && _banString.find(std::to_string(mod)) != std::string::npos) {
            mod = Modifications(rand() % (Modifications::DeleteObject + 1));
        }

        switch (mod) {
        case ColorChange:
            setColor(index);
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

void Scene::setColor(int index) {
	glm::vec4 newColor;
    do {
        newColor = glm::vec4(factory_->generateFloat(0, 1), factory_->generateFloat(0, 1), factory_->generateFloat(0, 1), 1);
    } while (objects_.at(index)->getColor() == newColor);
    objects_.at(index)->setColor(newColor);
}

void Scene::deleteShape(int index) {
    objects_.at(index)->hide();
    factory_->decrNumberOfObjects();
}

void Scene::addShape() {
    factory_->addShape(&objects_);
}