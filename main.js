/**
 * Created by JSHARP on 15-04-13.
 *
 *      Varafy Inc.
 *
 */

var math = {render: {}},
    Util = {};

$(function () {

    var $katex_container = $('#katex_content'),
        $mathjax_container = $('#mathjax_content');

    Util.rand = function (min, max, inc) {
        var domain = min - inc,
            range  = (max - domain) / inc,
            num = inc * (Math.ceil(Math.random() * range + domain / inc));
        return num;
    };

    math.render.katex = function (container) {
        // render the containers LaTeX code
        var container = container || document.getElementById('katex_content');
        renderMathInElement(
            container,
            {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "\\[", right: "\\]", display: true},
                    {left: "$", right: "$", display: false},
                    {left: "\\(", right: "\\)", display: false}
                ]
            }
        );
    };

    MathJax.Hub.Queue([
        "Typeset",
        MathJax.Hub,
        document.getElementById("mathjax_content")
    ]);

    math.render.katex();


});