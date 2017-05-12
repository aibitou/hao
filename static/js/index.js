// 这一段使得FireFox也支持IE的innerText方法 
function isIE() {
	if(window.navigator.userAgent.toLowerCase().indexOf("msie") >= 1)
		return true;
	else
		return false;
}
if(!isIE()) { //firefox innerText define 
	HTMLElement.prototype.__defineGetter__("innerText",
		function() {
			var anyString = "";
			var childS = this.childNodes;
			for(var i = 0; i < childS.length; i++) {
				if(childS[i].nodeType == 1)
					anyString += childS[i].tagName == "BR" ? '\n' : childS[i].innerText;
				else if(childS[i].nodeType == 3)
					anyString += childS[i].nodeValue;
			}
			return anyString;
		}
	);
	HTMLElement.prototype.__defineSetter__("innerText",
		function(sText) {
			this.textContent = sText;
		}
	);
}
// 这一段使得FireFox的HTMLElement具有click方法（add click method to HTMLElement in Mozilla） 
try {
	// create span element so that HTMLElement is accessible 
	document.createElement('span');
	HTMLElement.prototype.click = function() {
		if(typeof this.onclick == 'function')
			this.onclick({
				type: 'click'
			});
	};
} catch(e) {
	// alert('click method for HTMLElement couldn\'t be added'); 
}
// 对HTMLAnchorElement 加入onclick事件 
try {
	// create a element so that HTMLAnchorElement is accessible 
	document.createElement('a');
	HTMLElement.prototype.click = function() {
		if(typeof this.onclick == 'function') {
			if(this.onclick({
					type: 'click'
				}) && this.href)
				window.open(this.href, this.target ? this.target : '_self');
		} else if(this.href)
			window.open(this.href, this.target ? this.target : '_self');
	};
} catch(e) {
	// alert('click method for HTMLAnchorElement couldn\'t be added'); 
}
// 跟踪回车键事件 
function captureKeys(evt) {
	var keyCode = evt.keyCode ? evt.keyCode :
		evt.charCode ? evt.charCode : evt.which;
	if(keyCode == 13) {
		// cancel key: 
		if(evt.preventDefault) {
			evt.preventDefault();
		}
		var dq = getCookie('default-engine');
		if(dq == null) dq = "baidu_txt";
		submit_query(dq);
		return false;
	}
	return true;
}
// cookie 功能函数 
function getCookie(cookieName) {
	var cookieString = document.cookie;
	var start = cookieString.indexOf(cookieName + '=');
	if(start == -1)
		return null;
	start += cookieName.length + 1;
	var end = cookieString.indexOf(';', start);
	if(end == -1)
		return unescape(cookieString.substring(start));
	return unescape(cookieString.substring(start, end));
}

function setCookie(cookieName, cookieValue) {
	var expires = new Date();
	expires.setTime(expires.getTime() + 3 * 30 * 24 * 60 * 60 * 1000); // 3 months 
	document.cookie = cookieName + '=' + escape(cookieValue) + ';expires=' + expires.toGMTString();
}

function removeCookie(cookieName) {
	var expires = new Date();
	expires.setTime(expires.getTime() - 1);
	document.cookie = cookieName + '=fooxxx;expires=' + expires.toGMTString();
}

function $(id) {
	return document.getElementById(id);
}
// 调式Object用，适用于IE，Firefox下可用firebug 
function dumpObject(obj) {
	var temp = "";
	for(x in obj)
		temp += x + ": " + obj[x] + "\n";
	var popup = window.createPopup();
	popup.document.body.innerHTML = '<textarea rows=30 cols=40>' + temp + '</textarea>';
	popup.show(100, 100, 300, 400, document.body);
}
// 多种查询引擎请求分派 
function submit_query(t_query) {
	var keyword = document.getElementById("keyword");
	var mylink = document.getElementById("mylink");
	var loc = "";
	switch(t_query) {
		case "baidu_txt":
			loc = "http://www.baidu.com/s?wd=" + keyword.value;
			break;
		case "googlevip_txt":
			loc = encodeURI("https://g.sxisa.org/#q=" + keyword.value);
			break;
		case "google_txt":
			loc = encodeURI("https://www.google.com/#q=" + keyword.value);
			break;
		case "360_txt":
			loc = encodeURI("https://www.so.com/s?ie=utf-8&q=" + keyword.value);
			break;
		case "sougou_txt":
			loc = encodeURI("https://www.sogou.com/web?query=" + keyword.value);
			break;
		case "bing_txt":
			loc = encodeURI("http://cn.bing.com/search?q=" + keyword.value);
			break;
		case "chinaso_txt":
			loc = encodeURI("http://www.chinaso.com/search/pagesearch.htm?q=" + keyword.value);
			break;
		case "duck_txt":
			loc = encodeURI("https://duckduckgo.com/?q=" + keyword.value);
			break;
		case "zhihu_txt":
			loc = encodeURI("https://zhihu.sogou.com/zhihu?query=" + keyword.value);
			break;
		case "weixin_txt":
			loc = encodeURI("https://weixin.sogou.com/weixin?query=" + keyword.value);
			break;
		case "weibo_txt":
			loc = encodeURI("http://s.weibo.com/weibo/" + keyword.value);
			break;
		case "toutiao_txt":
			loc = encodeURI("http://www.toutiao.com/search/?keyword=" + keyword.value);
			break;
		case "biaoqing_txt":
			loc = encodeURI("http://www.ubiaoqing.com/search/" + keyword.value);
			break;
	}
	setEngine(t_query);
	setCookie('default-engine', t_query);
	mylink.href = loc;
	mylink.click();
}

function getDefaultEngine() {
	var dq = getCookie('default-engine');
	if(dq == null) dq = "baidu_txt";
	return dq;
}

function setDefaultEngine() {
	var old_e = getDefaultEngine();
	if($(old_e).innerText.indexOf('*') < 0)
		$(old_e).innerText = $(old_e).innerText + '*';
}

function setEngine(new_e) {
	var old_e = getDefaultEngine();
	if($(old_e).innerText.indexOf('*') >= 0)
		$(old_e).innerText = $(old_e).innerText.replace('*', '');
	if($(new_e).innerText.indexOf('*') < 0)
		$(new_e).innerText = $(new_e).innerText + '*';
	setCookie('default-engine', new_e);
}