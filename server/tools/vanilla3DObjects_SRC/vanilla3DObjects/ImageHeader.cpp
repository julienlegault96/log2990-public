 #include "ImageHeader.h"

ImageHeader::ImageHeader()
{
	ImageHeader(640, 480);
}

ImageHeader::ImageHeader(int32_t width, int32_t height) : biWidth(width), biHeight(height)
{
	//https://www.siggraph.org/education/materials/HyperVis/asp_data/compimag/bmpfile.htm

	int bytesPerLine = width * 3;  /* (for 24 bit images) */
	/* round up to a dword boundary */
	if (bytesPerLine & 0x0003)
	{
		bytesPerLine |= 0x0003;
		++bytesPerLine;
	}

	bfSize = bfOffBits + (long)bytesPerLine * height;
}


void split4BytesInLittleEndian(char * memblock, const int32_t fourBytes, const int beginIndex, const int endIndex = 0)
{
	memblock[beginIndex] = (char)(fourBytes);
	memblock[beginIndex + 1] = (char)(fourBytes >> 8);
	memblock[beginIndex + 2] = (char)(fourBytes >> 16);
	memblock[beginIndex + 3] = (char)(fourBytes >> 24);
}

void split2BytesInLittleEndian(char * memblock, const int16_t twoBytes, const int beginIndex, const int endIndex = 0)
{
	memblock[beginIndex] = (char)(twoBytes);
	memblock[beginIndex + 1] = (char)(twoBytes >> 8);
}

ostream & operator<<(ostream & stream, const ImageHeader & header)
{
	char * memblock = new char[header.bfOffBits];

	// 14 bytes - fileheader - memblock positions [0 to 13]
	memblock[0] = header.bfType[0];
	memblock[1] = header.bfType[1];
	split4BytesInLittleEndian(memblock, header.bfSize, 2, 5);
	split2BytesInLittleEndian(memblock, header.bfReserved[0], 6, 7);
	split2BytesInLittleEndian(memblock, header.bfReserved[1], 8, 9);
	split4BytesInLittleEndian(memblock, header.bfOffBits, 10, 13);
	
	// 40 bytes - imageheader - memblock positions [14 to 53] 
	split4BytesInLittleEndian(memblock, header.biSize, 14, 17);
	split4BytesInLittleEndian(memblock, header.biWidth, 18, 21);
	split4BytesInLittleEndian(memblock, header.biHeight, 22, 25);
	split2BytesInLittleEndian(memblock, header.biPlanes, 26, 27);
	split2BytesInLittleEndian(memblock, header.biBitCount, 28, 29);
	split4BytesInLittleEndian(memblock, header.biCompression, 30, 33);
	split4BytesInLittleEndian(memblock, header.biSizeImage,	34, 37);
	split4BytesInLittleEndian(memblock, header.biXPelsPerMeter, 38, 41);
	split4BytesInLittleEndian(memblock, header.biYPelsPerMeter, 42, 45);
	split4BytesInLittleEndian(memblock, header.biClrUsed, 46, 49);
	split4BytesInLittleEndian(memblock, header.biClrImportant, 50, 53);

	stream.write(memblock, header.bfOffBits);

	delete[] memblock;
	memblock = nullptr;

	return stream;
}

