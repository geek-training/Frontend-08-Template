学习笔记

### Type Convertion 类型转换

|      原始值      | 转换为 Number |   转换为 String   | 转换为 Boolean |
| :--------------: | :-----------: | :---------------: | :------------: |
|      false       |       0       |      "false"      |     false      |
|       true       |       1       |      "true"       |      true      |
|        0         |       0       |        "0"        |     false      |
|        1         |       1       |        "1"        |      true      |
|       "0"        |       0       |        "0"        |      true      |
|       "1"        |       1       |        "1"        |      true      |
|       NaN        |      NaN      |       "NaN"       |     false      |
|     Infinity     |   Infinity    |    "Infinity"     |      true      |
|    -Infinity     |   -Infinity   |    "-Infinity"    |      true      |
|        ""        |       0       |        ""         |     false      |
|       "20"       |      20       |       "20"        |      true      |
|     "twenty"     |      NaN      |     "twenty"      |      true      |
|        []        |       0       |        ""         |      true      |
|       [20]       |      20       |       "20"        |      true      |
|     [10,20]      |      NaN      |      "10,20"      |      true      |
|    ["twenty"]    |      NaN      |     "twenty"      |      true      |
| ["ten","twenty"] |      NaN      |   "ten,twenty"    |      true      |
|   function(){}   |      NaN      |  "function(){}"   |      true      |
|        {}        |      NaN      | "[object Object]" |      true      |
|       null       |       0       |      "null"       |     false      |
|    undefined     |      NaN      |    "undefined"    |     false      |

### Unboxing（拆箱转换）

-   `ToPremitive`
    -   如遇到 `object` 参与运算，如 `object + object` 时，都会调用 `ToPremitive` 过程。
-   `toString vs valueOf`
    -   加法会优先调用 `valueOf` 方法，即使是字符串+对象，如 `'x' + o`，如果没有 `valueOf` 和 `Symbol.toPrimitive` 方法才会调用 `toString`，但是当 `object` 作为属性名的时候则会优先调用 `toString` 方法，如`x[o]`。
-   `Symbol.toPrimitives`
    -   优先级最高，如果调用了该方法，则会忽略 `toString` 和 `valueOf` 方法。

### Boxing（装箱转换）

| 类型    | 对象                    | 值          |
| ------- | ----------------------- | ----------- |
| Number  | new Number(1)           | 1           |
| String  | new String('a')         | 'a'         |
| Boolean | new Boolean(true)       | true        |
| Symbol  | new Object(Symbol('a')) | Symbol('a') |



### Runtime 运行时的引用类型（Reference）

> a.b 操作访问了对象的属性，但是它从对象中取出来的可不是对象的值，而是一个引用，但引用不是 JS 的七种基本类型之一，但它确确实实存在于运行时，我们称它为标准中的类型而不是语言中的类型，一个 Reference 又两部分组成，第一部分是一个对象，第二部分是一个 key，对象就是 object，key 可以是 String 也可以是 Symbol，在处理 delete 或者 assign 相关的写操作时，就要知道操作的是哪个对象的哪个属性，即用到的引用类型。

-   `Call`（函数调用）
    -   `foo()`
    -   `super()`
    -   `foo()['b']`
    -   `foo().b`
    -   foo()\`abc\`

> `Call Expression` 的优先级没有上述 `Member` 和 `New` 的优先级高，所以导致后面的 `Member` 运算符的优先级也降低了，点运算的优先级是由它前面的表达式决定的。

> `new a()['b']`的优先级顺序是先 new 再取值

```js
const foo3 = () => (string, ...exp) => [string, ...exp]
// 和上方标签函数解析规则一样
console.log(foo3()`abc`) // [ [ 'abc' ] ]
```

-   Left Handside & Right Handside（左手运算和右手运算）

> 如果能放到等号左边的表达式就是 `Left Handside Expression`，比如`a.b`，否则就是 `Right Handside Expression`，比如`a+b`。并且`Left Handside Expression`一定是`Right Handside Expression`。

-   `Update`
    -   `a++`
    -   `a--`
    -   `--a`
    -   `++a`

> `Update Expression` 就是 `Right Handside Expression`，`++ a ++` 是不合法的。

-   `Unary`（单目运算符）

    -   `delete a.b`
    -   `void foo()`
        -   `void` 运算符对给定的表达式进行求值，然后返回 `undefined`。
    -   `typeof a`
    -   `+a`
        -   如果是字符串会发生类型转换转为数字
    -   `-a`
        -   同上
    -   `~a`
        -   按位取反，如果 `a` 不是整数，会把 `a` 强制转换为整数之后再按位取反。
    -   `!a`
    -   `await a`
        -   返回一个 Promise

-   `Exponential`（指数运算符）
    -   `\*\*`
        -   表示乘方运算

> `3 ** 2 ** 3` 的运算顺序是 `3 ** (2 ** 3)`从右到左。大部分运算符都是左结合的，唯有 `**` 是右结合的。

-   `Multiplicative`（乘法运算符）
    -   `\* / %`
-   `Additive`（加法运算符）
    -   `+ -`
-   `Shift`（移位运算符）
    -   `<< >> >>>`
-   `Relationship`(关系运算符)
    -   `< > <= >= instanceof in`
-   `Equality`（相等运算符）
    -   `==`
        -   转换规则见下集详解
    -   `!=`
    -   `===`
    -   `!==`
-   `Bitwise`（位运算符）
    -   `& ^ |`
-   `Logical`（逻辑运算符）
    -   `&&`
    -   `||`
-   `Conditional`（条件运算符）
    -   `? :`
