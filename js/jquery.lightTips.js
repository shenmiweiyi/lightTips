/*!
 * lightTips v0.0.1
 * by Liuyuchao
 * Copyright 2015.7
 * Date: Jul Feb 07 2015
 */

 ;(function($,window,document){

    var pluginName = 'lightTips',
        defaults = {

            //默认属性配置
            opacity: 1,  //背景透明度
            background: '#000',  //背景色
            width: null,  //宽度，默认自适应
            speed: 300,  //显示速度,slow,normal,fast,表示动画时长的毫秒数值（如：2000）
            position: 'top',  //提示层相对元素显示位置,top,bottom,left,right
            trigger: 'hover',  //响应事件,hover,click
            callback: function(){}  //回调函数
        };

    function LightTips(element,options){
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();        
    }
    
    LightTips.prototype = {
        
        init: function(){
            var that = this,
                element = this.element;
                
            that.bindTipEvent(element);
        },

        getIdByElement: function(element){
            var $this = $(element),
                elementID = $this.attr('id');
                
            if(typeof(elementID) !== 'undefined'){
                return elementID;      
            }else{
                elementID = '';
                return elementID;
            }    
        },
        
        getClassNameByElement: function(element){
            var $this = $(element),
                className = $this.attr('class');
                
            if(typeof(className) !== 'undefined'){
                return className;
            }else{
                className = '';
                return className;
            }
        },

        getTipContent: function(element){
            var $this = $(element);
            
            return $this.attr('data-light-tips-content');
        },

        getTipImage: function(element){
            var $this = $(element),
                tipImage = $this.attr('data-light-tips-image');

            if(typeof(tipImage) !== 'undefined'){
                return tipImage;
            }else{
                tipImage = '';
                return tipImage;
            }
            
        },

        hexToRGB: function(color){
            var that = this,
                hexReg = /^#[0-9a-fA-F]{3}|[0-9a-fA-F]{6}$/,
                hexColor = color.toLowerCase(),
                hexColorLength = hexColor.length,
                newHexColor = '#',
                RGBColor = [];

            if(hexColor && hexReg.test(hexColor)){
                if(hexColorLength === 4){
                    for(var i = 1; i < 4; i+=1){
                        newHexColor += hexColor.slice(i,i+1).concat(hexColor.slice(i,i+1));
                        RGBColor.push(parseInt('0x' + newHexColor.slice(i,i+2)));
                    }
                }else if(hexColorLength === 7){
                    for(var i = 1; i < 7; i+=2){
                        RGBColor.push(parseInt('0x' + hexColor.slice(i,i+2)));
                    }
                }
                return RGBColor.join(',');
            }else{
                return;
            }
        },

        renderTip: function(element){
            var that = this,
                $this = $(element),
                tipId = that.createTipId(element),
                tipContent = that.getTipContent(element),
                tipImage = that.getTipImage(element),
                lightTipsHtml = '';

            if(tipImage !== ''){
                lightTipsHtml = '<div id="' + tipId + '" class="light-tips"><div class="light-tips-content">' + tipContent + '</div><img src="' + tipImage + '" /><span class="light-tips-arrow"></span></div>';
            }else{
                lightTipsHtml = '<div id="' + tipId + '" class="light-tips"><div class="light-tips-content">' + tipContent + '</div><span class="light-tips-arrow"></span></div>';
            }

            return lightTipsHtml;
        },

        createTipId: function(element){
            var that = this,
                tipId = that.getIdByElement(element),
                tipClassName = that.getClassNameByElement(element);

            if(tipId !== ''){
                return 'tip-' + tipId;
            }else if(tipId === '' && tipClassName !== ''){
                return 'tip-' + tipClassName;
            }
        },

        getTipPosition: function(element){
            var that = this,
                $this = $(element),
                position = that.settings.position;

            var elementLeft = $this.offset().left,
                elementTop = $this.offset().top,
                elementWidth = $this.outerWidth(),
                elementHeight = $this.outerHeight(),
                tipWidth = $('.light-tips').outerWidth(),
                tipHeight = $('.light-tips').outerHeight();

            var tipPosition;

            switch (position){
                case 'top':
                    tipPosition = {
                        top: elementTop - tipHeight - 6,
                        left: elementLeft + elementWidth/2 - tipWidth/2
                    }
                    break;
                case 'bottom':
                    tipPosition = {
                        top: elementTop + elementHeight + 6,
                        left: elementLeft + elementWidth/2 - tipWidth/2   
                    }
                    break;
                case 'left':
                    tipPosition = {
                        top: elementTop + elementHeight/2 - tipHeight/2,
                        left: elementLeft - tipWidth - 6
                    }
                    break;
                case 'right':
                    tipPosition = {
                        top: elementTop + elementHeight/2 - tipHeight/2,
                        left: elementLeft + elementWidth + 6
                    }
                    break;
            }

            return tipPosition;

        },

        setTipStyle: function(element){
            var that = this,
                $this = $(element),
                $tip = $('.light-tips'),
                $tipArrow = $tip.children('.light-tips-arrow'),
                opacity = that.settings.opacity,
                background = that.settings.background,
                backgroundRGB = that.hexToRGB(that.settings.background),
                width = that.settings.width,
                position = that.settings.position,
                tipPosition = that.getTipPosition(element);

            $tip.css({
                'background': function(){
                    if(!$.support.leadingWhitespace){
                        return 'RGB(' + backgroundRGB + ')';
                    }else{
                        return 'RGBA(' + backgroundRGB + ',' + opacity + ')';
                    }
                },
                'width': function(){
                    if(width !== null){
                        return width + 'px';
                    }else{
                        return;
                    }
                },
                top: tipPosition.top + 'px',
                left: tipPosition.left + 'px'
            });

            $tipArrow.css({
                'border-color': function(){
                    switch(position){
                        case 'top':
                            return background + ' transparent transparent transparent';
                            break;
                        case 'bottom':
                            return 'transparent transparent ' + background + ' transparent';
                            break;
                        case 'left':
                            return 'transparent transparent transparent ' + background;
                            break;
                        case 'right':
                            return 'transparent ' + background + ' transparent transparent';
                            break;
                    }
                },
                'opacity': that.settings.opacity,
                'filter': function(){
                    if(!$.support.leadingWhitespace){
                        return 'alpha(opacity=100)';
                    }else{
                        return 'alpha(opacity=' + that.settings.opacity*100 +')';
                    }
                }
            });

            switch(position){
                case 'top':
                    $tipArrow.addClass('arrow-bottom');
                    break;
                case 'bottom':
                    $tipArrow.addClass('arrow-top');
                    break;
                case 'left':
                    $tipArrow.addClass('arrow-right');
                    break;
                case 'right':
                    $tipArrow.addClass('arrow-left');
                    break;
            };
        },

        show: function(element){
            var that = this,
                speed = that.settings.speed,
                lightTipsHtml = that.renderTip(element);

            $('body').append(lightTipsHtml);
            that.setTipStyle(element);
            $('.light-tips').fadeIn(speed);
        },

        hide: function(){
            var that = this,
                speed = that.settings.speed;

            $('.light-tips').remove();
        },

        triggerCallback: function(){
            var that = this;

            if($.isFunction(that.settings.callback)){
                that.settings.callback();
            }
        },

        bindTipEvent: function(element){
            var that = this,
                $this = $(element),
                time = that.settings.delay,
                tipEvent = that.settings.trigger,
                callback = that.settings.callback;

            switch(tipEvent){
                case 'hover':
                    $this.hover(function(){
                        that.hide();                     
                        that.show(element);
                        that.triggerCallback.call(that);
                    },function(){
                        that.hide();
                    });
                    break;
                case 'click':
                    $this.click(function(){
                        that.hide();
                        if($('.light-tips').length > 0){
                            return;
                        }else{
                            that.show(element);
                        }
                        that.triggerCallback.call(that);
                        return false;
                    });

                    $(document).click(function(){
                        that.hide();
                    })
                    break;
            }
        } 
        
    };
        
    $.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new LightTips(this, options));           
            }
        });
        return this;
    };
    
 })(jQuery,window,document);