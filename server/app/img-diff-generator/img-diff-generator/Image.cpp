#include "Image.h"

Image::Image(const unsigned & height, const unsigned & width) : pixels(width, vector<Pixel>(height))
{
}

void Image::setPixel(const unsigned & x, const unsigned & y, const Pixel & pixel)
{
	pixels[x][y] = pixel;
}
