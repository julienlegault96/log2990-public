#pragma once

#include <iostream>
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

	void exec(const string & filename1, const string & filename2);

	const void save(const string & filename) const;

private:
	const unsigned
		IMAGE_HEIGHT = 8, // 480,
		IMAGE_WIDTH = 8; // 640;

	Image differenceImage;
	const vector<pair<int, int>> stencil = {
							{-1, 3},  {0, 3},  {1, 3},
				  {-2, 2},  {-1, 2},  {0, 2},  {1, 2},  {2, 2},
		{-3, 1},  {-2, 1},  {-1, 1},  {0, 1},  {1, 1},  {2, 1},  {3, 1},
		{-3, 0},  {-2, 0},  {-1, 0},  {0, 0},  {1, 0},  {2, 0},  {3, 0},
		{-3, -1}, {-2, -1}, {-1, -1}, {0, -1}, {1, -1}, {2, -1}, {3, -1},
				  {-2, -2}, {-1, -2}, {0, -2}, {1, -2}, {2, -2},
							{-1, -3}, {0, -3}, {1, -3}
	};

	const void fattify(const unsigned & x, const unsigned & y);

};