class Calculator{
    companion object{
        fun add (a:Int, b:Int): Int {
            return (a+b)
        }
    }
}

fun main(){
    val result = Calculator.add(1,2)
    print(result)
}