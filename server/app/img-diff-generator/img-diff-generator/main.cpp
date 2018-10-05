#include <iostream>
#include <string>
#include "ImageParser.h"

using namespace std;

int main(int argc, char *argv[])
{
	string filename = "C:\\Users\\Kevin\\Documents\\PolyMTL\\Session 4\\LOG2990\\log2990\\server\\app\\img-diff-generator\\Debug\\test3.bmp";
	
	//cout << "Enter filename: " << endl;
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
	catch (const std::runtime_error & e)
	{
		cerr << "Runtime error:" << endl;
		cerr << e.what() << endl;
	}
	catch (const std::invalid_argument & e)
	{
		cerr << "Invalid argument: " << endl;
		cerr << e.what() << endl;
	}
	catch (const std::exception & e)
	{
		cerr << "Generic exception: " << endl;
		cerr << e.what() << endl;
	}
	catch (...)
	{
		cerr << "Unknown exception" << endl;
	}

	system("pause");
	return 0;
}