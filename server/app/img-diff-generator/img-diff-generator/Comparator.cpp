#include "Comparator.h"

Comparator::Comparator() : differenceImage(EXPECTED_BMP_HEADER.biWidth, EXPECTED_BMP_HEADER.biHeight)
{
}

void Comparator::compare(const char * filename1, const char * filename2)
{
	ImageParser imageParser;
	Image image1 = imageParser.getImageFromUrl(filename1);
	Image image2 = imageParser.getImageFromUrl(filename2);

	if (image1.getPixels().size() != image2.getPixels().size()
		|| image1.getPixels()[0].size() != image2.getPixels()[0].size()) {
		throw std::invalid_argument(
			" Images were of different sizes, image#1 was a " +
			to_string(image1.getPixels().size()) + " x " + to_string(image1.getPixels()[0].size()) +
			"and image#1 was a " +
			to_string(image2.getPixels().size()) + " x " + to_string(image2.getPixels()[0].size())
		);
	}

	for (int32_t y = 0; y < EXPECTED_BMP_HEADER.biHeight; ++y)
	{
		for (int32_t x = 0; x < EXPECTED_BMP_HEADER.biWidth; ++x)
		{
			if (image1.getPixel(x, y) != image2.getPixel(x, y))
			{
				 true ? enlargeErrorZone(x, y) : differenceImage.setPixel(x, y, DIFF_PIXEL);
			}
		}
	}
}

void Comparator::saveTo(const char*  filename) const
{
	// https://www.siggraph.org/education/materials/HyperVis/asp_data/compimag/bmpfile.htm
	//Create a new file for writing
	FILE * bmpfile;

	if (fopen_s(&bmpfile, filename, "wb")) {
		throw std::runtime_error("Output File opening error");
	}

	//Write the bitmap file header
	fwrite(&EXPECTED_BMP_HEADER, 1, sizeof(EXPECTED_BMP_HEADER), bmpfile);
	fclose(bmpfile);
	/*
	ofstream pFile;
	pFile.open(filename, ios::out | ios::app | ios::binary);
	Image diffOut = differenceImage;
	pFile << diffOut;
	pFile.close();
	*/
}

void Comparator::enlargeErrorZone(const int32_t x, const int32_t y)
{
	for (pair<int, int> stencilPair : CIRCLE_STENCIL)
	{
		int32_t safeX = (x + stencilPair.first < 0) ? 0 : x + stencilPair.first;
		safeX = (safeX > EXPECTED_BMP_HEADER.biWidth - 1) ? EXPECTED_BMP_HEADER.biWidth - 1 : safeX;

		int32_t safeY = (y + stencilPair.second < 0) ? 0 : y + stencilPair.second;
		safeY = (safeY > EXPECTED_BMP_HEADER.biHeight - 1) ? EXPECTED_BMP_HEADER.biHeight - 1 : safeY;

		differenceImage.setPixel(safeX, safeY, DIFF_PIXEL);
	}
}
