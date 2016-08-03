<?php
function request($resourcePath) {
	$url = "https://test.oppwa.com/v1/checkouts/".$resourcePath."/payment";
	$url .= "?authentication.userId=8a8294174b7ecb28014b9699220015cc";
	$url .= "&authentication.password=sy6KJsT8";
	$url .= "&authentication.entityId=8a8294174b7ecb28014b9699220015ca";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);// this should be set to true in production
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$responseData = curl_exec($ch);
	if(curl_errno($ch)) {
		return curl_error($ch);
	}
	curl_close($ch);
	return $responseData;
}
$responseData = request($_REQUEST['resourcePath']);

$data['success'] = true;
$responseData = request($_REQUEST['resourcePath']);
//$responseData = json_decode ($responseData,true);
$data['responseData'] = $responseData;
$data['message'] = 'Success!';


echo json_encode($data);
?>