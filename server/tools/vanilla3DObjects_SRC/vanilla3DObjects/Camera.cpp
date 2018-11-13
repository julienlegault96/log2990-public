#include"Camera.h"

Camera::Camera(): theta_(INITIAL_THETA), previousTheta_(INITIAL_THETA), phi_(INITIAL_PHI), previousPhi_(INITIAL_PHI), dist_(INITIAL_DISTANCE) {}

void Camera::executeChanges(MatricePipeline& matrVisu)
{
    matrVisu.LookAt(dist_*cos(glm::radians(theta_))*sin(glm::radians(phi_)),
        dist_*sin(glm::radians(theta_))*sin(glm::radians(phi_)),
        dist_*cos(glm::radians(phi_)) + 5.,
        0., 0., 5.,
        0., 0., 1.
    );

}

void Camera::validateAngles()
{
    if (phi_ > MAXIMUM_PHI) { phi_ = MAXIMUM_PHI; } else if (phi_ < MINIMUM_PHI) { phi_ = MINIMUM_PHI; }
    if (theta_ > 360.0) { theta_ -= 360.0; } else if (theta_ < 0.0) { theta_ += 360.0; }
}

void Camera::randomTurn()
{
    previousPhi_ = phi_;
    previousTheta_ = theta_;
    phi_ = glm::mix(0, 360, rand() / ((double)RAND_MAX));
    theta_ = glm::mix(0.1, 180 - 0.1, rand() / ((double)RAND_MAX));
    validateAngles();
}

void Camera::turn(double phi, double theta)
{
    previousPhi_ = phi_;
    previousTheta_ = theta_;
    phi_ = phi;
    theta_ = theta;
    validateAngles();
}

void Camera::incrAngles(double phiDelta, double thetaDelta)
{
    previousPhi_ = phi_;
    previousTheta_ = theta_;
    phi_ += phiDelta;
    theta_ += thetaDelta;
    validateAngles();
}

void Camera::unturn()
{
    double phiBuf = phi_;
    double thetaBuf = theta_;
    phi_ = previousPhi_;
    theta_ = previousTheta_;
    previousPhi_ = phiBuf;
    previousTheta_ = thetaBuf;
    validateAngles();
}

void Camera::setDistance(double distance)
{
    dist_ = distance;
}

double Camera::getDistance() 
{
    return dist_;
}

void Camera::incrDistance(double delta)
{
    dist_ += delta;
}
