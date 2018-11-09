#ifndef CAMERA_H
#define CAMERA_H

#include<glm/common.hpp>
#include<glm/trigonometric.hpp>
#include"inf2705-matrice.h"

class Camera
{
public:
    Camera();

    const double INITIAL_THETA = 0., INITIAL_PHI = 80., INITIAL_DISTANCE = 60.;
    const double MINIMUM_PHI = 0.01, MAXIMUM_PHI = 179.99;

    void executeChanges(MatricePipeline& matrVisu);

    void randomTurn();
    void turn(double phi, double theta);
    void incrAngles(double phiDelta, double thetaDelta);
    void unturn();

    void setDistance(double distance);
    double getDistance();
    void incrDistance(double delta);

private:
    void validateAngles();
    
    double theta;         // angle de rotation de la caméra (coord. sphériques)
    double phi;           // angle de rotation de la caméra (coord. sphériques)
    double previousTheta;
    double previousPhi;
    double dist;          // distance (coord. sphériques)
};

#endif