#include "Comparator.h"

Comparator::Comparator() : differenceImage(this->IMAGE_HEIGHT, this->IMAGE_WIDTH)
{
}

void Comparator::exec(const string & filename1, const string & filename2)
{
	ImageParser imageParser;
	Image image1 = imageParser.getImageFromUrl(filename1);
	Image image2 = imageParser.getImageFromUrl(filename2);
	cout << image1 << endl;
	cout << image2 << endl;

	for (unsigned i = 0; i < this->IMAGE_WIDTH; i++)
	{
		for (unsigned j = 0; j < this->IMAGE_HEIGHT; j++)
		{
			if (image1.getPixel(i, j) != image2.getPixel(i, j))
			{
				this->enlargeErrorZone(i, j);
			}
		}
	}
}

const void Comparator::save(const string & filename) const
{
	// TODO
	Image image(this->differenceImage);
	cout << image;
	return void();
}

const void Comparator::enlargeErrorZone(const unsigned & x, const unsigned & y)
{
	Pixel pixel(0, 0, 0);
	for (pair<int, int> stencilPair : this->CIRCLE_STENCIL)
	{
		unsigned i = ((int)x + stencilPair.first < 0) ? 0 : x + stencilPair.first;
		i = (i >= this->IMAGE_HEIGHT) ? this->IMAGE_HEIGHT - 1 : i;
		unsigned j = ((int)y + stencilPair.second < 0) ? 0 : y + stencilPair.second;
		j = (j >= this->IMAGE_WIDTH) ? this->IMAGE_WIDTH - 1 : j;
		this->differenceImage.setPixel(i, j, pixel);
	}
}
