import { ComponentFixture } from '@angular/core/testing';
import { compose } from '@ngrx/core';
import * as cheerio from 'cheerio';
import * as parse5 from 'parse5';
const Serializer = require('parse5/lib/serializer');
const pretty = require('pretty');


const originalEscapeString = Serializer.escapeString;

Serializer.escapeString = function (str, ...args) {
  if (!Boolean(str)) {
    return str;
  }

  return originalEscapeString(str, ...args);
}

const treeAdapter = parse5.treeAdapters.htmlparser2;

function removeAngularSpecificMarkup(content: string) {
  const $ = cheerio.load(content);

  $('*').each((_, element) => {
    const attribs = Object.keys(element.attribs)
      .filter(attr => !(attr.startsWith('_ng')))
      .reduce((all, next) => {
        return Object.assign(all, { [next]: element.attribs[next] });
      }, {});

    element.attribs = attribs;
  });

  $.root().find('*').contents().filter((_, element) => element.type === 'comment').remove();

  return $.html();
}

function serializeNode(node) {
  return parse5.serialize(node, { treeAdapter: parse5.treeAdapters.htmlparser2 });
}

function mapToTemplate(el: any) {
  return isTemplateElement(el) ? treeAdapter.getTemplateContent(el) : el;
}

function mapFixtureToNode(fixture: ComponentFixture<any>) {
  return fixture.debugElement.nativeElement;
}

function isTemplateElement(el: any): boolean {
  return isElementNode(el) && el.tagName === 'template';
}

function isElementNode(node: any): boolean {
  return node ? treeAdapter.isElementNode(node) : false;
}

const serializeComponentFixture = compose(
  pretty,
  removeAngularSpecificMarkup,
  serializeNode,
  mapToTemplate,
  mapFixtureToNode
);

ComponentFixture.prototype['toJSON'] = function () {
  return serializeComponentFixture(this);
};
