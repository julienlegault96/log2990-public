#include "ImageParser.h"

ImageParser::ImageParser()
{
}

const Image ImageParser::getImageFromUrl(const char * filename) const
{
	if (!isBmpFile(filename))
	{
		throw std::invalid_argument("File has to be .bmp");
	}

	ifstream file(filename, ios::in | ios::ate | ios::binary);
	if (!file.is_open())
	{
		throw std::runtime_error("Could not open \"" + string(filename) + "\" for input");
	}

	long fileSize = file.tellg();
	file.seekg(0);

	char * data = new char [fileSize + 1];
	file.read(data, fileSize);
	file.close();

	Image image = getImage((const unsigned char *)data);

	delete[] data;
	data = nullptr;

	return image;
}

const Image ImageParser::getImageFromBase64(const char * data64) const
{
	size_t len = strlen(data64);
	string res = base64().decode(data64, len);
	const unsigned char * data = reinterpret_cast<const unsigned char*>(res.c_str());

	return getImage(data);
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
			// saved in bgr order
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
