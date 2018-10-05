#include "ImageParser.h"

ImageParser::ImageParser()
{
}

const Image ImageParser::getImageFromUrl(const string & filename)
{
	return Image(0, 0);
}

const Image ImageParser::getImageFromBase64(const string & data64)
{
	return Image(0, 0);
}

const Image ImageParser::getImage(const unsigned char * data)
{
	return Image(0, 0);
}

const unsigned ImageParser::getHeight(const unsigned char * header)
{
	return 0;
}

const unsigned ImageParser::getWidth(const unsigned char * header)
{
	return 0;
}

const bool ImageParser::is24Bit(const unsigned char * header)
{
	return false;
}
