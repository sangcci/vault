#include <stdio.h>
int isPerfectNum(int num) {
	int sum = 0;
	for (int i = 1; i < num; i++) {
		if (num % i == 0)
			sum += i;
	}
	if (num == sum) return 1;
	else return 0;
}

main() {
	int r = 0;
	for (int i = 1; i <= 100; i++)
		if (isPerfectNum(i))
			r += i;
	printf("%d", r);
}