#pragma once

#include <string>
#include "Image.h"

using namespace std;

class ImageParser
{
public:
	ImageParser();

	const Image getImageFromUrl(const string & filename);
	const Image getImageFromBase64(const string & data64);

private:

	const Image getImage(const unsigned char * data);

	const unsigned getHeight(const unsigned char * header);
	const unsigned getWidth(const unsigned char * header);

	const bool is24Bit(const unsigned char * header);

};