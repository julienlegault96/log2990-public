#include <iostream>
#include <string>
#include "ImageParser.h"
#include "Comparator.h"

using namespace std;

int main(int argc, char *argv[])
{
	const char* filename = "C:\\Users\\papal\\Documents\\Travail\\LOG2990 - Projet 2\\server\\app\\img-diff-generator\\img-diff-generator\\Debug\\diff.bmp";

	try
	{
		const char* filename1 =
			"C:\\Users\\papal\\Documents\\Travail\\LOG2990 - Projet 2\\server\\app\\img-diff-generator\\img-diff-generator\\Debug\\comp1.bmp";
			//"C:\\Users\\Kevin\\Documents\\PolyMTL\\Session 4\\LOG2990\\log2990\\server\\app\\img-diff-generator\\Debug\\comp1.bmp";
		const char* filename2 =
			"C:\\Users\\papal\\Documents\\Travail\\LOG2990 - Projet 2\\server\\app\\img-diff-generator\\img-diff-generator\\Debug\\comp2.bmp";
			//"C:\\Users\\Kevin\\Documents\\PolyMTL\\Session 4\\LOG2990\\log2990\\server\\app\\img-diff-generator\\Debug\\comp2.bmp";
		Comparator comparator;
		comparator.compare(filename1, filename2);
		comparator.saveTo(filename);
	}
	catch (const std::runtime_error & e)	{
		cerr << "Runtime error:" << endl;
		cerr << e.what() << endl;
		return -1;
	}
	catch (const std::invalid_argument & e)	{
		cerr << "Invalid argument: " << endl;
		cerr << e.what() << endl;
		return -1;
	}
	catch (const std::out_of_range & e)	{
		cerr << "Tried to access out of declared scope: " << endl;
		cerr << e.what() << endl;
		return -1;
	}
	catch (const std::exception & e)	{
		cerr << "Generic exception: " << endl;
		cerr << e.what() << endl;
		return -1;
	}
	catch (...)	{
		cerr << "Unknown exception" << endl;
		return -1;
	}

	return 0;
}