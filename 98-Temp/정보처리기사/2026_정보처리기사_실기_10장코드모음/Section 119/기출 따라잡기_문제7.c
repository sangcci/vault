#include <stdio.h>
main() {
	int s, el = 0;
	for (int i = 6; i <= 30; i++) {
		s = 0;
		for (int j = 1; j <= i / 2; j++)
			if (i % j == 0)
				s = s + j;
		if (s == i)
			el++;
	}
	printf("%d", el);
}