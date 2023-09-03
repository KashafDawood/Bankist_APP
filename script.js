'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Kashaf Dawood',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-08-14T17:01:17.194Z',
    '2023-08-25T23:36:17.929Z',
    '2023-09-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Umar Wadood',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

//logout timer
const logoutTimer = function(){
  //set the timer to 5 min
  let time = 300;

  const tick = function(){
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //in each call print remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    
    //when 0 seconds stop timer and logout user
    if(time === 0){
      clearInterval(logout);
      labelWelcome.textContent = 'Login to get started';
      containerApp.style.opacity = 0;
    }

    //decrase timer
    time--;

  }

  //call the timer every second
  tick();
  const logout = setInterval(tick, 1000)
  return logout;
}

//currency format
const currencyFormat = function(acc, cur){

  const options = {
    style: 'currency',
    currency: acc.currency,
  }
  
  return new Intl.NumberFormat(acc.locale, options).format(cur);
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;


  movs.forEach(function (mov, i,) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    
    //creating date with timestamp of the movementdate array
    const date = new Date(acc.movementsDates[i]);


    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${formatedDate(date)}</div>
        <div class="movements__value">${currencyFormat(currentAccount, mov)}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${currencyFormat(currentAccount ,acc.balance)}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${currencyFormat(currentAccount, incomes)}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${currencyFormat(currentAccount, out)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${currencyFormat(currentAccount, interest)}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

//formated date
const formatedDate = function(date){
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if(daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // else {
  //   const day = `${date.getDate()}`.padStart(2, 0);
  //   const month = `${date.getMonth()+1}`.padStart(2, 0);
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  //}


  return new Intl.DateTimeFormat(currentAccount.locale).format(date);
}

///////////////////////////////////////
// Event handlers
let currentAccount, logout;

//fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;


    setInterval(function(){//current date
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    }
    
    const locale = currentAccount.locale;
    const now = new Date();

    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now)}, 1000)
    // const date = new Date();
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth()+1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // const hour = date.getHours();
    // const min = date.getMinutes();
    // labelDate.textContent = `${day}/${month}/${year}  ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //logout timer
    if(logout) clearInterval(logout);
    logout = logoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    const now = new Date();
    currentAccount.movementsDates.push(now);
    receiverAcc.movementsDates.push(now);

    //current date
    labelDate.textContent = formatedDate(new Date());

    // Update UI
    updateUI(currentAccount);

    //reset timer
    clearInterval(logout);
    logout = logoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function(){
    // Add movement
    currentAccount.movements.push(amount);

    //push current date to the movement array date
    const now = new Date();
    currentAccount.movementsDates.push(now);

    //current date
    labelDate.textContent = formatedDate(new Date());

    // Update UI
    updateUI(currentAccount);

    
    //reset timer
    clearInterval(logout);
    logout = logoutTimer();

    }, 2500)
  }
  inputLoanAmount.value = '';
  
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    labelWelcome.textContent = 'Login to get started';
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
console.log(23 === 23.0); //? true
//this proves the js stores all numbers as floats

//! representation of numbers in js
//base 10 - 0 to 9  1/10 = 0.1 3/10 = 3.3333333333333333333
//binary base 2 - 0 1
console.log(0.1 + 0.2); //? 0.30000000000000004
//so we have to be careful with the numbers dont do too much resicese math
console.log(0.1 + 0.2 === 0.3); //? false

//! conversion of Numbers
console.log(Number('23')); //? 23
//but there is also a easy way to do this
console.log(+'23'); //? 23
//this is called type coercion - js will convert the string to a number due to the + sign


//! parsing
console.log(Number.parseInt('30px')); //? 30
// js will try to figure out the number in the sting and return it as a number
//* but for working parsing the string should start with a number otherwise it will return NaN
console.log(Number.parseInt('e23')); //? NaN (Not a Number)
//* parse function also have another parameter called redex which represent the base of the number system like in our case it base 10 so we can write it like this
console.log(Number.parseInt('30px', 10)); //? 30
//* it is better to add redex parameter to avoid bugs

//! parseInt is for integers and parseFloat is for floats
console.log(Number.parseFloat('2.5rem')); //? 2.5
//* these pasrse function are global function so we can also call them like this
console.log(parseFloat('2.5rem')); //? 2.5
//* but it is better to call them on the Number object because it is more clear and without number object is a old school way Number object also provide namespace.

//! check if value is NaN
console.log(Number.isNaN(20)); //? false
console.log(Number.isNaN('20')); //? false because it is converted to number
console.log(Number.isNaN(+'20X')); //? true
console.log(Number.isNaN(23 / 0)); //? false because it is infinity

//! there is also another function
console.log(Number.isFinite(20)); //? true
console.log(Number.isFinite('20')); //? false because it is converted to number and it is not finite
console.log(Number.isFinite(+'20X')); //? false
console.log(Number.isFinite(23 / 0)); //? false because it is infinity

//! isInteger
console.log(Number.isInteger(23)); //? true
console.log(Number.isInteger(23.0)); //? true
console.log(Number.isInteger(23 / 0)); //? false
*/

// //! Math and Rounding
// console.log(Math.sqrt(25)); //? 5 //square root
// // we can also do this using exponentiation method
// console.log(25 ** (1 / 2)); //? 5
// console.log(8 ** (1 / 3)); //? 2

// //! cal max
// console.log(Math.max(5, 18, 23, 11, 2)); //? 23
// console.log(Math.max(5, 18, '23', 11, 2)); //? 23 as it is converted to number
// console.log(Math.max(5, 18, '23px', 11, 2)); //? NaN because it cannot parse the number

// //! cal min
// console.log(Math.min(5, 18, 23, 11, 2)); //? 2

// //! math function have also some constants
// console.log(Math.PI); //? 3.141592653589793
// console.log(Math.PI * Number.parseFloat('10px') ** 2); //? 314.1592653589793 //area of circle of 10px

// //! random
// //this will give us a random number
// console.log(Math.random()); //* but these are in decimals as js store in floats so we have to fix this
// console.log(Math.trunc(Math.random() * 6 ) +1); //* this will give us a random number between 1 to 6 we use + 1 because the turc function will give us a number between 0 to 5

// //! random between two numbers
// const randomInt = (min , max) => Math.trunc(Math.random() * (max - min) + 1) + min;
// //* 0...1 -> 0...(max-min) -> min...(max-min+min) -> min...max

// //! rounding numbers
// console.log(Math.trunc(23.3)); //? 23 it will remove any decimal part
// console.log(Math.round(23.3)); //? 23 it will round the number
// console.log(Math.round(23.9)); //? 24

// console.log(Math.ceil(23.3)); //? 24 it will always round up
// console.log(Math.ceil(23.9)); //? 24

// console.log(Math.floor(23.3)); //? 23 it will always round down
// console.log(Math.floor(23.9)); //? 23

// console.log(Math.trunc(-23.3)); //? -23 it will remove any decimal part
// console.log(Math.floor(-23.3)); //? -24 it will always round down so floor is better than trunc for negative numbers

// //! rounding decimals
// console.log((2.7).toFixed(0)); //? 3 but it will convert the number to string
// console.log((2.7).toFixed(3)); //? 2.700 but it will convert the number to string
// console.log((2.345).toFixed(2)); //? 2.35 but it will convert the number to string
// console.log(+(2.345).toFixed(2)); //? 2.35 this will convert the number to number

// //! reminder operator
// console.log(5 % 2); //? 1
// console.log(5 / 2); //? 2.5 so reminder is 1

// //!use case
// const isEven = n => n % 2 === 0;
// console.log(isEven(8)); //? true
// console.log(isEven(23)); //? false

// //! big int
// console.log(2 ** 53 - 1); //? 9007199254740991 this is the max number js can handle
// console.log(Number.MAX_SAFE_INTEGER); //? 9007199254740991 this is another way to get the max number
// console.log(2 ** 53 + 1); //? 9007199254740992 you can see it is not correct it should be 9007199254740993

// console.log(6456934983745798347593749579); //? 6.456934983745798e+27 this is called scientific notation and it is not a big int
// console.log(6456934983745798347593749579n); //? 6456934983745798347593749579n this is a big int
// console.log(BigInt(6456934983745798347593749579)); //? 6456934983745798347593749579n this is also a big int

// //* we can also do math with big int
// console.log(10000n + 10000n); //? 20000n
// //* we cannot mix big int with normal number
// const huge = 6456934983745798347593749579n;
// const num = 23;
// console.log(huge + num); //? error, we have to type cast num to big int 
// console.log(huge + BigInt(num)); //? 6456934983745798347593749602n

// //! exceptions
// console.log(20n > 15); //? true
// console.log(20n === 20); //? false
// console.log(typeof 20n); //? bigint
// console.log(20n == '20'); //? true

// console.log(huge + ' is really big!!!'); //? 6456934983745798347593749579 is really big!!! this will convert the big int to string

// //! divisions
// console.log(10n / 3n); //? 3n it will remove the decimal part
// console.log(10 / 3); //? 3.3333333333333335 it will not remove the decimal part

// //! creating dates
// //* ther are 4 ways to create dates in js

// //! date constructor
// const now = new Date(); //? this will give us the current date and time  //? Mon Aug 09 2021 21:28:10 GMT+0530 (India Standard Time)

// //! parsing date from the string
// console.log(new Date('Nov 14, 2001')) //? Wed Nov 14 2001 00:00:00 GMT+0530 (India Standard Time)

// console.log(new Date(account1.movementsDates[0])) //? Mon Nov 18 2019 03:01:17 GMT+0530 (India Standard Time)

// console.log(new Date(2037, 10, 19, 15, 23, 5)); //? Sun Nov 19 2037 15:23:05 GMT+0530 (India Standard Time) //? month is 0 based so 10 is nov

// //* js also autocorrect the dates 
// console.log(new Date(2037, 10, 31)); //? Tue Dec 01 2037 00:00:00 GMT+0530 (India Standard Time) //? it will autocorrect the date to 1st dec

// //! timestamp
// console.log(new Date(0)); //? Thu Jan 01 1970 05:30:00 GMT+0530 (India Standard Time) //? this is the unix time stamp
// console.log(new Date(3 * 24 * 60 * 60 * 1000)); //? Sun Jan 04 1970 05:30:00 GMT+0530 (India Standard Time) //? this is the unix time stamp for 3 days

// //! working with dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future.getFullYear()); //? 2037
// console.log(future.getMonth()); //? 10
// console.log(future.getDate()); //? 19
// console.log(future.getDay()); //? 4 //? this is the day of the week 0 is sunday and 6 is saturday
// console.log(future.getHours()); //? 15
// console.log(future.getMinutes()); //? 23
// console.log(future.getSeconds()); //? 0
// console.log(future .toISOString()); //? 2037-11-19T09:53:00.000Z //? this is the standard format for dates in js and it is called iso string format and it is used to store dates in databases 
// console.log(future.getTime()); //? 2142275580000 //? this is the time stamp

// //if we want to get the current timestamp we can do this
// console.log(Date.now()); //? 1628521620000

// //! set methods
// //we can also set date and time using set methods
// future.setFullYear(2040); //? Sun Nov 19 2040 15:23:00 GMT+0530 (India Standard Time)

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future); //? 2142275580000 //? this will convert the date to timestamp

// const daysPassed = (date1, date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
// console.log(daysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24))); //? 10

// //* if we want more precise calculation with dates like hours and minutes we can use moment.js library

// const now = new Date();
// new Intl.DateTimeFormat('en-US').format(now);

// //* Intl is a namespace for internationalization api and then we doo Dateformat and then we pass the locale as a string locale is a language and country code and then we call format method and pass the date we want to format

// //* passing the argument in the settimeout function is not that easy because we are not calling that function so set timeout have a solution for this arguments of the delayed fucntion will come after the timer as a argument of the set timeout

// const ing = ['olives', 'spinach'];

// const pizzaTimer = setTimeout((ing1, ing2) => console.log(`Here is your Pizza 🍕 with ${ing1} and ${ing2}`), 3000, ...ing); //after 3s we get the pizza message
// //* the first argument of the setTimeout is the function that we want to execute in the future and the second argument is the time in milisecond.

// //* js we encounter the settimeout it register it and count down in the background to execute this function but immediatly move to the next line and when time complete execute that function this is called asincronous 
// console.log('waiting...'); //this will print before the settimeout function

// //* we can also delete the timer of the timeout
// if(ing.includes('spinach')) clearTimeout(pizzaTimer); //this will cencel the pizza timer if it ing is spinach

// //! setInterval
// setInterval(function(){
//   const now = new Date();
//   console.log(now);
// }, 1000)
// //this will display time after every 1 sec
