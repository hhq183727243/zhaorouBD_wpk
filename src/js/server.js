const weui = require('./lib/weui.min.js');

const css = [
	//'../assets/css/bootstrap.min.css',
	'http://www.xmadvance.com/cdn/ace.min.css',
]

const head = document.getElementsByTagName('head');

css.forEach(item => {
	let linkTag = document.createElement('link');

	linkTag.rel = 'stylesheet';
	linkTag.href = item;

	//linkTag.integrity = 'sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u';
	//linkTag.crossorigin = 'anonymous';

	head[0].appendChild(linkTag);
});

module.exports = {
    getJSON: function(url,callback){
        $.ajax({
            url: url,
            type: 'get',
            traditional: true,
            success: function(result){
                if(typeof result != 'object'){
                    try{
                        result = JSON.parse(result);
                    }catch(e){
                        result = {
                            code: 500,
                            data: '返回数据非json格式'
                        }
                    }
                }

                if(200 == result.code){
                    if (typeof callback == 'function') callback(result);
                }else{
                    if(result.code == 401){
                        window.location.href = '/page/login.html';
                    }else{
                        weui.alert(result.data);
                    }
                }

                if(!!window.load){
                    window.load.hide();
                }
            },
            error: function(result){
                if(!!window.load){
                    window.load.hide();
                }

                weui.alert(result.data);
            }
        });
    },
    postJSON: function(url,data,callback){
        $.ajax({
            url: url,
            type: 'post',
            data: data,	
            traditional: true,
            success: function(result){
                if(typeof result != 'object'){
                    try{
                        result = JSON.parse(result);
                    }catch(e){
                        result = {
                            code: 500,
                            data: '返回数据非json格式'
                        }
                    }
                }

                if(200 == result.code){
                    if (typeof callback == 'function') callback(result);
                }else{
                    if(result.code == 401){
                        window.location.href = '/page/login.html';
                    }else{
                        weui.alert(result.data);
                    }
                }

                if(!!window.load){
                    window.load.hide();
                }
            },
            error: function(result){
                if(!!window.load){
                    window.load.hide();
                }

                weui.alert(result.data);
            }
        });
    }
}