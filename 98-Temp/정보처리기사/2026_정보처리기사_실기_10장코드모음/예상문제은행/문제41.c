#include <stdio.h>
void swap(int a, int b) {
	int t = a;
	a = b;
	b = t;
}
int main( ) {
	int a = 11;
	int b = 19;
	swap(a, b);
	switch(a) {
		case 1:
			b += 1;
		case 11:
			b += 2;
		deafult:
			b += 3;
			break;
	}
	printf("%d", a-b);
}