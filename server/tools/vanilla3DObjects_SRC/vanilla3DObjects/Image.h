#pragma once

#include <vector>
#include <iomanip>
#include <string>
#include "Pixel.h"
#include "ImageHeader.h"

using namespace std;

const static ImageHeader DEFAULT_24BIT_BMP_HEADER = ImageHeader();

class Image
{
public:
	Image(const unsigned height, const unsigned width);

	const Pixel getPixel(const unsigned & x, const unsigned & y) const;
	const vector<vector<Pixel>> getPixels() const;
	void setPixel(const unsigned x, const unsigned y, const Pixel & pixel);

	friend ostream& operator<<(ostream & os, const Image & image);

private:
	vector<vector<Pixel>> _pixels;

};
