// 先看懂代码，再去学着改他的代码，别想着一上来就开始改


/*一文搞懂async、await在请求接口时的使用，也主要是请求接口时使用 https://www.cnblogs.com/SamWeb/p/8417940.html
总结：async里面包着await，await后面跟着promise对象。

1 await关键字必须位于async函数内部
2 await关键字后面需要一个promise对象（不是的话就调用resolve转换它）
3 await关键字的返回结果就是其后面Promise执行的结果，可能是resolved或者rejected的值，注意最后执行完的是个值。
4 不能在普通箭头函数中使用await关键字，需要在箭头函数前面添加async
5 await用来串行的执行异步操作，现实现并行可以考虑promise.all


*/
/*
await的理解：等待异步函数完成。
ES7前端异步async/await。
async顾名思义是“异步”的意思，async用于声明一个函数是异步的。而await从字面意思上是“等待”的意思，就是用于等待异步完成。并且await只能在async函数中使用
通常async、await都是跟随Promise一起使用的。为什么这么说呢？因为async返回的都是一个Promise对象同时async适用于任何类型的函数上。这样await得到的就是一个Promise对象(如果不是Promise对象的话那async返回的是什么 就是什么)；
await得到Promise对象之后就等待Promise接下来的resolve或者reject。
来看下面代码Demo1：
async修饰的函数是异步函数，async可以修饰任意函数：
new一个promise，promise rosolve出来的可以用变量接一下，就是rosolve的值。
promise是异步的，await后面跟的就是异步的。await等待后面的异步完成。

*/

/*Demo1*/
// async function testSync1() {
//   const response = await new Promise(resolve => {
//      setTimeout(() => {
//          resolve("async await test...");
//       }, 1000);
//   });
//   console.log(response);
// }
// testSync1();//async await test...
// console.log("在异步函数的下面，但是会先执行这个，再执行上面的异步函数，可以这么简单理解");

/*Demo2 同步函数加上async就会变成异步函数，看代码*/
async function testSync2() {
	console.log("异步函数");
	// return "异步函数"
}
testSync2();//async await test...
console.log(testSync2());
console.log("虽然在异步函数的后面，但是先执行");

/*既然是promise对象，想获取promise的结果，就得.then*/
async function timeout() {
    return 'hello world'
}
/*异步执行*/
timeout().then(result => {
    console.log(result);
})
console.log('虽然在后面，但是我先执行');

