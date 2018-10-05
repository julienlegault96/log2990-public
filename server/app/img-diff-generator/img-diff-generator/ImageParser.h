#pragma once

#include <iostream>
#include <string>
#include "Image.h"

using namespace std;

class ImageParser
{
public:
	ImageParser();

	const Image getImageFromUrl(const string & filename) const;
	const Image getImageFromBase64(const string & data64) const;

private:
	const unsigned
		HEADER_SIZE = 54,
		BIT_DEPTH = 24,
		IMAGE_HEIGHT = 8, // 480,
		IMAGE_WIDTH = 8; // 640;

	const Image getImage(const unsigned char * data) const;
	const Image parseData(const unsigned & height, const unsigned & width, const unsigned char * imageData) const;

	const unsigned getHeight(const unsigned char * header) const;
	const unsigned getWidth(const unsigned char * header) const;

	const bool isBmpFile(const string & filename) const;
	const bool isValidBitDepth(const unsigned char * header) const;

	const bool isValidHeight(const unsigned char * header) const;
	const bool isValidWidth(const unsigned char * header) const;

};