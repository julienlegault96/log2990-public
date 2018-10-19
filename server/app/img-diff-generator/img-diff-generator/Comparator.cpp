#include "Comparator.h"

Comparator::Comparator() : differenceImage(DEFAULT_24BIT_BMP_HEADER.biWidth, DEFAULT_24BIT_BMP_HEADER.biHeight), partialDiff(false)
{
}

void Comparator::compare(const char * filename1, const char * filename2)
{
	ImageParser imageParser;
	long file1len = string(filename1).length();
	long file2len = string(filename2).length();
	Image image1 = file1len > 1000 ? imageParser.getImageFromBase64(filename1) : imageParser.getImageFromUrl(filename1);
	Image image2 = file2len > 1000 ? imageParser.getImageFromBase64(filename2) : imageParser.getImageFromUrl(filename2);

	if (image1.getPixels().size() != image2.getPixels().size()
		|| image1.getPixels()[0].size() != image2.getPixels()[0].size()) {
		throw std::invalid_argument(
			" Images were of different sizes, image#1 was a " +
			to_string(image1.getPixels().size()) + " x " + to_string(image1.getPixels()[0].size()) +
			" and image#2 was a " +
			to_string(image2.getPixels().size()) + " x " + to_string(image2.getPixels()[0].size())
		);
	}

	for (int32_t y = 0; y < DEFAULT_24BIT_BMP_HEADER.biHeight; ++y)
	{
		for (int32_t x = 0; x < DEFAULT_24BIT_BMP_HEADER.biWidth; ++x)
		{
			if (image1.getPixel(x, y) != image2.getPixel(x, y))
			{
				 partialDiff ? differenceImage.setPixel(x, y, DIFF_PIXEL) : enlargeErrorZone(x, y);
			}
		}
	}
}

void Comparator::InterpretOptionStrings(const char * options)
{
	const string optString = string(options);
	if ( optString != EXPECTED_PARTIAL_OPTION_STRING) {
		throw std::invalid_argument(
			"Invalid option, submited \"" + optString + "\" when accepted options are \"" +
			EXPECTED_PARTIAL_OPTION_STRING + "\""
		);
	}
	else {
		partialDiff = true;
	}

	
}

void Comparator::saveTo(const char*  filename) const
{
	fstream file;
	// open for .bmp
	file.open(filename,  ios::in | ios::out | ios::binary);
	file << DEFAULT_24BIT_BMP_HEADER;
	file << differenceImage;
	int len = file.tellp();

	//extract bytes for encoding
	char * bmpData = new char[len];
	file.read(bmpData, len);
	string b64String = base64().encode((const unsigned char *)bmpData, len);

	delete[] bmpData;
	bmpData = nullptr;
	file.close();

	string b64filename(filename);
	// open for b64
	file.open(b64filename.substr(0, b64filename.length() - 4) + "B64", ios::out | ios::binary);
	file.write(b64String.data(), b64String.length());
	file.close();
}

void Comparator::enlargeErrorZone(const int32_t x, const int32_t y)
{
	for (pair<int, int> stencilPair : CIRCLE_STENCIL)
	{
		int32_t safeX = (x + stencilPair.first < 0) ? 0 : x + stencilPair.first;
		safeX = (safeX > DEFAULT_24BIT_BMP_HEADER.biWidth - 1) ? DEFAULT_24BIT_BMP_HEADER.biWidth - 1 : safeX;

		int32_t safeY = (y + stencilPair.second < 0) ? 0 : y + stencilPair.second;
		safeY = (safeY > DEFAULT_24BIT_BMP_HEADER.biHeight - 1) ? DEFAULT_24BIT_BMP_HEADER.biHeight - 1 : safeY;

		differenceImage.setPixel(safeX, safeY, DIFF_PIXEL);
	}
}
