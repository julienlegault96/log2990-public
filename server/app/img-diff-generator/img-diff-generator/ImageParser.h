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

};