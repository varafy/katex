/**
 * Created by jsharp on 2015-11-24.
 *
 *      Varafy Inc.
 *
 */

//console.log('top of htmltoLatex');
//window.HtmlToLatex = window.HtmlToLatex || {};
var HtmlToLatex = {};
//(function(HtmlToLatex) {
  var isAllowed = function($el) {
    return isVariable($el) || isVariableValue($el);
  };

  var isVariable = function($el) {
    return ($el.hasClass('variable-container') && $el.hasClass('finished'));
  };

  var isVariableValue = function($el) {
    return $el.hasClass('variable-container-value');
  };

  HtmlToLatex.parseMathjaxBase = function(html) {
    // Delete Styles and various other things through jquery. Thanks jquery.
    var $wrapper = $('<div>').html(html);
    $wrapper.find('*').each(function(i, el) {
      el.removeAttribute('style');
      var $el = $(el);
      if (isAllowed($el)) {
        return;
      }

      if ($el.attr('class') || $el.attr('id')) {
        $el.remove();
      }
    });

    html = $wrapper.html();

    // start replacing gross things.
    // html = html
    //     .replace(/<span>/g,       '')
    //     .replace(/<\/span>/g,      '')
    //     .replace(/<div>/g,        '')
    //     .replace(/<\/div>/g,       '')
    //     .replace(/<br>/g,        '')

    return html;
  };

  HtmlToLatex.parseMathjaxVars = function(html) {
    var $wrapper = $('<div>').html(html);
    $wrapper.find('*').each(function(i, el) {
      var $el = $(el);
      var name = $el.html();

      if (isVariable($el)) {
        $el.removeClass('highlight');
        $el.replaceWith('\\class{' + el.className + '}{\\text{' + name + '}}');
      }

      if (isVariableValue($el)) {
        $el.replaceWith('\\class{' + el.className + '}{' + name + '}');
      }
    });

    return $wrapper.html();
  };

  HtmlToLatex.parseMathjaxLatex = function(html) {
    html = html
      .replace(/<span>/g,       '')
      .replace(/<\/span>/g,      '')
      .replace(/<div>/g,         '')
      .replace(/<\/div>/g,       '')
      .replace(/<br>/g,          '')
      .replace(/&nbsp;/g,        ' ')
      .replace(/&zwnj;/g,          '')
      .replace(/\\ref{(.*?)}/g,    '')
      .replace(/\\href{(.*?)}{(.*?)}/g,   '')
      .replace(/\\href{(.*?)}/g,    '')
      .replace(/\\cssId{(.*?)}{(.*?)}/g,   '')
      .replace(/\\cssId{(.*?)}/g,   '')
      .replace(/\\label{(.*?)}/g,    '')
      .replace(/&lt;variable&gt;/g, '< variable >')
      .replace(/&lt;\/variable&gt;/g, '</ variable >')
      .replace(/&lt;/g,        '<')
      .replace(/&gt;/g,        '>')
      .replace(/&amp;/g,        '&');
    return html;
  };

  HtmlToLatex.parseMathjaxInput = function(html) {
    var defrd = $.Deferred();
    $.when(HtmlToLatex.parseMathjaxVars(html)).done(function(html2) {
      defrd.resolve(HtmlToLatex.parseMathjaxLatex(HtmlToLatex.parseMathjaxBase(html2)));
    });

    return defrd.promise();
  };


//})(window.HtmlToLatex);