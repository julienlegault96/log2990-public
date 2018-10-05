#include "ImageParser.h"

ImageParser::ImageParser()
{
}

const Image ImageParser::getImageFromUrl(const string & filename)
{
	FILE * file;
	errno_t err;

	if (err = fopen_s(&file, filename.data(), "rb"))
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

	Image image = this->getImage(data);

	delete[] data;
	data = nullptr;
	return image;
}

const Image ImageParser::getImageFromBase64(const string & data64)
{
	return Image(0, 0);
}

const Image ImageParser::getImage(const unsigned char * data)
{
	// https://stackoverflow.com/questions/9296059/read-pixel-value-in-bmp-file

	// header init
	const unsigned headerSize = 54;
	unsigned char * header = new unsigned char[headerSize];
	memcpy_s(header, headerSize, data, headerSize);

	if (!this->is24Bit(header))
	{
		throw std::runtime_error("Invalid bmp bit depth");
	}

	unsigned height = this->getHeight(header);
	unsigned width = this->getWidth(header);

	delete[] header;
	header = nullptr;

	// image data init
	int imageSize = 3 * width * height; // 3 bytes per pixels
	unsigned char * imageData = new unsigned char[imageSize];
	memcpy_s(imageData, imageSize, data + headerSize, imageSize);

	Image image = this->parseData(height, width, imageData);
	delete[] imageData;
	imageData = nullptr;

	return image;
}

const Image ImageParser::parseData(const unsigned & height, const unsigned & width, const unsigned char * imageData)
{
	Image image(height, width);

	for (unsigned x = 0; x < width; x++)
	{
		for (unsigned y = 0; y < height; y++)
		{
			unsigned char
				blue = imageData[(x + y * width) * 3],
				green = imageData[(x + y * width) * 3 + 1],
				red = imageData[(x + y * width) * 3 + 2];

			Pixel pixel = { red, green, blue };
			image.setPixel(x, y, pixel);
		}
	}

	return image;
}

const unsigned ImageParser::getHeight(const unsigned char * header)
{
	return header[22];
}

const unsigned ImageParser::getWidth(const unsigned char * header)
{
	return header[18];
}

const bool ImageParser::is24Bit(const unsigned char * header)
{
	return header[28] == 24;
}
