#include <stdio.h>
void func(char *d, char *s) {
	while (*s) {
		*d = *s;
		d++;
		s++;
	}
	*d = '\0';
}
int main( ) {
	char* str1 = "first";
	char str2[50] = "teststring";
	int result = 0;
	func(str2, str1);
	for (int i = 0; str2[i] != '\0'; i++) {
		result += i;
	}
	printf("%d\n", result);
	return 0;
}