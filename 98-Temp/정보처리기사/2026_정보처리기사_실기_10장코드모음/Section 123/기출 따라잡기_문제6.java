class Parent {
	int x, y;
	Parent(int x, int y) {
		this.x = x;
		this.y = y;
	}
	int getX() {
		return x*y;
	}
}
class Child extends Parent {
	int x;
	Child(int x) {
		super(x+1, x);
		this.x = x;
	}
	int getX(int n) {
		return super.getX() + n;
	}
}
public class Main {
	public static void main(String[] args) {
		Parent parent = new Child(10);
		System.out.println(parent.getX());
	}
}