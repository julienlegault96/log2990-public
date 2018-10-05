#pragma once

#include <vector>
#include <iomanip>
#include "Pixel.h"

using namespace std;

class Image
{
public:
	Image(const unsigned & height, const unsigned & width);

	const vector<vector<Pixel>> getPixels();
	void setPixel(const unsigned & x, const unsigned & y, const Pixel & pixel);

	friend ostream& operator<<(ostream & os, Image & image);

private:
	vector<vector<Pixel>> pixels;

};
