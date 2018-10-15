#include <iostream>
#include <string>
#include "ImageParser.h"
#include "Comparator.h"

using namespace std;

int main(int argc, char *argv[])
{
	const char* DIFF_FILENAME = "C:\\Users\\papal\\Documents\\Travail\\LOG2990 - Projet 2\\server\\app\\img-diff-generator\\img-diff-generator\\Debug\\diff.bmp";
	const char* IMAGE1_FILENAME =
		"C:\\Users\\papal\\Documents\\Travail\\LOG2990 - Projet 2\\server\\app\\img-diff-generator\\img-diff-generator\\Debug\\comp1.bmp";
	//"C:\\Users\\Kevin\\Documents\\PolyMTL\\Session 4\\LOG2990\\log2990\\server\\app\\img-diff-generator\\Debug\\comp1.bmp";
	const char* IMAGE2_FILENAME =
		"C:\\Users\\papal\\Documents\\Travail\\LOG2990 - Projet 2\\server\\app\\img-diff-generator\\img-diff-generator\\Debug\\comp2.bmp";
	//"C:\\Users\\Kevin\\Documents\\PolyMTL\\Session 4\\LOG2990\\log2990\\server\\app\\img-diff-generator\\Debug\\comp2.bmp";

	try
	{
		Comparator comparator;
		comparator.compare(IMAGE1_FILENAME, IMAGE2_FILENAME);
		comparator.saveTo(DIFF_FILENAME);
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
		cerr << "Out of range: " << endl;
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