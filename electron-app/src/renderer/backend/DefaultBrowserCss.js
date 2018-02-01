export class DefaultBrowserCss {
}
DefaultBrowserCss.css = `
/*
 * The default style sheet used to render HTML.
 *
 * Copyright (C) 2000 Lars Knoll (knoll@kde.org)
 * Copyright (C) 2003-2011, 2014 Apple Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 *
 * You should have received a copy of the GNU Library General Public License
 * along with this library; see the file COPYING.LIB.  If not, write to
 * the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA 02110-1301, USA.
 *
 */

html {
    display: block;
}

/* children of the <head> element all have display:none */
head, link, meta, script, style, title {
    display: none;
}

/* generic block-level elements */

body {
    display: block;
    margin: 8px;
}

p {
    display: block;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
}

address, article, aside, div, footer, header, hgroup, layer, main, nav, section {
    display: block;
}

marquee {
    display: inline-block;
}

blockquote {
    display: block;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 40px;
    -webkit-margin-end: 40px;
}

figcaption {
    display: block;
}

figure {
    display: block;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 40px;
    -webkit-margin-end: 40px;
}

q {
    display: inline;
}

center {
    display: block;
    /* special centering to be able to emulate the html4/netscape behaviour */
    text-align: -webkit-center;
}

hr {
    display: block;
    -webkit-margin-before: 0.5em;
    -webkit-margin-after: 0.5em;
    -webkit-margin-start: auto;
    -webkit-margin-end: auto;
    border-style: inset;
    border-width: 1px;
}

video {
    object-fit: contain;
}

/* heading elements */

h1 {
    display: block;
    font-size: 2em;
    -webkit-margin-before: 0.67em;
    -webkit-margin-after: 0.67em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-weight: bold;
}

article h1,
aside h1,
nav h1,
section h1 {
    font-size: 1.5em;
    -webkit-margin-before: 0.83em;
    -webkit-margin-after: 0.83em;
}

h2 {
    display: block;
    font-size: 1.5em;
    -webkit-margin-before: 0.83em;
    -webkit-margin-after: 0.83em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-weight: bold;
}

h3 {
    display: block;
    font-size: 1.17em;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-weight: bold;
}

h4 {
    display: block;
    -webkit-margin-before: 1.33em;
    -webkit-margin-after: 1.33em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-weight: bold;
}

h5 {
    display: block;
    font-size: .83em;
    -webkit-margin-before: 1.67em;
    -webkit-margin-after: 1.67em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-weight: bold;
}

h6 {
    display: block;
    font-size: .67em;
    -webkit-margin-before: 2.33em;
    -webkit-margin-after: 2.33em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-weight: bold;
}

/* tables */

table {
    display: table;
    border-collapse: separate;
    border-spacing: 2px;
    border-color: gray;
}

thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
}

tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
}

tfoot {
    display: table-footer-group;
    vertical-align: middle;
    border-color: inherit;
}

/* for tables without table section elements (can happen with XHTML or dynamically created tables) */
table > tr {
    vertical-align: middle;
}

col {
    display: table-column;
}

colgroup {
    display: table-column-group;
}

tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
}

td, th {
    display: table-cell;
    vertical-align: inherit;
}

th {
    font-weight: bold;
}

caption {
    display: table-caption;
    text-align: -webkit-center;
}

/* lists */

ul, menu, dir {
    display: block;
    list-style-type: disc;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    -webkit-padding-start: 40px;
}

ol {
    display: block;
    list-style-type: decimal;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    -webkit-padding-start: 40px;
}

li {
    display: list-item;
    text-align: -webkit-match-parent;
}

ul ul, ol ul {
    list-style-type: circle;
}

ol ol ul, ol ul ul, ul ol ul, ul ul ul {
    list-style-type: square;
}

dd {
    display: block;
    -webkit-margin-start: 40px;
}

dl {
    display: block;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
}

dt {
    display: block;
}

ol ul, ul ol, ul ul, ol ol {
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
}

/* form elements */

form {
    display: block;
    margin-top: 0em;
}

label {
    cursor: default;
}

legend {
    display: block;
    -webkit-padding-start: 2px;
    -webkit-padding-end: 2px;
    border: none;
}

fieldset {
    display: block;
    -webkit-margin-start: 2px;
    -webkit-margin-end: 2px;
    -webkit-padding-before: 0.35em;
    -webkit-padding-start: 0.75em;
    -webkit-padding-end: 0.75em;
    -webkit-padding-after: 0.625em;
    border: 2px groove ThreeDFace;
    min-width: min-content;
}

button {
    -webkit-appearance: button;
}

/* Form controls don't go vertical. */
input, textarea, keygen, select, button, meter, progress {
    -webkit-writing-mode: horizontal-tb !important;
}

input, textarea, keygen, select, button {
    margin: 0em;
    font: -webkit-small-control;
    color: initial;
    letter-spacing: normal;
    word-spacing: normal;
    line-height: normal;
    text-transform: none;
    text-indent: 0;
    text-shadow: none;
    display: inline-block;
    text-align: start;
}

input {
    -webkit-appearance: textfield;
    background-color: white;
    border: 2px inset;
    padding: 1px;
    -webkit-rtl-ordering: logical;
    -webkit-user-select: text;
    cursor: auto;
}

datalist {
    display: none;
}

input::-webkit-inner-spin-button {
    -webkit-appearance: inner-spin-button;
    display: block;
    position: relative;
    cursor: default;
    /* This height property is ignored for input type "number" and others which
     * use RenderTextControlSingleLine as renderer which sets height of spin
     * button in layout(). */
    height: 1.5em;
    flex: none;
    -webkit-user-select: none;
}

input::-webkit-credentials-auto-fill-button {
    -webkit-mask-size: 15px 12px;
    width: 15px;
    height: 12px;
    margin-left: 3px;
    margin-right: 2px;
    background-color: black;
    flex: none;
    -webkit-user-select: none;
}

input::-webkit-credentials-auto-fill-button:hover {
    background-color: rgb(0, 122, 255);
}

input::-webkit-credentials-auto-fill-button:active {
    background-color: rgb(0, 60, 219);
}

input::-webkit-contacts-auto-fill-button {
    -webkit-mask-size: 22px 12px;
    width: 22px;
    height: 12px;
    margin-left: 3px;
    margin-right: 2px;
    background-color: black;
    flex: none;
    -webkit-user-select: none;
}

input::-webkit-contacts-auto-fill-button:hover {
    background-color: rgb(0, 122, 255);
}

input::-webkit-contacts-auto-fill-button:active {
    background-color: rgb(0, 60, 219);
}

input::-webkit-caps-lock-indicator {
    -webkit-appearance: caps-lock-indicator;
    align-self: stretch;
    flex: none;
    -webkit-user-select: none;
}

keygen, select {
    border-radius: 5px;
}

keygen::-webkit-keygen-select {
    margin: 0px;
}

textarea {
    -webkit-appearance: textarea;
    background-color: white;
    border: 1px solid;
    -webkit-rtl-ordering: logical;
    -webkit-user-select: text;
    flex-direction: column;
    resize: auto;
    cursor: auto;
    padding: 2px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

::placeholder {
    -webkit-text-security: none;
    color: darkGray;
    pointer-events: none !important;
}

input::placeholder {
    white-space: pre;
    word-wrap: normal;
    overflow: hidden;
}

input:-webkit-autofill {
    background-color: #FAFFBD !important;
    background-image: none !important;
    color: #000000 !important;
}


area, param {
    display: none;
}

select:focus {
    border-color: rgb(17, 46, 135);
}

select {
    box-sizing: border-box;
    -webkit-appearance: menulist;
    border: 1px solid;
    color: black;
    background-color: white;
    align-items: center;
    white-space: pre;
    -webkit-rtl-ordering: logical;
    cursor: default;
}

optgroup {
    font-weight: bolder;
}

option {
    font-weight: normal;
}

output {
    display: inline;
}

/* form validation message bubble */

::-webkit-validation-bubble {
    display: inline-block;
    z-index: 2147483647;
    position: absolute;
    opacity: 0.95;
    line-height: 0;
    margin: 0;
    -webkit-text-security: none;
    transition: opacity 05.5s ease;
}

::-webkit-validation-bubble-message {
    display: flex;
    position: relative;
    top: -4px;
    font: message-box;
    color: black;
    min-width: 50px;
    max-width: 200px;
    border: solid 2px #400;
    background: -webkit-gradient(linear, left top, left bottom, from(#f8ecec), to(#e8cccc));
    padding: 8px;
    border-radius: 8px;
    -webkit-box-shadow: 4px 4px 4px rgba(100,100,100,0.6),
        inset -2px -2px 1px #d0c4c4,
        inset 2px 2px 1px white;
    line-height: normal;
    white-space: normal;
    z-index: 2147483644;
}

::-webkit-validation-bubble-text-block {
    flex: 1;
}

::-webkit-validation-bubble-heading {
    font-weight: bold;
}

::-webkit-validation-bubble-arrow {
    display: inline-block;
    position: relative;
    left: 32px;
    width: 16px;
    height: 16px;
    background-color: #f8ecec;
    border-width: 2px 0 0 2px;
    border-style: solid;
    border-color: #400;
    box-shadow: inset 2px 2px 1px white;
    -webkit-transform-origin: 0 0;
    transform: rotate(45deg);
    z-index: 2147483645;
}

::-webkit-validation-bubble-arrow-clipper {
    display: block;
    overflow: hidden;
    height: 16px;
}

/* meter */

meter {
    -webkit-appearance: meter;
    box-sizing: border-box;
    display: inline-block;
    height: 1em;
    width: 5em;
    vertical-align: -0.2em;
}

/* progress */

progress {
    -webkit-appearance: progress-bar;
    box-sizing: border-box;
    display: inline-block;
    height: 1em;
    width: 10em;
    vertical-align: -0.2em;
}

progress::-webkit-progress-inner-element {
    -webkit-appearance: inherit;
    box-sizing: inherit;
    height: 100%;
    width: 100%;
}

progress::-webkit-progress-bar {
    background-color: gray;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
}

progress::-webkit-progress-value {
    background-color: green;
    height: 100%;
    width: 50%; /* should be removed later */
    box-sizing: border-box;
}

/* inline elements */

u, ins {
    text-decoration: underline;
}

strong, b {
    font-weight: bold;
}

i, cite, em, var, address, dfn {
    font-style: italic;
}

tt, code, kbd, samp {
    font-family: monospace;
}

pre, xmp, plaintext, listing {
    display: block;
    font-family: monospace;
    white-space: pre;
    margin: 1em 0;
}

mark {
    background-color: yellow;
    color: black;
}

big {
    font-size: larger;
}

small {
    font-size: smaller;
}

s, strike, del {
    text-decoration: line-through;
}

sub {
    vertical-align: sub;
    font-size: smaller;
}

sup {
    vertical-align: super;
    font-size: smaller;
}

nobr {
    white-space: nowrap;
}

/* states */

a:any-link {
    color: -webkit-link;
    text-decoration: underline;
    cursor: auto;
}

a:any-link:active {
    color: -webkit-activelink;
}

/* HTML5 ruby elements */

ruby, rt {
    text-indent: 0; /* blocks used for ruby rendering should not trigger this */
}

rt {
    line-height: normal;
    -webkit-text-emphasis: none;
}

ruby > rt {
    display: block;
    font-size: -webkit-ruby-text;
    text-align: start;
}

ruby > rp {
    display: none;
}

/* other elements */

noframes {
    display: none;
}

frameset, frame {
    display: block;
}

frameset {
    border-color: inherit;
}

iframe {
    border: 2px inset;
}

details {
    display: block;
}

summary {
    display: block;
}

summary::-webkit-details-marker {
    display: inline-block;
    width: 0.66em;
    height: 0.66em;
    margin-right: 0.4em;
}

template {
    display: none;
}

bdi, output {
    unicode-bidi: isolate;
}

bdo {
    unicode-bidi: bidi-override;
}

slot {
    display: contents;
}

attachment {
    -webkit-appearance: attachment;
}
`;
