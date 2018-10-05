#include "Pixel.h"

Pixel::Pixel() : r(255), g(255), b(255)
{
}

Pixel::Pixel(const unsigned char & r, const unsigned char & g, const unsigned & b) : r(r), g(g), b(b)
{
}

const bool Pixel::operator==(const Pixel & pixel) const
{
	return 
		this->r == pixel.r
		&& this->g == pixel.g
		&& this->b == pixel.b;
}

const bool Pixel::operator!=(const Pixel & pixel) const
{
	return !(*this == pixel);
}
