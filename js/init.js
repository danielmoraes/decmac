var app_url = window.location.protocol + '//' + window.location.host + '/';

var debug_mode = false;
if (window.location.host == "localhost" ||
    window.location.host == "127.0.0.1") {
	debug_mode = true;
}

var css_files = [
    app_url + 'css/roboto.css',
    app_url + 'css/main.css',
    app_url + 'libs/jquery.countdown/jquery.countdown.css'
];

var js_files = [
    '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
    app_url + 'libs/jquery-ui-1.10.3/ui/minified/jquery-ui.min.js',
    app_url + 'libs/highcharts/js/highcharts.js',
    app_url + 'libs/jquery.countdown/jquery.countdown.js',
    app_url + 'js/util.js', app_url + 'js/main.js'
];

for (var i = 0; i < css_files.length; i++) {
	document.write('<l'+'ink rel="stylesheet" href="' + css_files[i] + '" />');
}

for (var i = 0; i < js_files.length; i++) {
	document.write('<s'+'cri' + 'pt type="text/javascript" src="' +
        js_files[i] + '" type="text/javascript" charset="utf-8"></script>');
}
