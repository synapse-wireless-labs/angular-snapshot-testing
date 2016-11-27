import { ComponentFixture } from '@angular/core/testing';
import { compose } from '@ngrx/core';
import * as cheerio from 'cheerio';
const pretty = require('pretty');
const parse5 = require('parse5');




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

function mapFixtureToNode(fixture: ComponentFixture<any>) {
  return fixture.debugElement.nativeElement;
}

const serializeComponentFixture = compose(
  pretty,
  removeAngularSpecificMarkup,
  serializeNode,
  mapFixtureToNode
);

ComponentFixture.prototype.toJSON = function () {
  return serializeComponentFixture(this);
};


declare module '@angular/core/testing/component_fixture' {
  interface ComponentFixture<T> {
    toJSON: () => string;
  }
}