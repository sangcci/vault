import java.util.Scanner;
public class Test
{
	public static void main(String[] args)
{
		Scanner scan = new Scanner(System.in);
		int a = scan.nextInt();
		System.out.printf("a * 3 = %d\n", a * 3);
		System.out.println("a / 2 = " + (a / 2));
		System.out.print("a - 1 = " + (a - 1));
		scan.close();
	}
}