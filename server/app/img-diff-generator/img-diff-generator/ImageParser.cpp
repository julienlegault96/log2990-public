#include "ImageParser.h"

ImageParser::ImageParser()
{
}

const Image ImageParser::getImageFromUrl(const string & filename)
{
	if (!this->isBmpFile(filename))
	{
		throw std::invalid_argument("File has to be .bmp");
	}

	FILE * file;

	if (fopen_s(&file, filename.data(), "rb"))
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
	if (!this->isValidBitDepth(data))
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
			unsigned position = (x + y * width) * 3 + (y * width) % 4;
			unsigned char
				blue = imageData[position],
				green = imageData[position + 1],
				red = imageData[position + 2];

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

const bool ImageParser::isValidBitDepth(const unsigned char * header)
{
	return header[28] == this->BIT_DEPTH;
}

const bool ImageParser::isBmpFile(const string & filename)
{
	if (filename.length() < 4)
	{
		return false;
	}

	return filename.compare(filename.size() - 4, 4, ".bmp") == 0;
}
