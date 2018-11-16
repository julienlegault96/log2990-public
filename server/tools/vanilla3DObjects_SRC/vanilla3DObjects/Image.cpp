#include "Image.h"

Image::Image(const unsigned width, const unsigned height) : _pixels(height, vector<Pixel>(width))
{
}

const Pixel Image::getPixel(const unsigned & x, const unsigned & y) const
{
	if (x >= _pixels[0].size() || x < 0
		|| y >= _pixels.size() || y < 0)
	{
		throw std::out_of_range(
			"Out of image coordinates, tried to get pixel at (" + to_string(x) + "," + to_string(y) + ")" +
			" when max (x,y) are (" + to_string(_pixels[0].size() - 1) + "," + to_string(_pixels.size() - 1) + ")"
		);
	}

	return _pixels[y][x];
}

const vector<vector<Pixel>> Image::getPixels() const
{
	return _pixels;
}

void Image::setPixel(const unsigned x, const unsigned y, const Pixel & pixel)
{
	if (x >= _pixels[0].size() || x < 0 
		|| y >= _pixels.size() || y < 0)
	{
		throw std::out_of_range(
			"Out of image coordinates, tried to set pixel at (" + to_string(x) + "," + to_string(y) + ")" +
			" when max (x,y) are (" + to_string(_pixels[0].size() - 1) + "," + to_string(_pixels.size() - 1) + ")"
		);
	}

	_pixels[y][x] = pixel;
}

ostream& operator<<(ostream & stream, const Image & image)
{
	const short PIXEL_BYTE_LENGTH = 3;
	vector<vector<Pixel>> pixels(image.getPixels());
	char * memblock;

	for (vector<Pixel> line : pixels)
	{
		memblock = new char[line.size() * PIXEL_BYTE_LENGTH];
		int count = 0;

		for ( Pixel pixel : line)
		{
			// saved in reverse order
			memblock[count * PIXEL_BYTE_LENGTH] = pixel._blue;
			memblock[count * PIXEL_BYTE_LENGTH + 1] = pixel._green;
			memblock[count * PIXEL_BYTE_LENGTH + 2] = pixel._red;

			++count;
		}
		stream.write(memblock, line.size() * PIXEL_BYTE_LENGTH);

		delete[] memblock;
		memblock = nullptr;
	}

	return stream;
}

