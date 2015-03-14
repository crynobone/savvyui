# Introduction #
Savvy.UI is an open source JavaScript UI Library powered by [jQuery JavaScript Library](http://jquery.com) mainly for it's robust DOM Manipulation Engine.

Here's a example of Savvy.UI in action.
```
Js.setup.widget.tab({
	handler: "click"
});

var tab = new Js.widget.tab("#result");
tab.addTab({
	id: "hello-world",
	title: "Hello world",
	closable: true,
	content: "<p>Hello world</p>"
});
```
## Why jQuery? ##
During the early iteration of Savvy.UI we developed and managed DOM Manipulation Engine but there are numbers of weakness and flaws. This had slow down the development of other modules in Savvy.UI which would be far useful if added to the library rather than sitting down and , so we decided to source out the selector engine and what ever else which already there in any opensource JavaScript Framework.

jQuery is our #1 choice for these reason:
  1. Fast CSS Selector Engine, include support to CSS3 and XPath
  1. Extensive DOM Manipulation and Traversing Technique
  1. Smoother Animation compared to `Js.ext.animator`
  1. The core is focus to DOM Manipulation which give us room to extend it using our module

## Is Savvy.UI a jQuery Plugin? ##
No, Savvy.UI only utilized jQuery but at the same time we also maintain our own global namespace consisting of two; `Js` and `Jrun`.
# Requirement #
  1. jQuery JavaScript Library
  1. Modern Internet Browser<br><i>Savvy.UI have been tested in IE6, IE7, Opera 9.5, Mozilla FireFox 3 and Safari</i>
<h1>Documentation</h1>
</li></ul><ul><li><a href='Downloading.md'>Downloading Savvy.UI</a>
</li><li><a href='GettingStarted.md'>Getting Started</a>
</li><li><a href='Core.md'>Core Documentation</a>
<ul><li><a href='Core_Widget_Tab.md'>Core/Widget/Tab Documentation</a></li></ul></li></ul>
