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
	if (!this->is24Bit(data))
	{
		throw std::runtime_error("Invalid bmp bit depth");
	}

	return 
		this->parseData(
			this->getHeight(data),
			this->getWidth(data),
			data + this->HEADER_SIZE
		);
}

const Image ImageParser::parseData(const unsigned & height, const unsigned & width, const unsigned char * imageData)
{
	Image image(height, width);

	// https://stackoverflow.com/questions/9296059/read-pixel-value-in-bmp-file
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
