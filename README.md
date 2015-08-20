# lightTips

lightTips is a jQuery plugin of applied to any element of portable prompts.

## Features

* Support custom style
* Support show image
* Support IE7+,Firefox3+,Chrome and Oprea

## Usage

html code:

```
<div class="test" data-light-tips-content="hello!" data-light-tips-image="images/test.jpg">I am a Tip plugins</div>
```

Link to the **jQuery.js** file:

```
<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
```

Link to the **jquery.lightTips.js** file:

```
<script src="js/jquery.lightTips.js"></script>
```

Add the **CSS** file:

```
<link rel="stylesheet" type="text/css" href="css/jquery.lightTips.css">
```

To initialize:

```
$('.test').lightTips({
	opacity: .5,
	trigger: 'hover',
	position: 'top'
})
```

## License

Copyright © 2015 YuChao Liu Licensed under the MIT license.