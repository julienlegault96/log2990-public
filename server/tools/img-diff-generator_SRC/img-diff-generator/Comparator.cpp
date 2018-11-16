#include "Comparator.h"

Comparator::Comparator() : _differenceImage(DEFAULT_24BIT_BMP_HEADER.biWidth, DEFAULT_24BIT_BMP_HEADER.biHeight), _partialDiff(false)
{
}

Image Comparator::getImage(const char* input) const
{
	ImageParser imageParser;
	size_t inputLength = strlen(input);
	return inputLength > BASE_64_LENGTH_THRESHOLD ?
		imageParser.getImageFromBase64(input) : imageParser.getImageFromUrl(input);
}

void Comparator::compare(const char * inputOne, const char * inputTwo)
{
	Image image1 = getImage(inputOne);
	Image image2 = getImage(inputTwo);

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
				 _partialDiff ? _differenceImage.setPixel(x, y, DIFF_PIXEL) : enlargeErrorZone(x, y);
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

	_partialDiff = true;
}

void Comparator::saveDiffTo(const char*  filename) const
{
	fstream file(filename, ios::out | ios::binary | ios_base::trunc);
	if (!file.is_open())
	{
		throw std::runtime_error("Could not open \"" + string(filename) + "\" for output");
	}

	file << DEFAULT_24BIT_BMP_HEADER;
	file << _differenceImage;
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

		_differenceImage.setPixel(safeX, safeY, DIFF_PIXEL);
	}
}
