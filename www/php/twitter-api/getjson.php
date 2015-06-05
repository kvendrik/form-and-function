<?php

	require "twitteroauth/autoload.php";
	use Abraham\TwitterOAuth\TwitterOAuth;

	define("CONSUMER_KEY", "KqKBQ8Ub85i9AyhDzos1WtAur");
	define("CONSUMER_SECRET", "iThxY0G4rlvvFygv4JHqfW109MtaBmofVGyRyGhfrr0X98sOon");
	$access_token = "583739599-0RO9b6YmEbWNlNbio9YCTr89Ah7ifGg6pUbw7hFd";
	$access_token_secret = "zx756CBUzdTcoTvi6l3qQlD1oaigsb59g3olLfXVT2imW";

	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token, $access_token_secret);

	$tweets = $connection->get("search/tweets", array(
		"q" => $_POST['query'],
		"count" => 25,
		"include_entities" => true,
		"exclude_replies" => true,
		"result_type" => "recent"
	));

	echo json_encode($tweets);

?>