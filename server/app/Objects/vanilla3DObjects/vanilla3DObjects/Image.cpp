#include "Image.h"

Image::Image(const unsigned width, const unsigned height) : pixels(height, vector<Pixel>(width))
{
}

const Pixel Image::getPixel(const unsigned & x, const unsigned & y) const
{
	if (x >= pixels[0].size() || x < 0
		|| y >= pixels.size() || y < 0)
	{
		throw std::out_of_range(
			"Out of image coordinates, tried to get pixel at (" + to_string(x) + "," + to_string(y) + ")" +
			" when max (x,y) are (" + to_string(pixels[0].size() - 1) + "," + to_string(pixels.size() - 1) + ")"
		);
	}

	return pixels[y][x];
}

const vector<vector<Pixel>> Image::getPixels() const
{
	return pixels;
}

void Image::setPixel(const unsigned x, const unsigned y, const Pixel & pixel)
{
	if (x >= pixels[0].size() || x < 0
		|| y >= pixels.size() || y < 0)
	{
		throw std::out_of_range(
			"Out of image coordinates, tried to set pixel at (" + to_string(x) + "," + to_string(y) + ")" +
			" when max (x,y) are (" + to_string(pixels[0].size() - 1) + "," + to_string(pixels.size() - 1) + ")"
		);
	}

	pixels[y][x] = pixel;
	if (colorsUsed.find({ (char)pixel.r,(char)pixel.g, (char)pixel.b }) == colorsUsed.end()) {
		string key = { (char)pixel.r,(char)pixel.g, (char)pixel.b };
		colorsUsed.emplace(key, false);
	}


}

ostream& operator<<(ostream & stream, const Image & image)
{
	vector<vector<Pixel>> pixels(image.getPixels());
	char * memblock;

	for (vector<Pixel> line : pixels)
	{
		memblock = new char[line.size() * 3];
		int count = 0;

		for (Pixel pixel : line)
		{
			// saved in reverse order
			memblock[count * 3] = pixel.b;
			memblock[count * 3 + 1] = pixel.g;
			memblock[count * 3 + 2] = pixel.r;

			++count;
		}
		stream.write(memblock, line.size() * 3);

		delete[] memblock;
		memblock = nullptr;
	}

	return stream;
}