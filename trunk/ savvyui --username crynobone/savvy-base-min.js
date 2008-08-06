var SUI=window.SUI=function(sel,parent){var sel=sel||document;if(this===window&&!!SUI.Elements){return new SUI.Elements(sel,parent)}else{return this}};SUI.namespace={lists:[],include:function(name,fn){SUI.namespace.lists[SUI.namespace.lists.length]=name;SUI[name]=fn;return SUI[name]},require:function(name){var isload=this.loaded(name);if(!isload){SUI.fn.logger("Required Namespace SUI."+name+" is not loaded")}return isload},loaded:function(name){return SUI.namespace.inArray(SUI.namespace.lists,name)}};SUI.toString=function(){return["Savvy.UI","version",SUI.fn.version].join(" ")};SUI.extend=function(name,fn){if(SUI.fn.isfunction(fn)&&!!SUI.Elements){SUI.Elements.prototype[name]=fn}};SUI.fn={_$:null,version:"0.1.4-ab1",behaviour:function(){return function(){var win=window;var doc=document;var items={ie:false,ie6:false,ie7:false,khtml:false,gecko:false,opera:false};items.ie=items[win.XMLHttpRequest?"ie7":"ie6"]=(win.ActiveXObject?true:false);items.khtml=((doc.childNodes&&!doc.all&&!navigator.taintEnabled)?true:false);items.gecko=(doc.getBoxObjectFor!=null?true:false);items.opera=(items.opera?true:false);return items}()}(),browser:function(){return function(){var items={ie:navigator.appName=='Microsoft Internet Explorer',java:navigator.javaEnabled(),ns:navigator.appName=='Netscape',ua:navigator.userAgent.toLowerCase(),version:parseFloat(navigator.appVersion.substr(21))||parseFloat(navigator.appVersion),win:navigator.platform=='Win32',opera:false,gecko:false,mac:false};items.mac=items.ua.indexOf('mac')>=0;if(items.ua.indexOf('opera')>=0){items.ns=items.ie=false;items.opera=true}if(items.ua.indexOf('gecko')>=0){items.ie=items.ns=false;items.gecko=true}return items}()}(),camelize:function(values){var data=values.split(/\-/);if(data.length){return data[0]}var value=(values.indexOf('-')==0?data[0].charAt(0).toUpperCase()+data[0].substr(1):data[0]);for(var i=1;i<data.length&&data[i];i++){value+=data[i].charAt(0).toUpperCase()+data[i].substr(1)}return value},debug:false,callback:function(node,fn,args){if(this.isfunction(fn)){try{var args=this.toArray(arguments,2);fn.apply(node,args)}catch(e){fn.call(node,args)}}return node},each:function(node,fn,args){if(this.isfunction(fn)){for(var i=0;i<node.length&&!!node[i];i++){try{var args=this.toArray(arguments,2);fn.apply(node[i],[node[i],i])}catch(e){fn.call(node[i],node[i]+","+i)}}}},extend:function(name,fn){SUI.extend(name,fn)},finds:function(elem){return(document.getElementById(this.trim(elem))?true:false)},prepare:function(node,elem,value){var value=(this.isset(value)&&value.match(/(object|element)/g)?value:"element");var data=[this.isset(node),this.isset(elem)];return(function(node,elem,value,data){if(data[0]&&data[1]){return(SUI.Attr.Get(node,"id")==elem?(value=="object"?node:elem):false)}else if(data[1]){return(value=="object"?document.getElementById(elem):elem)}else if(data[0]){return(value=="object"?node:SUI.Attr.Get(node,"id"))}else{return false}})(node,elem,value,data)},href:function(url,target){try{if(this.isnull(target)){window.location.href=url}else{window.open(url,target)}}catch(e){this.logger("SUI.fn.href() failed: "+e)}},htmlEntities:function(value){return value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\+/g,"&#43;")},htmlEntityDecode:function(value){return value.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#43;/g,"+")},"indexOf":function(data,value){for(var i=data.length;i--&&data[i]!==value;);return i},inArray:function(data,value){for(var i=0;i<data.length&&!!data[i];i++){if(data[i]===value){return true;break}}return false},isnull:function(value){return(typeof(value)=="undefined"||value==null)},isset:function(value){return(this.isnull(value)?false:true)},isfunction:function(value){return((!!value&&typeof(value)==="function")?true:false)},logs:[],logger:function(text){var text=this.trim(text);this.logs[this.logs.length]=text;if(this.debug){try{console.log(text)}catch(e){alert(text)}}return false},ltrim:function(value){return new String(value).replace(/^\s+/g,"")},on:function(node,handler,fn1,fn2){var handler=this.trim(handler);try{if(!!node&&node!==document){if(handler==="hover"){if(this.isfunction(fn1)){node["onmouseover"]=fn1}if(this.isfunction(fn2)){node["onmouseout"]=fn2}}else{if(this.isfunction(fn1)){node["on"+handler]=fn1}}}}catch(e){this.logger("SUI.fn.on() failed: "+fn+e)}},pick:function(value){var data=arguments;for(var i=0;i<data.length;i++){if(this.isset(data[i])){return data[i]}}return null},rtrim:function(value){return new String(value).replace(/\s$/g,"")},stripTags:function(value){return new String(value).replace(/<([^>]+)>/g,'')},serialize:function(data){var val=[];if(this.typeOf(data)==="array"){for(var i=0;i<data.length&&data[i];i++){if(!!SUI.Parser){data[i].value=SUI.Parser.HTML.to(data[i].value)}val[val.length]=data[i].name+"="+data[i].value}}else if(this.typeOf(data)=="object"){for(var value in data){if(!!SUI.Parser){data[value]=SUI.Parser.HTML.to(data[value])}val[val.length]=value+"="+data[value]}}else{return""}return val.join("&")},toNumber:function(value){return(typeof(value)=="string"?parseInt(value,10):value)},toArray:function(values,offset){var offset=(this.isnull(offset)||offset<1?0:offset);if(this.isnull(values)){return[]}else{var offsetLength=(values.length-offset);var valueLength=values.length;var rdata=[];while(offsetLength>0){--offsetLength;--valueLength;rdata[offsetLength]=values[valueLength]}return rdata}},trim:function(value){return new String(value).replace(/^\s+|\s+$/g,"")},typeOf:function(value){if(typeof(value)=="object"){if(value.length>0&&value[0].nodeType){return"HTMLelement"}else if(value.constructor===Array){return"array"}else if(value.nodeType){return"HTMLelement"}else if(value.constructor!==Object){return"function"}else{return"object"}}else{return typeof(value)}},unique:function(data,value){var value=this.pick(value,false);var rdata=[];for(var i=0;i<data.length&&!!data[i];i++){if(!value){if(!this.inArray(rdata,data[i])){rdata[rdata.length]=data[i]}}else{if(i==0){rdata[rdata.length]=data[i]}else if(data[i]!==this.trim(data[i-1])){rdata[rdata.length]=data[i]}}}return rdata}};SUI.namespace.include("Ext",{include:function(name,fn){this.lists[this.lists.length]=name;SUI.namespace.lists[SUI.namespace.lists.length]="Ext."+name;return this[name]=fn},lists:[],require:function(name){var isload=this.loaded(name);if(!isload){SUI.fn.logger("Required Namespace SUI.Ext."+name+" is not loaded.")}return isload},loaded:function(name){return SUI.fn.inArray(this.lists,name)}});SUI.namespace.include("Widget",{include:function(name,fn){this.lists[this.lists.length]=name;SUI.namespace.lists[SUI.namespace.lists.length]="Widget."+name;return this[name]=fn},lists:[],require:function(name){var isload=this.loaded(name);if(!isload){SUI.fn.logger("Required Namespace SUI.Widget."+name+" is not loaded.")}return isload},loaded:function(name){return SUI.fn.inArray(this.lists,name)}});SUI.namespace.include("Tool",{include:function(name,fn){this.lists[this.lists.length]=name;SUI.namespace.lists[SUI.namespace.lists.length]="SUI.Tool."+name;return this[name]=fn},lists:[],require:function(name){var n=this.loaded(name);if(!n){SUI.fn.logger("Required Namespace SUI.Tool."+name+" is not loaded.")}return n},loaded:function(name){return SUI.fn.inArray(this.lists,name)}});SUI.namespace.include("Util",{include:function(name,fn){this.lists[this.lists.length]=name;SUI.namespace.lists[SUI.namespace.lists.length]="Util."+name;return this[name]=fn},lists:[],require:function(name){var isload=this.loaded(name);if(!isload){SUI.fn.logger("Required Namespace SUI.Util."+name+" is not loaded.")}return isload},loaded:function(name){return SUI.fn.inArray(this.lists,name)}});SUI.namespace.include("Storage",{include:function(name,fn){this.lists[this.lists.length]=name;SUI.namespace.lists[SUI.namespace.lists.length]="Storage."+name;return this[name]=fn},lists:[],require:function(name){var isload=this.loaded(name);if(!isload){SUI.fn.logger("Required Namespace SUI.Storage."+name+" is not loaded.")}return isload},loaded:function(name){return SUI.fn.inArray(this.lists,name)}});