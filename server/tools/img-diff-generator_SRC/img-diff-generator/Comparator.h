#pragma once

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <utility>
#include "ImageParser.h"
#include "Image.h"

using namespace std;

class Comparator
{
public:
	Comparator();

	void compare(const char* filename1, const char* filename2);
	void InterpretOptionStrings(const char* partialString);
	void saveDiffTo(const char* filename) const;

private:
	const Pixel DIFF_PIXEL = Pixel(0, 0, 0);
	const vector<pair<int, int>> CIRCLE_STENCIL = {
							{-1,  3}, {0,  3}, {1,  3},
				  {-2,  2}, {-1,  2}, {0,  2}, {1,  2}, {2,  2},
		{-3,  1}, {-2,  1}, {-1,  1}, {0,  1}, {1,  1}, {2,  1}, {3,  1},
		{-3,  0}, {-2,  0}, {-1,  0}, {0,  0}, {1,  0}, {2,  0}, {3,  0},
		{-3, -1}, {-2, -1}, {-1, -1}, {0, -1}, {1, -1}, {2, -1}, {3, -1},
				  {-2, -2}, {-1, -2}, {0, -2}, {1, -2}, {2, -2},
							{-1, -3}, {0, -3}, {1, -3}
	};
	const string EXPECTED_PARTIAL_OPTION_STRING = "-partiel";

	bool partialDiff;
	Image differenceImage;
	void enlargeErrorZone(const int32_t x, const int32_t y);

};
