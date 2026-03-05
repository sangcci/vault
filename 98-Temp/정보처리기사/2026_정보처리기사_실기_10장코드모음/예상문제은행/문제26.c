#include <stdio.h>
#define SIZE 3

typedef struct {
	int a[SIZE];
	int front;
	int rear;
} Queue;

void enq(Queue* q, int val) {
	q -> a[q -> rear] = val;
	q -> rear = (q -> rear + 1) % SIZE;
}

int deq(Queue* q) {
	int val = q -> a[q -> front];
	q -> front = (q -> front + 1) % SIZE;
	return val;
}

int main( ) {
	Queue q = {{0}, 0, 0};
	enq(&q, 1);
	enq(&q, 2);
	deq(&q);
	enq(&q, 3);
	printf("%d 그리고 %d", deq(&q), deq(&q));
	return 0;
}