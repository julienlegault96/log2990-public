#include"Camera.h"

Camera::Camera(): theta(INITIAL_THETA), previousTheta(INITIAL_THETA), phi(INITIAL_PHI), previousPhi(INITIAL_PHI), dist(INITIAL_DISTANCE) {}

void Camera::executeChanges(MatricePipeline& matrVisu)
{
    matrVisu.LookAt(dist*cos(glm::radians(theta))*sin(glm::radians(phi)),
        dist*sin(glm::radians(theta))*sin(glm::radians(phi)),
        dist*cos(glm::radians(phi)) + 5.,
        0., 0., 5.,
        0., 0., 1.
    );

}

void Camera::validateAngles()
{
    if (phi > MAXIMUM_PHI) { phi = MAXIMUM_PHI; } else if (phi < MINIMUM_PHI) { phi = MINIMUM_PHI; }
    if (theta > 360.0) { theta -= 360.0; } else if (theta < 0.0) { theta += 360.0; }
}

void Camera::randomTurn()
{
    previousPhi = phi;
    previousTheta = theta;
    phi = glm::mix(0, 360, rand() / ((double)RAND_MAX));
    theta = glm::mix(0.1, 180 - 0.1, rand() / ((double)RAND_MAX));
    validateAngles();
}

void Camera::turn(double phi, double theta)
{
    this->previousPhi = this->phi;
    this->previousTheta = this->theta;
    this->phi = phi;
    this->theta = theta;
    validateAngles();
}

void Camera::incrAngles(double phiDelta, double thetaDelta)
{
    this->previousPhi = this->phi;
    this->previousTheta = this->theta;
    this->phi += phiDelta;
    this->theta += thetaDelta;
    validateAngles();
}

void Camera::unturn()
{
    previousPhi = phi;
    previousTheta = theta;
    phi = previousPhi;
    theta = previousTheta;
    validateAngles();
}

void Camera::setDistance(double distance)
{
    dist = distance;
}

double Camera::getDistance() 
{
    return dist;
}

void Camera::incrDistance(double delta)
{
    dist += delta;
}
