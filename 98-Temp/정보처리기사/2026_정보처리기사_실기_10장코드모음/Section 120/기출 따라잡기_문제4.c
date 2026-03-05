#include <stdio.h>
int main( ) {
	int a[4] = { 0, 2, 4, 8 };
	int b[3];
	int* p;
	int sum = 0;
	for (int i = 1; i < 4; i++) {
		p = a + i;
		b[i - 1] = *p - a[i - 1];
		sum = sum + b[i - 1] + a[i];
	}
	printf("%d", sum);
}