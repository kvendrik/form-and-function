<?php

	session_start();
	require_once("twitteroauth/twitteroauth.php");

	$api_key = "KqKBQ8Ub85i9AyhDzos1WtAur";
	$api_key_secret = "iThxY0G4rlvvFygv4JHqfW109MtaBmofVGyRyGhfrr0X98sOon";
	$access_token = "583739599-0RO9b6YmEbWNlNbio9YCTr89Ah7ifGg6pUbw7hFd";
	$access_token_secret = "zx756CBUzdTcoTvi6l3qQlD1oaigsb59g3olLfXVT2imW";

	$connection = new TwitterOAuth($api_key, $api_key_secret, $access_token, $access_token_secret);

	//re-encode url
	$query = urlencode($_POST['query']);
	$limit = 5;

	$tweets = $connection->get("https://api.twitter.com/1.1/search/tweets.json?q=".$query."&count=".$limit."&result_type=mixed&include_entities=true&sort=-date");

	echo json_encode($tweets);

?>