#pragma once

#include <vector>
#include "Pixel.h"

using namespace std;

class Image
{
public:
	Image(const unsigned & height, const unsigned & width);

private:
	vector<vector<Pixel>> pixels;

};