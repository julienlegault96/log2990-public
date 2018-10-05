#pragma once

#include <vector>
#include "Pixel.h"

using namespace std;

class Image
{
public:
	Image(const unsigned & height, const unsigned & width);

	void setPixel(const unsigned & x, const unsigned & y, const Pixel & pixel);

private:
	vector<vector<Pixel>> pixels;

};