#include "Pixel.h"

Pixel::Pixel() : red_(255), green_(255), blue_(255) { }

Pixel::Pixel(const unsigned char & r, const unsigned char & g, const unsigned & b) : red_(r), green_(g), blue_(b) { }

const bool Pixel::operator==(const Pixel & pixel) const
{
	return 
		this->red_ == pixel.red_
		&& this->green_ == pixel.green_
		&& this->blue_ == pixel.blue_;
}

const bool Pixel::operator!=(const Pixel & pixel) const
{
	return !(*this == pixel);
}
