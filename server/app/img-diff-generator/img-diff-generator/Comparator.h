#pragma once

#include <string>
#include "ImageParser.h"
#include "Image.h"

using namespace std;

class Comparator
{
public:
	Comparator();

	void exec(const string & filename1, const string & filename2);

	const void save(const string & filename);

private:
	const unsigned
		IMAGE_HEIGHT = 480,
		IMAGE_WIDTH = 640;

	Image differenceImage;

};
