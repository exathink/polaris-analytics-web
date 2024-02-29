/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */


function circle() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="black" /></svg>`;
}

function gitBranch(stroke) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><circle cx="160" cy="96" r="48" fill="none" stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="160" cy="416" r="48" fill="none" stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path fill="none" stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M160 368V144"/><circle cx="352" cy="160" r="48" fill="none" stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M352 208c0 128-192 48-192 160" fill="none" stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`
}

function sitemap() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M208 80c0-26.5 21.5-48 48-48h64c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48h-8v40H464c30.9 0 56 25.1 56 56v32h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H464c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V288c0-4.4-3.6-8-8-8H312v40h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H256c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V280H112c-4.4 0-8 3.6-8 8v32h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V288c0-30.9 25.1-56 56-56H264V192h-8c-26.5 0-48-21.5-48-48V80z"/></svg>`
}

function encodeURI(svgString) {
  // Encoding the SVG string to create the Data URI
const encodedSvg = encodeURIComponent(svgString);

// Creating the Data URI
return `url(data:image/svg+xml;charset=UTF-8,${encodedSvg})`;

}

export const Images = {
  CIRCLE: encodeURI(circle()),
  GIT_BRANCH: encodeURI(gitBranch('black')),
  SITEMAP: encodeURI(sitemap()),

}
