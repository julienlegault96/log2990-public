#pragma once

#include <iostream>
#include <fstream>
#include <string>
#include "Image.h"
#include "base64.h"

using namespace std;

class ImageParser
{
public:
	ImageParser();

	const Image getImageFromUrl(const char * filename) const;
	const Image getImageFromBase64(const char * data64) const;

private:
	const Image getImage(const unsigned char * data) const;
	const Image parseData(const unsigned & height, const unsigned & width, const unsigned char * imageData) const;

	const unsigned getHeight(const unsigned char * header) const;
	const unsigned getWidth(const unsigned char * header) const;
	const unsigned getBitDepth(const unsigned char * header) const;

	const bool isBmpFile(const string & filename) const;
	const bool isValidBitDepth(const unsigned char * header) const;
	const bool isValidHeight(const unsigned char * header) const;
	const bool isValidWidth(const unsigned char * header) const;

};