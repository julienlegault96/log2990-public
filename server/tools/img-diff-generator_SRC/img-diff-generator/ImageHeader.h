#pragma once

#include <iostream>
#include <iomanip>
using namespace std;

// https://en.wikipedia.org/wiki/BMP_file_format
class ImageHeader {
public:

	ImageHeader();

	ImageHeader(
		int32_t biWidth,
		int32_t biHeight
	);


	uint8_t bfType[2] = { 0x42, 0x4D }; // "BM", identifies file as .bmp
	int32_t bfSize = 46134L; // headersize + bytesPerLine * depth where bytesPerLine = width * 3 (for 24 bit images) in little endian
	uint16_t bfReserved[2]; // Unused - must be two zero bytes
	uint32_t bfOffBits = 54L; // Offset to start of Pixel Data, a.k.a the header's size
	uint32_t biSize = 40L; //	size of the info section, here the standard 40
	int32_t biWidth = 640L;
	int32_t biHeight = 480L;
	uint16_t biPlanes = 1; // must be 1
	uint16_t biBitCount = 24; // for 24 bit images, a.k.a depth
	uint32_t biCompression = 0L; //(no compression)
	uint32_t biSizeImage = 0L;
	int32_t biXPelsPerMeter = 0L;
	int32_t biYPelsPerMeter = 0L;
	uint32_t biClrUsed = 0L;
	uint32_t biClrImportant = 0L;

	friend ostream& operator<<(ostream & os, const ImageHeader & header);
private:

};