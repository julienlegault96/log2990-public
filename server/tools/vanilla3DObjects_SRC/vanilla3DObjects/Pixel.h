#pragma once

class Pixel
{
public:
	Pixel();
	Pixel(const unsigned char & red, const unsigned char & green, const unsigned & blue);

	const bool operator==(const Pixel & pixel) const;
	const bool operator!=(const Pixel & pixel) const;

	unsigned char
		red_, 
		green_, 
		blue_;
};