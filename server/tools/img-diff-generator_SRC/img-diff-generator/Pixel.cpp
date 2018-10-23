#include "Pixel.h"

Pixel::Pixel() : _red(255), _green(255), _blue(255)
{
}

Pixel::Pixel(const unsigned char & r, const unsigned char & g, const unsigned & b) : _red(r), _green(g), _blue(b)
{
}

const bool Pixel::operator==(const Pixel & pixel) const
{
	return 
		this->_red == pixel._red
		&& this->_green == pixel._green
		&& this->_blue == pixel._blue;
}

const bool Pixel::operator!=(const Pixel & pixel) const
{
	return !(*this == pixel);
}
