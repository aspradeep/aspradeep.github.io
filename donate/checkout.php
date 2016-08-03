<?php
function request($currency,$amount) {
	$url = "https://test.oppwa.com/v1/checkouts";
	$data = "authentication.userId=8a8294174b7ecb28014b9699220015cc" .
		"&authentication.password=sy6KJsT8" .
		"&authentication.entityId=8a8294174b7ecb28014b9699220015ca" .
		"&amount=$amount" .
		"&currency=$currency" .
		"&paymentType=DB";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);// this should be set to true in production
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$responseData = curl_exec($ch);
	if(curl_errno($ch)) {
		return curl_error($ch);
	}
	curl_close($ch);
	return $responseData;
}

$errors = array();  // array to hold validation errors
$data = array();        // array to pass back data

// validate the variables ========
if (empty($_REQUEST['currency'])){
	$errors['currency'] = 'Currency is required.';
}

if (empty($_REQUEST['amount'])){
	$errors['amount'] = 'Amount is required.';
}elseif($_REQUEST['amount'] > 100){
	$errors['amount'] = 'Please Enter an amount less than 100';
}


if ( ! empty($errors)) {
	$data['success'] = false;
	$data['errors']  = $errors;
} else {
	$data['success'] = true;
	$data['currency'] = $_REQUEST['currency'];
	$data['amount'] = $_REQUEST['amount'];
	$responseData = request($_REQUEST['currency'],$_REQUEST['amount']);
	$responseData = json_decode ($responseData,true);
	$data['responseData'] = $responseData['id'];
	$data['message'] = 'Success!';
}

echo json_encode($data);
?>