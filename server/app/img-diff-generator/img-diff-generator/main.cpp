#include <iostream>
#include <string>
#include "ImageParser.h"
#include "Comparator.h"

using namespace std;

int main(int argc, char *argv[])
{
	string filename = "C:\\Users\\Kevin\\Documents\\PolyMTL\\Session 4\\LOG2990\\log2990\\server\\app\\img-diff-generator\\Debug\\test3.bmp";
	
	//cout << "Enter filename: " << endl;
	//cin >> filename;
	try
	{
		string filename1 = "C:\\Users\\Kevin\\Documents\\PolyMTL\\Session 4\\LOG2990\\log2990\\server\\app\\img-diff-generator\\Debug\\comp1.bmp";
		string filename2 = "C:\\Users\\Kevin\\Documents\\PolyMTL\\Session 4\\LOG2990\\log2990\\server\\app\\img-diff-generator\\Debug\\comp2.bmp";
		Comparator comparator;
		comparator.exec(filename1, filename2);
		comparator.save(filename);
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
	//TODO take away
	system("pause");
	return 0;
}