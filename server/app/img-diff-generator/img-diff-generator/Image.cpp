#include "Image.h"

Image::Image(const unsigned & height, const unsigned & width) : pixels(width, vector<Pixel>(height))
{
}

const vector<vector<Pixel>> Image::getPixels()
{
	return this->pixels;
}

void Image::setPixel(const unsigned & x, const unsigned & y, const Pixel & pixel)
{
	pixels[x][y] = pixel;
}

ostream& operator<<(ostream & os, Image & image)
{
	vector<vector<Pixel>> pixels(image.getPixels());
	for (int y = pixels[0].size() - 1; y >= 0; y--)
	{
		for (unsigned x = 0; x < pixels.size(); x++)
		{
			Pixel pixel(pixels[x][y]);
			os << setw(3) << setfill('0')
				<< (unsigned)pixel.r
				<< ", ";
			os << setw(3) << setfill('0')
				<< (unsigned)pixel.g
				<< ", ";
			os << setw(3) << setfill('0')
				<< (unsigned)pixel.b;
			os << "     ";
		}
		os << endl;
	}

	return os;
}

