#include "ImageParser.h"

ImageParser::ImageParser()
{
}

const Image ImageParser::getImageFromUrl(const char * filename) const
{
	if (!this->isBmpFile(filename))
	{
		throw std::invalid_argument("File has to be .bmp");
	}

	FILE * file;

	if (fopen_s(&file, filename, "rb"))
	{
		throw std::runtime_error("File opening error");
	}

	// https://stackoverflow.com/questions/14002954/c-programming-how-to-read-the-whole-file-contents-into-a-buffer
	fseek(file, 0, SEEK_END);
	long fileSize = ftell(file);
	fseek(file, 0, SEEK_SET);

	unsigned char * data = new unsigned char [fileSize + 1];
	fread(data, fileSize, 1, file);
	fclose(file);

	Image image = getImage(data);

	delete[] data;
	data = nullptr;

	return image;
}

const Image ImageParser::getImageFromBase64(const char * data64) const
{
	// TODO
	return Image(0, 0);
}

const Image ImageParser::getImage(const unsigned char * data) const
{
	if (!isValidBitDepth(data))
	{
		throw std::invalid_argument(
			"Invalid bmp bit depth, expected " +
			to_string(DEFAULT_24BIT_BMP_HEADER.biBitCount) +
			" but got " +
			to_string(getBitDepth(data))
		);
	}

	if (!isValidHeight(data) || !isValidWidth(data))
	{
		throw std::invalid_argument(
			"Invalid image size, expected " +
			to_string(DEFAULT_24BIT_BMP_HEADER.biWidth) + " x " + to_string(DEFAULT_24BIT_BMP_HEADER.biHeight) +
			" but got " +
			to_string(getWidth(data)) + " x " + to_string(getHeight(data))
		);
	}

	return 
		parseData(
			getHeight(data),
			getWidth(data),
			data + DEFAULT_24BIT_BMP_HEADER.bfOffBits
		);
}

const Image ImageParser::parseData(const unsigned & height, const unsigned & width, const unsigned char * imageData) const
{
	Image image(width, height);

	// https://stackoverflow.com/questions/9296059/read-pixel-value-in-bmp-file
	for (unsigned y = 0; y < height; ++y)
	{
		for (unsigned x = 0; x < width; ++x)
		{
			unsigned position = (x + y * width) * 3 + (y * width) % 4;
			unsigned char
				blue = imageData[position],
				green = imageData[position + 1],
				red = imageData[position + 2];

			Pixel pixel(red, green, blue);
			image.setPixel(x, y, pixel);
		}
	}

	return image;
}

const unsigned ImageParser::getHeight(const unsigned char * header) const
{
	// little endian, offsets 22 to 25
	return header[25] << 8 | header[24] << 8 | header[23] << 8 | header[22];
}

const unsigned ImageParser::getWidth(const unsigned char * header) const
{
	// little endian, offsets 18 to 21
	return header[21] << 8 | header[20] << 8 | header[19] << 8 | header[18];
}

const unsigned ImageParser::getBitDepth(const unsigned char * header) const
{
	return header[29] << 8 | header[28];
}

const bool ImageParser::isBmpFile(const string & filename) const
{
	if (filename.length() < 4)
	{
		return false;
	}

	return filename.compare(filename.size() - 4, 4, ".bmp") == 0;
}

const bool ImageParser::isValidBitDepth(const unsigned char * header) const
{
	return getBitDepth(header) == DEFAULT_24BIT_BMP_HEADER.biBitCount;
}

const bool ImageParser::isValidHeight(const unsigned char * header) const
{
	return getHeight(header) == DEFAULT_24BIT_BMP_HEADER.biHeight;
}

const bool ImageParser::isValidWidth(const unsigned char * header) const
{
	return getWidth(header) == DEFAULT_24BIT_BMP_HEADER.biWidth;
}
