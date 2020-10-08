!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.crudl=t():e.crudl=t()}(window,(function(){return function(e){var t={};function n(s){if(t[s])return t[s].exports;var r=t[s]={i:s,l:!1,exports:{}};return e[s].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(s,r,function(t){return e[t]}.bind(null,r));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e){e.exports=JSON.parse('{"addendum":"addenda","aircraft":"aircraft","alga":"algae","alumna":"alumnae","alumnus":"alumni","amoeba":"amoebae","analysis":"analyses","antenna":"antennae","antithesis":"antitheses","apex":"apices","appendix":"appendices","automaton":"automata","axis":"axes","bacillus":"bacilli","bacterium":"bacteria","barracks":"barracks","basis":"bases","beau":"beaux","bison":"bison","buffalo":"buffalo","bureau":"bureaus","cactus":"cacti","calf":"calves","carp":"carp","census":"censuses","chassis":"chassis","cherub":"cherubim","child":"children","château":"châteaus","cod":"cod","codex":"codices","concerto":"concerti","corpus":"corpora","crisis":"crises","criterion":"criteria","curriculum":"curricula","datum":"data","deer":"deer","diagnosis":"diagnoses","die":"dice","dwarf":"dwarfs","echo":"echoes","elf":"elves","elk":"elk","ellipsis":"ellipses","embargo":"embargoes","emphasis":"emphases","erratum":"errata","faux pas":"faux pas","fez":"fezes","firmware":"firmware","fish":"fish","focus":"foci","foot":"feet","formula":"formulae","fungus":"fungi","gallows":"gallows","genus":"genera","goose":"geese","graffito":"graffiti","grouse":"grouse","half":"halves","hero":"heroes","hoof":"hooves","hovercraft":"hovercraft","hypothesis":"hypotheses","index":"indices","kakapo":"kakapo","knife":"knives","larva":"larvae","leaf":"leaves","libretto":"libretti","life":"lives","loaf":"loaves","locus":"loci","louse":"lice","man":"men","matrix":"matrices","means":"means","medium":"media","media":"media","memorandum":"memoranda","millennium":"millennia","minutia":"minutiae","moose":"moose","mouse":"mice","nebula":"nebulae","nemesis":"nemeses","neurosis":"neuroses","news":"news","nucleus":"nuclei","oasis":"oases","offspring":"offspring","opus":"opera","ovum":"ova","ox":"oxen","paralysis":"paralyses","parenthesis":"parentheses","person":"people","phenomenon":"phenomena","phylum":"phyla","pike":"pike","polyhedron":"polyhedra","potato":"potatoes","prognosis":"prognoses","quiz":"quizzes","radius":"radii","referendum":"referenda","salmon":"salmon","scarf":"scarves","self":"selves","series":"series","sheep":"sheep","shelf":"shelves","shrimp":"shrimp","spacecraft":"spacecraft","species":"species","spectrum":"spectra","squid":"squid","stimulus":"stimuli","stratum":"strata","swine":"swine","syllabus":"syllabi","symposium":"symposia","synopsis":"synopses","synthesis":"syntheses","tableau":"tableaus","that":"those","thesis":"theses","thief":"thieves","this":"these","tomato":"tomatoes","tooth":"teeth","trout":"trout","tuna":"tuna","vertebra":"vertebrae","vertex":"vertices","veto":"vetoes","vita":"vitae","vortex":"vortices","watercraft":"watercraft","wharf":"wharves","wife":"wives","wolf":"wolves","woman":"women"}')},function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return g}));var s={};n.r(s),n.d(s,"clean",(function(){return f})),n.d(s,"start",(function(){return d})),n.d(s,"success",(function(){return m})),n.d(s,"failure",(function(){return p}));var r=n(0);function i(e,t={}){let n=e.replace(/[A-Z]/g,(e,t)=>`${t>0?"_":""}${e}`).toLowerCase();return t.multiple&&(n=n.split("_"),n.push(function(e=""){return r[e]?r[e]:e.replace(/(?:s|x|z|ch|sh)$/i,"$&e").replace(/([^aeiou])y$/i,"$1ie")+"s"}(n.pop())),n=n.join("_")),n}function a(e){return e.multiple?"items":"item"}function o(e,t){try{return!e[t.name].config.preserve}catch(e){return!0}}function u(e=[],t="id"){return e.reduce((function(e,n){return e[n[t]]=n,e}),{})}function c(e){return e.spread}function l(e,t){const n=a(e);return{...t,[e.name]:{...t[e.name],[n]:{...t[e.name][n]}}}}function f(e,t,n,s){const r=c(n)?l(t,s):s;return r[t.name][a(t)]={},r[t.name].loading=!1,r[t.name].failure=null,r[t.name].config={},r}function d(e,t,n,s,r={}){const i=c(n)?l(t,s):s;return i[t.name].config={...r.crudl},o(s,t)&&(i[t.name][a(t)]={}),i[t.name].loading=!0,i[t.name].failure=null,i}function m(e,t,n,s,r={}){const i=c(n)?l(t,s):s;return i[t.name][a(t)]=function(e,t,n,s,r){const{multiple:i}=t;let c;try{c=e?r.data[e]:r.data}catch(e){}return[void 0,null].indexOf(c)>-1&&(c=i?[]:{}),i?o(s,t)?u(c,n.identifier):{...s[t.name][a(t)],...u(c,n.identifier)}:c}(e,t,n,s,r),i[t.name].failure=null,i[t.name].loading=!1,i[t.name].config={},i}function p(e,t,n,s,r={}){const i=c(n)?l(t,s):s;o(s,t)&&(i[t.name][a(t)]={});let u=r;return r.response&&(u=r.response.data||r.response),i[t.name].failure=u,i[t.name].loading=!1,i[t.name].config={},i}function h(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}class g{static CLIENT(){return console.log("No HTTP client was provided to crudl. Using Promise.resolve() for mocking purposes."),Promise.resolve()}static get client(){return this._client&&Object.prototype.hasOwnProperty.call(this,"_client")?this._client:this.CLIENT}static set client(e){return this._client=e,this._client}constructor(e,t={}){this.key=e,this.config=t}get operations(){const e=Object.keys(g.OPERATIONS),{include:t=e,exclude:n=[]}=this.config;return e.filter(e=>t.indexOf(e)>-1).filter(e=>-1===n.indexOf(e)).reduce((e,t)=>({...e,[t]:g.OPERATIONS[t]}),{})}reduce(e,t={}){const{operations:n}=this;return{...Object.keys(n).reduce((t,s)=>({...t,[s]:e(n[s])}),{}),...t}}get keys(){return this.reduce(e=>i(this.key,e),this.config.keys)}get endpoints(){const e=i(this.key,{multiple:!0}),t=this.config.identifier||"id";return this.reduce(n=>`/${e}${n.identified?"/:"+t:""}`,this.config.endpoints)}get methods(){return this.reduce(e=>g.METHODS[e.name],this.config.methods)}get constants(){const{key:e}=this,t=(t,n)=>`CRUDL/${i(e)}/${t}/${n}`.toUpperCase();return this.reduce(e=>({clean:t(e.name,"clean"),start:t(e.name,"start"),success:t(e.name,"success"),failure:t(e.name,"failure")}))}get schema(){return this.reduce(e=>({loading:!1,failure:null,[e.multiple?"items":"item"]:{},config:{}}))}get requests(){const e=this.config.client||g.client;return this.reduce(t=>{const{start:n,success:s,failure:r}=this.constants[t.name],i=this.endpoints[t.name],a=this.methods[t.name];return(t,o)=>{const{url:u,data:c}=function(e="",t={}){const n={...t};return{url:e.split("/").map((function(e){const s=e.match(/^:(.*?)(?=\?|#|$)/);if(s){const r=s[0].replace(/^:/,"");return delete n[r],t[r]||e}return e})).join("/"),data:n}}(i,o);delete c.crudl;const l={method:a,["get"===a?"params":"data"]:c};return new Promise((i,a)=>(t(n,o),e(u,l).then(e=>{t(s,e),i(e)}).catch(e=>{t(r,e),a(e)}))).catch(()=>{})}})}get cleaners(){return this.reduce(e=>t=>t(this.constants[e.name].clean))}get modifiers(){const{keys:e,config:t,constants:n,operations:r}=this,{clean:i,start:a,success:o,failure:u}=t.executors||s;return Object.keys(r).reduce((s,c)=>({...s,[n[c].clean]:n=>i(e[c],r[c],t,n),[n[c].start]:(n,s)=>a(e[c],r[c],t,n,s),[n[c].success]:(n,s)=>o(e[c],r[c],t,n,s),[n[c].failure]:(n,s)=>u(e[c],r[c],t,n,s)}),{})}}h(g,"OPERATIONS",{create:{name:"create",multiple:!1,identified:!1},read:{name:"read",multiple:!1,identified:!0},update:{name:"update",multiple:!1,identified:!0},delete:{name:"delete",multiple:!1,identified:!0},list:{name:"list",multiple:!0,identified:!1}}),h(g,"METHODS",{create:"post",read:"get",update:"put",delete:"delete",list:"get"})}])}));
//# sourceMappingURL=index.js.map