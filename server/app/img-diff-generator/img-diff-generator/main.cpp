#include <iostream>
#include <string>
#include "ImageParser.h"

using namespace std;

void main(int argc, char *argv[])
{
	cout << "Enter filename: " << endl;

	string filename = "C:\\Users\\Kevin\\Documents\\PolyMTL\\Session 4\\LOG2990\\log2990\\server\\app\\img-diff-generator\\Debug\\test3.bmp";
	//cin >> filename;

	ImageParser imageParser;
	try
	{
		Image image = imageParser.getImageFromUrl(filename);
		cout << "Size: "
			<< image.getPixels().size()
			<< "x"
			<< image.getPixels()[0].size()
			<< endl;

		cout << image;

	}
	catch (const std::runtime_error& e)
	{
		cout << e.what();
	}
	catch (...)
	{
		cout << "Unknown error";
	}
	system("pause");
}