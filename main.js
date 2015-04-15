/**
 * Created by JSHARP on 15-04-13.
 *
 *      Varafy Inc.
 *
 */

var Util = {},
    math = {
        render: {},
        text: "$$r = (variable1_2-variable2_1)\\vec{i}+(y_2-y_1)\\vec{j}+(variable3_2-z_1)\\vec{k}$$" +
              "$$+\\uparrow\\sum F_x=variable4,\\sum F_y=0,\\sum F_z=0$$" +
              "$$+\\circlearrowright\\sum M_{variable5} = 0$$" +
              "$$x = \\frac{ - b \\pm \\sqrt {variable6^2 - 4(variable7)c} }{2a}$$" +
              "$$f(x) = \\int_{variable8}^variable9\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi$$" +
              "$$\\int u \\frac{dv}{variable9}\\,dx=u(variable7)-\\int \\frac{variable3}{dx}v\\,dx$$",
        map: {
            variable1: function () {return Util.rand(0, 300, 1);},
            variable2: function () {return Util.rand(0, 300, 1);},
            variable3: function () {return Util.randStr(['Carbon', 'Petroleum', 'c', 'efghh', 'variableName']);},
            variable4: function () {return Util.rand(0, 300, 1);},
            variable5: function () {return Util.randStr(['Carbon', 'Petroleum', 'c', 'efghh', 'variableName']);},
            variable6: function () {return Util.rand(0, 300, 1);},
            variable7: function () {return Util.randStr(['Carbon', 'Petroleum', 'c', 'efghh', 'variableName']);},
            variable8: function () {return Util.rand(0, 300, 1);},
            variable9: function () {return Util.rand(0, 300, 1);}
        }
    };

$(function () {

    var $katex_container = $('.katex_content'),
        $mathjax_container = $('.mathjax_content');

    /**
     *
     * jQuery & Bootstrap binding
     *
     */

    $('#myTab').tab();
    // Toggle Example Button Controls
    $('#myTab > li').click(function (e) {
        var _id = e.target.getAttribute('aria-controls');
        $('.btn-group').hide();
        $('#' + _id + '-actions').show();
    });

    $('#randomize').click(function () {
        var str = math.text;
        for (var variable in math.map) {
            str = str.replace(new RegExp(variable, 'g'), math.map[variable]());
        }
        $mathjax_container[0].innerHTML = str;
        $katex_container[0].innerHTML = str;
        math.render.mathjax();
        math.render.katex();
    });

    Util.rand = function (min, max, inc) {
        var domain = min - inc,
            range  = (max - domain) / inc,
            num = inc * (Math.ceil(Math.random() * range + domain / inc));
        return num;
    };

    Util.randStr = function (list) {
        return list[this.rand(0, list.length - 1, 1)];
    };

    math.render = {
        katex: function (container) {
            // render the containers LaTeX code
            var container = container || document.getElementsByClassName('katex_content')[0];
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
        },
        mathjax: function (container) {
            var container = container || document.getElementsByClassName('mathjax_content')[0];
            MathJax.Hub.Queue([
                "Typeset",
                MathJax.Hub,
                container
            ]);
        }
    };

    math.render.mathjax();
    math.render.katex();

    math.render.mathjax($mathjax_container[1]);
    math.render.katex($katex_container[1]);

    math.render.mathjax($mathjax_container[2]);
    math.render.katex($katex_container[2]);

});