#pragma once
class Pixel
{
public:
	Pixel();
	Pixel(const unsigned char & r, const unsigned char & g, const unsigned & b);

	const bool operator==(const Pixel & pixel) const;
	const bool operator!=(const Pixel & pixel) const;

	unsigned char
		r,
		g,
		b;
};