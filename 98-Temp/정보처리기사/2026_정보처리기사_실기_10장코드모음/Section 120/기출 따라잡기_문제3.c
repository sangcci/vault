#include <stdio.h>
int main() {
	int* array[3];
	int a = 12, b = 24, c = 36;
	array[0] = &a;
	array[1] = &b;
	array[2] = &c;
	printf("%d", *array[1] + **array + 1);
}