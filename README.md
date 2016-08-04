Donate WebApp SPA
====================

Author: [Pradeep S](http://kavisoftek.in)

This app runs as a Single Page Application with the help of AngularJS. This app makes a test payment using Pay On API.

This app runs process payment in 3 Steps (App is SPA, Pages are mentioned for the reference Purpose only)

### Step 1 (Home Page)
In this step the user selects the Preferred Currency(1) and Enters the Amount(2) He/She wishes to pay.

(1) - Currency is a required Field.
(2) - Amount is a required Field and it cannot be more than 100.

### Step 2 (Payment Page)
From the Step 1, a checkout id is generated for the current user session which is passed over to Step 2, where the user enters his/her card details. On entering the card details, The Payment will processed through the Provider and returned to Step 3.

### Step 3 (Thank You Page)
On Successful payment, User will be sent to this page, where they can see their payment details.


### Additional Notes
1. All User data are stored in Local Window Session Storage and will be retrieved from the same.
2. An User can donate only in once in an hour and This will compared by the current time and the time at which they made the payment.
