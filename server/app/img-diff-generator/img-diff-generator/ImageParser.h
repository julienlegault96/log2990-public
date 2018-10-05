#pragma once

#include <iostream>
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
	const unsigned HEADER_SIZE = 54;
	const unsigned BIT_DEPTH = 24;

	const Image getImage(const unsigned char * data);
	const Image parseData(const unsigned & height, const unsigned & width, const unsigned char * imageData);

	const unsigned getHeight(const unsigned char * header);
	const unsigned getWidth(const unsigned char * header);

	const bool isValidBitDepth(const unsigned char * header);
	const bool isBmpFile(const string & filename);

};