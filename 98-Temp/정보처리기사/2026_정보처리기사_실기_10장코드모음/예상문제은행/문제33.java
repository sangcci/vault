class Rectangle {
	int x, y;
	Rectangle(int x, int y) {
		this.x = x;
		this.y = y;
	}
	int getArea( ) {
		return x*y;
	}
}
class Square extends Rectangle {
	Square(int a) {
		super(a, a);
	}
	int getSquareArea( ) {
		return x*y;
	}
}
public class Main {
	public static void main(String[] args) {
		Square sq = new Square(10);
		System.out.println(sq.getSquareArea( ));
	}
}