/*

//@ sourceMappingURL=common.map
*/
for(var b,x="function"==typeof Object.defineProperties?Object.defineProperty:function(e,a,d){if(d.get||d.set)throw new TypeError("ES3 does not support getters and setters.");e!=Array.prototype&&e!=Object.prototype&&(e[a]=d.value)},A="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this,C=["Object","assign"],F=0;F<C.length-1;F++){var H=C[F];H in A||(A[H]={});A=A[H]}
var J=C[C.length-1],K=A[J],M=K?K:function(e,a){for(var d=1;d<arguments.length;d++){var f=arguments[d];if(f)for(var g in f)Object.prototype.hasOwnProperty.call(f,g)&&(e[g]=f[g])}return e};M!=K&&null!=M&&x(A,J,{configurable:!0,writable:!0,value:M});window.c={};var N=window.c;N.j=function(e,a,d){d=void 0!=d&&1==d;!0!==e&&!0!==d||console.info(a);!0===d&&alert(a)};N.PathObjectGet=function(e,a){var d=e;if(e&&a){for(var f=0,g=a.length;f<g&&(d=d[a[f]],void 0!==d);f++);return d}};N.A=N.PathObjectGet;N.qb=function(e,a,d){var f=e;if(e&&a){e=0;for(var g=a.length;e<g;e++){var k=a[e];if(e===a.length-1){f[k]=d;break}f=f[k];if(void 0===f)break}}};N.PathObjectSet=N.qb;N.K=function(e){for(var a=[],d=0,f=e.length;d<f;d++)a.push(e[d]);return a};
N.Ba=function(e){var a;if(e instanceof Array){a=[];for(var d=0,f=e.length;d<f;d++)a[d]=N.Ba(e[d]);return a}if(e instanceof Object){a={};for(d in e)e.hasOwnProperty(d)&&(a[d]=N.Ba(e[d]));return a}e instanceof Date&&N.j(!0,"instance of class Date in DeepClone");return e};N.Qa=function(e,a){for(var d="",f=e;0<f;--f)d+=a[Math.floor(Math.random()*a.length)];return d};N.RandomString=N.Qa;N.pa=function(e){return Array.isArray(e)};N.Dc=function(e){return"[object Number]"===Object.prototype.toString.call(e)};
N.Ma=function(e){return"string"===typeof e};N.i={};N.i.L="data";N.i.fa="op";N.i.I="value";N.i.Y="node";N.i.B="type";N.i.Ac="tooltipstop";N.i.ha="dimension";N.i.Wa="islocale";N.fb={};
N.fb.Hb=function(e,a,d,f,g,k,l,p,r,w,v){var B=e.oa();N.j(!1,"DagNodeCalculateHelper.CalculateValue name:"+B);a.length=0;for(var E=d.length=0,G=f.length;E<G;E++){var h=f[E];if(!h)throw Error("null instruction at:"+E);var m=h[N.i.fa];switch(m){default:throw Error("invalid instruction at:"+E+" operation:"+m);case "pushconst":var q=h[N.i.I];a.push(q);if(!1===v){h=h[N.i.Wa];void 0===h&&(h=!1);var z=N.f.Oa(q,void 0,p,r,h,g);d.push(z)}break;case "getstaticdataobject":var h=a.pop(),n=N.A(g,h);a.push(n);!1===
v&&(m=d.pop(),h=[N.f.o("get_static_data_object",g)],h=N.f.h(h,"__A__",m),d.push(h));break;case "getnode":case "getparentnode":m=h[N.i.Y];q=m.D();a.push(q);if(!1===v){var h=[m.N()+"("],u={text:m.M(p)},m=m.Ka(p);void 0!==m&&(u.tooltip=m);N.f.F(h,u);N.f.F(h,")");d.push(h)}break;case "setnode":case "setparentnode":q=a.pop();m=h[N.i.Y];m.S(q);!1===v&&d.pop();break;case "getdocumentvalue":n=a.pop();if(0==("string"===typeof n||n instanceof String))throw Error("GetDocumentValue valueName not string:"+typeof n);
q=void 0;u=a.pop();if(void 0!==u){q=u instanceof O;if(0==("c.Document"===typeof u||q))throw Error("GetDocumentValue document not document:"+typeof u);q=u.D(n)}a.push(q);if(!1===v){d.pop();var t;d.pop();if(void 0===q)d.push("");else{var I=void 0!==u?u.N(n):void 0,z=void 0!==u?u.M(n,p):void 0,u=void 0!==u?u.La(n,p):void 0,z={text:z};void 0!==u&&(z.tooltip=u);h=[I+"("];N.f.F(h,z);N.f.F(h,")");d.push(h)}}break;case "setdocumentvalue":q=a.pop();n=a.pop();u=a.pop();void 0!==u&&u.S(n,q);!1===v&&(d.pop(),
d.pop(),d.pop());break;case "getarrayvalue":m=a.pop();h=a.pop();n=void 0;void 0!==m&&void 0!==h&&void 0!==h.length&&0<=m&&m<h.length&&(n=h[m]);a.push(n);!1===v&&(d.pop(),d.pop(),d.push(void 0!==n?n.toString():""));break;case "setarrayvalue":m=a.pop();q=a.pop();h=a.pop();void 0!==m&&void 0!==h&&void 0!==h.length&&0<=m&&m<h.length&&(h[E]=q);a.push(h);!1===v&&(d.pop(),d.pop(),d.pop(),d.push(""));break;case "getdocumentarrayvalue":n=a.pop();if(0==("string"===typeof n||n instanceof String))throw Error("GetDocumentArrayValue valueName not string:"+
typeof n);var h=[],D=a.pop();if(!1===N.pa(D))throw Error("GetDocumentArrayValue documentArray not array:"+typeof D);m=0;for(t=D.length;m<t;m++)u=D[m],void 0!==u&&(q=u.D(n),void 0!==q&&h.push(q));a.push(h);if(!1===v){d.pop();d.pop();var h=[],T=0,m=0;for(t=D.length;m<t;m++)u=D[m],void 0!==u&&(q=u.D(n),void 0!==q&&(T&&N.f.F(h,", "),T+=1,I=u.N(n),z=u.M(n,p),u=u.La(n,p),z={text:z},void 0!==u&&(z.tooltip=u),N.f.F(h,I+"("),N.f.F(h,z),N.f.F(h,")")));d.push(h)}break;case "getobjectvalue":var y=a.pop(),q=a.pop(),
n=void 0;void 0!==q&&(n=q[y]);a.push(n);!1===v&&(m=d.pop(),t=d.pop(),h=["("],N.f.F(h,t),N.f.F(h,")."),N.f.F(h,m),d.push(h));break;case "setobjectvalue":y=a.pop();q=a.pop();n=a.pop();void 0!==n&&(n[y]=q);a.push(n);!1===v&&(d.pop(),d.pop(),d.pop(),d.push(""));break;case "objecthaskey":y=a.pop();q=a.pop();n=!1;void 0!==q&&(n=y in q);a.push(n);break;case "objectaddkey":y=a.pop();n=a.pop();n[y]=0;a.push(n);break;case "objectremovekey":y=a.pop();n=a.pop();delete n[y];a.push(n);break;case "objecttostack":var q=
a.pop(),L;for(L in q)q.hasOwnProperty(L)&&(a.push(q[L]),a.push(L));break;case "stacktoobject":for(n={};1<a.length;)h=a.pop(),q=a.pop(),n[h]=q;a.push(n);break;case "if":h=a.pop();m=a.pop();t=a.pop();a.push(h?m:t);!1===v&&(m=d.pop(),t=d.pop(),u=d.pop(),h=[N.f.o("if",g)],h=N.f.h(h,"__A__",m),h=N.f.h(h,"__B__",t),h=N.f.h(h,"__C__",u),d.push(h));break;case "testundefined":q=a.pop();n=void 0===q;a.push(n);!1===v&&(m=d.pop(),h=[N.f.o("test_undefined",g)],h=N.f.h(h,"__A__",m),h=N.f.h(h,"__B__",n),d.push(h));
break;case "replaceundefined":m=a.pop();t=a.pop();void 0!==t?a.push(t):a.push(m);!1===v&&(m=d.pop(),t=d.pop(),h=[N.f.o("replace_undefined",g)],h=N.f.h(h,"__A__",m),h=N.f.h(h,"__B__",t),d.push(h));break;case "equal":m=a.pop();t=a.pop();n=m==t;a.push(n);!1===v&&(m=d.pop(),t=d.pop(),h=[N.f.o("equal",g)],h=N.f.h(h,"__A__",m),h=N.f.h(h,"__B__",t),h=N.f.h(h,"__C__",n),d.push(h));break;case "lessequal":m=a.pop();t=a.pop();n=m<=t;a.push(n);!1===v&&(m=d.pop(),t=d.pop(),h=[N.f.o("lessequal",g)],h=N.f.h(h,"__A__",
m),h=N.f.h(h,"__B__",t),h=N.f.h(h,"__C__",n),d.push(h));break;case "less":m=a.pop();t=a.pop();n=m<t;a.push(n);!1===v&&(m=d.pop(),t=d.pop(),h=[N.f.o("less",g)],h=N.f.h(h,"__A__",m),h=N.f.h(h,"__B__",t),h=N.f.h(h,"__C__",n),d.push(h));break;case "and":m=a.pop();t=a.pop();n=m&&t;a.push(n);!1===v&&(m=d.pop(),t=d.pop(),h=[N.f.o("and",g)],h=N.f.h(h,"__A__",m),h=N.f.h(h,"__B__",t),d.push(h));break;case "or":m=a.pop();t=a.pop();n=m||t;a.push(n);!1===v&&(m=d.pop(),t=d.pop(),h=[N.f.o("or",g)],h=N.f.h(h,"__A__",
m),h=N.f.h(h,"__B__",t),d.push(h));break;case "xor":m=a.pop();t=a.pop();n=m!==t;a.push(n);!1===v&&(m=d.pop(),t=d.pop(),h=[N.f.o("xor",g)],h=N.f.h(h,"__A__",m),h=N.f.h(h,"__B__",t),d.push(h));break;case "not":m=a.pop();n=!m;a.push(n);!1===v&&(m=d.pop(),h=[N.f.o("not",g)],h=N.f.h(h,"__A__",m),d.push(h));break;case "arraytostack":q=a.pop();if(void 0!==q)for(m=0,t=q.length;m<t;m++)h=q[q.length-1-m],a.push(h);!1===v&&d.pop();break;case "arrayofarraytostack":q=a.pop();if(void 0!==q)for(m=0,t=q.length;m<
t;m++)if(u=q[q.length-1-m],void 0!==u)for(n=0,D=u.length;n<D;n++)h=u[u.length-1-n],void 0!==h&&a.push(h);if(!1===v&&(z=d.pop(),void 0!==z))for(m=0,t=z.length;m<t;m++)if(u=z[z.length-1-m],void 0!==u)for(n=0,D=u.length;n<D;n++)h=u[u.length-1-n],void 0!==h&&d.push(h);break;case "stacktoarray":for(q=[];0<a.length;)q.push(a.pop());a.push(q);if(!1===v){for(z=[];0<d.length;)z.push(d.pop());d.push(z)}break;case "stackalltrue":for(n=!0;0<a.length;)h=a.pop(),n=n&&h;a.push(n);!1===v&&(d.length=0,d.push(q));
break;case "stackanytrue":for(n=!1;0<a.length;)if(h=a.pop(),!0===h){n=!0;a.length=0;break}a.push(n);!1===v&&(d.length=0,d.push(q));break;case "arraytomap":q=a.pop();n={};if(void 0!==q)for(m=0,t=q.length;m<t;m++)u=q[m],n[u]=0;a.push(n);!1===v&&(d.length=0,d.push(n));break;case "maptoarray":q=a.pop();n=[];if(void 0!==q)for(y in q)!1!==q.hasOwnProperty(y)&&n.push(y);a.push(n);!1===v&&(d.pop(),d.push(n));break;case "f0":y=h[N.i.I];if(h=k[y])q=h();else throw Error("F0 method not found:"+y+" in CalculateValue name:"+
B);a.push(q);!1===v&&d.push(N.f.o(y,g));break;case "f1":m=a.pop();y=h[N.i.I];if(h=k[y])q=h(m);else throw Error("F1 method not found:"+y+" in CalculateValue name:"+B);a.push(q);!1===v&&(m=d.pop(),h=[N.f.o(y,g)],h=N.f.h(h,"__A__",m),d.push(h));break;case "f2":m=a.pop();t=a.pop();y=h[N.i.I];if(h=k[y])q=h(m,t);else throw Error("F2 method not found:"+y+" in CalculateValue name:"+B);a.push(q);!1===v&&(m=d.pop(),t=d.pop(),h=[N.f.o(y,g)],h=N.f.h(h,"__A__",m),h=N.f.h(h,"__B__",t),d.push(h));break;case "f3":m=
a.pop();t=a.pop();u=a.pop();y=h[N.i.I];if(h=k[y])q=h(m,t,u);else throw Error("F3 method not found:"+y+" in CalculateValue name:"+B);a.push(q);!1===v&&(m=d.pop(),t=d.pop(),u=d.pop(),h=[N.f.o(y,g)],h=N.f.h(h,"__A__",m),h=N.f.h(h,"__B__",t),h=N.f.h(h,"__C__",u),d.push(h));break;case "f4":m=a.pop();t=a.pop();u=a.pop();q=a.pop();y=h[N.i.I];if(h=k[y])q=h(m,t,u,q);else throw Error("F4 method not found:"+y+" in CalculateValue name:"+B);a.push(q);!1===v&&(m=d.pop(),t=d.pop(),u=d.pop(),n=d.pop(),h=[N.f.o(y,
g)],h=N.f.h(h,"__A__",m),h=N.f.h(h,"__B__",t),h=N.f.h(h,"__C__",u),h=N.f.h(h,"__D__",n),d.push(h));break;case "f5":m=a.pop();t=a.pop();u=a.pop();q=a.pop();n=a.pop();y=h[N.i.I];if(h=k[y])q=h(m,t,u,q,n);else throw Error("F5 method not found:"+y+" in CalculateValue name:"+B);a.push(q);!1===v&&(m=d.pop(),t=d.pop(),u=d.pop(),n=d.pop(),D=d.pop(),h=[N.f.o(y,g)],h=N.f.h(h,"__A__",m),h=N.f.h(h,"__B__",t),h=N.f.h(h,"__C__",u),h=N.f.h(h,"__D__",n),h=N.f.h(h,"__E__",D),d.push(h));break;case "f6":m=a.pop();t=
a.pop();u=a.pop();q=a.pop();n=a.pop();D=a.pop();y=h[N.i.I];if(h=k[y])q=h(m,t,u,q,n,D);else throw Error("F6 method not found:"+y+" in CalculateValue name:"+B);a.push(q);!1===v&&(m=d.pop(),t=d.pop(),u=d.pop(),n=d.pop(),D=d.pop(),z=d.pop(),h=[N.f.o(y,g)],h=N.f.h(h,"__A__",m),h=N.f.h(h,"__B__",t),h=N.f.h(h,"__C__",u),h=N.f.h(h,"__D__",n),h=N.f.h(h,"__E__",D),h=N.f.h(h,"__F__",z),d.push(h));break;case "f7":m=a.pop();t=a.pop();u=a.pop();q=a.pop();n=a.pop();D=a.pop();z=a.pop();y=h[N.i.I];if(h=k[y])q=h(m,
t,u,q,n,D,z);else throw Error("F7 method not found:"+y+" in CalculateValue name:"+B);a.push(q);!1===v&&(m=d.pop(),t=d.pop(),u=d.pop(),n=d.pop(),D=d.pop(),z=d.pop(),I=d.pop(),h=[N.f.o(y,g)],h=N.f.h(h,"__A__",m),h=N.f.h(h,"__B__",t),h=N.f.h(h,"__C__",u),h=N.f.h(h,"__D__",n),h=N.f.h(h,"__E__",D),h=N.f.h(h,"__F__",z),h=N.f.h(h,"__G__",I),d.push(h))}}if(0>=a.length)throw Error("invalid calculation stack:"+a.length+" "+JSON.stringify(a));n=a.pop();z=N.f.Oa(n,l,p,r,w,g);e.T=z;if(!1===v){u=[e.N()+"("+z+") = "];
if(0>=d.length)throw Error("invalid tooltip stack:"+d.length+" "+JSON.stringify(d));a=d.pop();N.f.F(u,a);e.U=u}return n};function P(e,a,d,f,g,k,l,p,r,w){this.J=e;this.ka=a;this.$a=d;this.ya=f;this.G=g;this.ea=k;this.Jb=l;this.Xb=p;this.Za=r;this.za=w;this.T=this.U=this.C=void 0;this.g=[];this.w=!0;this.O="";this.xa=[];this.Mb=[]}b=P.prototype;b.D=function(){N.j(!1,"DagNodeCalculate.GetValue name:"+this.J+" dirty:"+this.w);Q(this,this.O);return this.C};
function Q(e,a){if(!0===e.w||a!==e.O){e.O=a;e.w=!1;try{e.C=N.fb.Hb(e,e.xa,e.Mb,e.G,e.Za,e.za,e.$a,a,e.ea,e.Jb,e.Xb)}catch(d){N.j(!0,"SWALLOWING EXCEPTION: GetValue "+e.J+" threw error:"+d+" this:"+e),e.C=void 0}}}b.oa=function(){return this.J};b.N=function(){return this.ka};b.M=function(e){Q(this,e);return this.T};b.Ka=function(e){Q(this,e);return this.U};b.R=function(){if(1!=this.w){this.w=!0;for(var e=0,a=this.g.length;e<a;e++){var d=this.g[e];null!=d&&d.R()}R(this.ya)}};b.ab=function(e){this.g.push(e)};
b.rb=function(e){this.g=this.g.filter(function(a){return a!==e})};b.na=function(){return this.G};b.toString=function(){for(var e="{m_value:"+this.C+", m_dirty:"+this.w+", m_outputArray[",a=0,d=this.g.length;a<d;a++){var f=this.g[a];a&&(e+=", ");e+=f.oa()}e+="], m_instructionArray:[";a=0;for(d=this.G.length;a<d;a++)f=this.G[a],a&&(e+=", "),e+="{op:"+f[N.i.fa]+",value:"+f[N.i.I]+"}";return e+"]}"};N.b={};N.b.tb="clientlocked";N.b.B="type";N.b.Ra="defaultvaluebool";N.b.Ta="defaultvalueint";N.b.ua="defaultvalueintuserand";N.b.ta="defaultvalueintdatenow";N.b.Sa="defaultvaluefloat";N.b.Va="defaultvaluestring";N.b.xb="defaultvaluestringrandid";N.b.wb="defaultvaluestringranddatabaseid";N.b.vb="defaultvaluestringmap";N.b.va="defaultvaluekey";N.b.ub="defaultvaluekeymap";N.b.ga="defaultvaluekeyuserand";N.b.Ua="defaultvaluekeyrandarray";N.b.sa="defaultvaluedocumenttype";N.b.$="keypath";N.b.Z="documenttypearray";
N.b.V="arraylengthmin";N.b.X="arraylengthmax";N.b.Db="stringlengthmin";N.b.Cb="stringlengthmax";N.b.Bb="intrangelow";N.b.Ab="intrangehigh";N.b.zb="floatrangelow";N.b.yb="floatrangehigh";N.b.ha="dimension";N.a={};N.DagNodeValueHelper=N.a;
N.a.ib=function(e,a,d,f,g){var k=a[N.b.B];N.j(!1,"c.DagNodeValueHelper.FactoryValue type:"+k);switch(k){case "bool":return N.a.Nb(e,a);case "boolarray":return N.a.Da(e,a);case "int":return N.a.Sb(e,a);case "intarray":return N.a.Ga(e,a);case "float":return N.a.Qb(e,a);case "floatarray":return N.a.Fa(e,a);case "string":return N.a.Vb(e,a);case "stringarray":return N.a.Ja(e,a);case "stringmap":return N.a.Wb(e,a);case "key":return N.a.Tb(e,a,d);case "keyarray":return N.a.Ha(e,a,d);case "keymap":return N.a.Ub(e,
a,d);case "document":return N.a.Ob(e,a,f,g);case "documentarray":return N.a.Pb(e,a,f,g);case "iddocumentmap":return N.a.Rb(e,a,f,g)}};N.a.FactoryValue=N.a.ib;N.a.Ca=function(e,a,d,f){if(void 0!==d&&e.length<d)for(;e.length<d;)e.push(a);void 0!==f&&f<e.length&&(e.length=f)};N.a.ma=function(e,a,d,f){if(void 0!==d&&e.length<d)for(;e.length<d;)e.push(a());void 0!==f&&f<e.length&&(e.length=f)};
N.a.Na=function(e,a,d,f){if(!0!==a)return e;e=void 0!==d?d:0;return Math.floor(Math.random()*((void 0!==f?f:1)+1-e))+e};N.a.$b=function(e,a,d,f){return function(){return N.a.Na(e,a,d,f)}};N.a.nb=function(e){return function(){return(" "+e).slice(1)}};N.a.cc=function(e){return function(){return e[Math.floor(Math.random()*e.length)]}};N.a.bc=function(){return function(){return N.a.pb()}};N.a.ac=function(){return function(){return N.a.ob()}};
N.a.Nb=function(e,a){var d=a[N.b.Ra];return!0===e?!0:!1===e?!1:void 0!==d?d:!1};N.a.Da=function(e,a){var d=a[N.b.Ra],f;if(void 0!=e&&Array.isArray(e)){f=e;for(var g=0,k=f.length;g<k;g++)f[g]=!0===f[g]}else f=[];N.a.Ca(f,void 0!==d?d:!1,a[N.b.V],a[N.b.X]);return f};N.a.Sb=function(e,a){var d=a[N.b.Ta],d=void 0!==d?d:0,f=a[N.b.ua];!0===a[N.b.ta]&&(d=(new Date).valueOf());var g=a[N.b.Bb],k=a[N.b.Ab],d=N.a.Na(d,f,g,k);return N.a.kb(e,d,g,k)};
N.a.kb=function(e,a,d,f){e="number"===typeof e?Math.round(e):a;void 0!==d&&(e=Math.max(d,e));void 0!==f&&(e=Math.min(f,e));return e};N.a.Ga=function(e,a){var d=a[N.b.Ta],d=void 0!==d?d:0,f=a[N.b.ua];!0===a[N.b.ta]&&(d=(new Date).valueOf());var g=a[N.b.Bb],k=a[N.b.Ab],l;if(void 0!=e&&Array.isArray(e)){l=e;for(var p=0,r=l.length;p<r;p++){var w=l[p],d=N.a.Na(d,f,g,k),w=N.a.kb(w,d,g,k);l[p]=w}}else l=[];p=a[N.b.V];r=a[N.b.X];N.a.Ca(l,d,p,r);N.a.ma(l,N.a.$b(d,f,g,k),p,r);return l};
N.a.jb=function(e,a,d,f){e="number"===typeof e?e:a;void 0!==d&&(e=Math.max(d,e));void 0!==f&&(e=Math.min(f,e));return e};N.a.Qb=function(e,a){var d=a[N.b.Sa];return N.a.jb(e,void 0!==d?d:0,a[N.b.zb],a[N.b.yb])};N.a.Fa=function(e,a){var d=a[N.b.Sa],d=void 0!==d?d:0,f=a[N.b.zb],g=a[N.b.yb],k;if(void 0!=e&&Array.isArray(e)){k=e;for(var l=0,p=k.length;l<p;l++){var r=k[l],r=N.a.jb(r,d,f,g);k[l]=r}}else k=[];N.a.Ca(k,d,a[N.b.V],a[N.b.X]);return k};
N.a.lb=function(e,a,d,f){var g=void 0;"string"===typeof e||e instanceof String?g=e:g=a;if(void 0!==d&&g.length<d)for(;g.length<d;)g+="_";void 0!==f&&f<g.length&&(g=g.substr(0,f));return g};N.a.Vb=function(e,a){var d=a[N.b.Va],d=void 0!==d?d:"";!0===a[N.b.xb]&&(d=N.a.pb());!0===a[N.b.wb]&&(d=N.a.ob());return N.a.lb(e,d,a[N.b.Db],a[N.b.Cb])};
N.a.Ja=function(e,a){var d=a[N.b.Va],d=void 0!==d?d:"",f=a[N.b.Db],g=a[N.b.Cb],k;if(void 0!=e&&Array.isArray(e)){k=e;for(var l=0,p=k.length;l<p;l++){var r=k[l],r=N.a.lb(r,d,f,g);k[l]=r}}else k=[];f=a[N.b.V];g=a[N.b.X];d=N.a.nb(d);!0===a[N.b.xb]&&(d=N.a.bc);!0===a[N.b.wb]&&(d=N.a.ac);N.a.ma(k,d,f,g);return k};
N.a.mb=function(e,a){var d={};if(void 0===e||!1===Array.isArray(e))e=a;if(void 0!=e&&Array.isArray(e))for(var f=0,g=e.length;f<g;f++){var k=e[f];if("string"===typeof k||k instanceof String)d[k]=0}return d};N.a.Wb=function(e,a){return N.a.mb(e,a[N.b.vb])};N.a.Ia=function(e,a,d,f,g){return("string"===typeof e||e instanceof String)&&f&&e in f?e:!0===d&&g?g[Math.floor(Math.random()*g.length)]:a};
N.a.Tb=function(e,a,d){d=N.A(d,a[N.b.$]);var f=a[N.b.va],g=a[N.b.ga];a=a[N.b.Ua];var k=[];if(void 0!=d)for(var l in d)d.hasOwnProperty(l)&&k.push(l);void 0!==a&&(k=a);void 0==f&&(0<k.length?f=k[0]:f="");return N.a.Ia(e,f,g,d,k)};
N.a.Ha=function(e,a,d){d=N.A(d,a[N.b.$]);var f=a[N.b.va],g=a[N.b.ga],k=a[N.b.Ua],l=[];if(void 0!=d)for(var p in d)d.hasOwnProperty(p)&&l.push(p);void 0!==k&&(l=k);void 0==f&&(0<l.length?f=l[0]:f="");if(void 0!=e&&Array.isArray(e)){p=[];for(var k=0,r=e.length;k<r;k++)p[k]=N.a.Ia(e[k],f,g,d,l)}else p=[];N.a.ma(p,!0===g&&0<l.length?N.a.cc(l):N.a.nb(f),a[N.b.V],a[N.b.X]);return p};
N.a.Ub=function(e,a,d){d=N.A(d,a[N.b.$]);var f=a[N.b.va],g=a[N.b.ga],k=a[N.b.Ua],l=a[N.b.ub];void 0===l&&(l={});a=[];if(void 0!=d)for(var p in d)d.hasOwnProperty(p)&&a.push(p);void 0!==k&&(a=k);void 0==f&&(0<a.length?f=a[0]:f="");if(void 0!=e&&Array.isArray(e))for(p={},k=0,l=e.length;k<l;k++)p[N.a.Ia(e[k],f,g,d,a)]=0;else p=l;return p};N.a.pb=function(){return N.Qa(16,"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")};N.a.ob=function(){return N.Qa(24,"0123456789ABCDEF")};
N.a.Ea=function(e,a,d,f,g){N.j(!1,"c.DagNodeValueHelper.FactoryValueDocumentClean valueOrUndefined:"+e+" defaultType:"+a+" validTypeArray:"+d+" documentManager:"+f+" node:"+g);if(f){var k=null,l=void 0;null!==e&&"object"===typeof e&&(l=S(f,e,g));l&&void 0!==d&&(k=l.w(),-1===d.indexOf(k)&&(l=void 0));if(!l){if(void 0===a)return;e=f.G(a);l=S(f,e,g)}l||N.j(!0,"c.DagNodeValueHelper.FactoryValueDocumentClean could not find type:"+k+" defaultType:"+a,!0);return l}};
N.a.Ob=function(e,a,d,f){N.j(!1,"c.DagNodeValueHelper.FactoryValueDocument valueOrUndefined:"+e+" metaData:"+a+" documentManager:"+d+" node:"+f);if(!d)return null;var g=a[N.b.sa];a=a[N.b.Z];void 0===g&&void 0!==a&&0<a.length&&(g=a[0]);return N.a.Ea(e,g,a,d,f)};
N.a.Pb=function(e,a,d,f){var g=a[N.b.sa],k=a[N.b.Z];void 0===g&&void 0!==k&&0<k.length&&(g=k[0]);if(void 0!=e&&Array.isArray(e)){for(var l=[],p=0,r=e.length;p<r;p++){var w=e[p];(w=N.a.Ea(w,g,k,d,f))&&l.push(w)}e=l}else e=[];N.a.ma(e,N.a.Zb(g,d,f),a[N.b.V],a[N.b.X]);return e};N.a.Rb=function(e,a,d,f){a=a[N.b.Z];var g;if(void 0!=e&&Array.isArray(e)){g={};for(var k=0,l=e.length;k<l;k++){var p=N.a.Ea(e[k],void 0,a,d,f);if(p){var r=p.D(N.W.yc);void 0!==r&&(g[r]=p)}}}else g={};return g};
N.a.Zb=function(e,a,d){return function(){var f=a.G(e);return S(a,f,d)}};N.a.Ec=function(e){return function(){return N.a.mb(void 0,e)}};
N.a.fc=function(e,a,d,f){switch(a[N.b.B]){case "bool":return N.a.gc(e,a);case "boolarray":return N.a.hc(e,a);case "int":return N.a.nc(e,a);case "intarray":return N.a.oc(e,a);case "float":return N.a.kc(e,a);case "floatarray":return N.a.lc(e,a);case "string":return N.a.sc(e,a);case "stringarray":return N.a.tc(e,a);case "stringmap":return N.a.uc(e,a);case "key":return N.a.pc(e,a,d);case "keyarray":return N.a.qc(e,a,d);case "keymap":return N.a.rc(e,a);case "document":return N.a.ic(e,a,f);case "documentarray":return N.a.jc(e,
a,f);case "iddocumentmap":return N.a.mc(e,f)}};N.a.gc=function(e,a){var d=a[N.b.Ra];void 0===d&&(d=!1);if(!0===e&&e!==d||!1===e&&e!==d)return e};N.a.hc=function(e,a){var d=N.a.Da(e,a),f=N.a.Da(void 0,a);if(!0!==N.a.ca(d,f))return d};N.a.nc=function(e,a){var d=a[N.b.Ta],f=a[N.b.ua],g=a[N.b.ta];if("number"===typeof e){var k=Math.round(e);if(k!==(void 0!==d?d:0)||!0===g||!0===f)return k}};N.a.oc=function(e,a){var d=N.a.Ga(e,a),f=N.a.Ga(void 0,a),g=a[N.b.ua];if(!0===a[N.b.ta]||!0===g||!0!==N.a.ca(d,f))return d};
N.a.kc=function(e,a){var d=a[N.b.Sa];if("number"===typeof e&&e!==(void 0!==d?d:0))return e};N.a.lc=function(e,a){var d=N.a.Fa(e,a),f=N.a.Fa(void 0,a);if(!0!==N.a.ca(d,f))return d};N.a.sc=function(e,a){var d=a[N.b.Va];if(("string"===typeof e||e instanceof String)&&(void 0!==d?d:"")!==e)return e};N.a.tc=function(e,a){var d=N.a.Ja(e,a),f=N.a.Ja(void 0,a);if(!0!==N.a.ca(d,f))return d};
N.a.pc=function(e,a,d){d=N.A(d,a[N.b.$]);var f=a[N.b.va];!0===a[N.b.ga]&&(f=void 0);if(void 0!=d&&("string"===typeof e||e instanceof String)&&e in d&&e!==f)return e};N.a.qc=function(e,a,d){e=N.a.Ha(e,a,d);if(1==a[N.b.ga])return e;a=N.a.Ha(void 0,a,d);if(!0!==N.a.ca(e,a))return e};N.a.rc=function(e,a){var d=a[N.b.ub];void 0===d&&(d=[]);var f;if(void 0!==e){f=[];for(var g in e)e.hasOwnProperty(g)&&f.push(g);if(!1===N.a.cb(f,d))return f}};
N.a.ic=function(e,a,d){var f=a[N.b.Z],g=void 0;"GetType"in e&&(g=e.GetType());var k=void 0;void 0!==f&&void 0!==g&&-1!==f.indexOf(g)&&(k=d.w(e));if(k&&(g!==a[N.b.sa]||1!==Object.keys(k).length))return k};N.a.jc=function(e,a,d){if(void 0!=e&&!1!==Array.isArray(e)){var f=[],g=a[N.b.sa];a=a[N.b.V];void 0===a&&(a=0);a=1&e.length==a;for(var k=0,l=e.length;k<l;k++){var p=d.w(e[k]);a&=p.type===g&&1===Object.keys(p).length;f.push(p)}if(1!=a)return f}};
N.a.mc=function(e,a){if(void 0!=e){var d=0,f=[],g;for(g in e)if(e.hasOwnProperty(g)){var k=e[g];void 0!=k&&"GetValue"in k&&k.D("id")===g&&(k=a.w(k),f.push(k),d+=1)}if(d)return f}};N.a.ca=function(e,a){var d=void 0!=a&&Array.isArray(a);if(0==(void 0!=e&&Array.isArray(e))||0==d||e.length!=a.length)return!1;for(var d=0,f=e.length;d<f;d++)if(e[d]!==a[d])return!1;return!0};
N.a.Cc=function(e,a){var d=void 0!=a&&Array.isArray(a);if(0==(void 0!=e&&Array.isArray(e))||0==d||e.length!=a.length)return!1;for(var d=0,f=e.length;d<f;d++)if(e[d].valueOf()!==a[d].valueOf())return!1;return!0};N.a.cb=function(e,a){var d=void 0!=a&&Array.isArray(a);if(0==(void 0!=e&&Array.isArray(e))||0==d||e.length!=a.length)return!1;for(var d=0,f=e.length;d<f;d++)if(-1===a.indexOf(e[d]))return!1;return!0};
N.a.uc=function(e,a){var d=a[N.b.vb];void 0===d&&(d=[]);var f;if(void 0!==e){f=[];for(var g in e)e.hasOwnProperty(g)&&f.push(g);if(!1===N.a.cb(f,d))return f}};function U(e,a,d,f,g,k){this.ka=e;this.ea=a;this.w=d;this.C=f;this.J=g;this.T=k;this.G=!1;this.U=this.O=void 0;this.g=[]}b=U.prototype;b.D=function(){return this.w};b.oa=function(){return this.ka};b.N=function(){return this.ea};b.M=function(e){if(!1===this.G||e!==this.U)this.G=!0,this.U=e,this.O=N.f.Oa(this.w,this.C,e,this.J,!1,this.T);return this.O};b.Ka=function(){};
b.S=function(e,a,d){N.j(!1,"c.DagNodeValue.SetValue start");e===this.w?N.j(!1,"c.DagNodeValue.SetValue bail"):(this.da(),this.w=e,this.G=!1,this.ba(a),this.R(),R(d),N.j(!1,"c.DagNodeValue.SetValue end"))};b.R=function(){N.j(!1,"c.DagNodeValue.SetDirty start");for(var e=0,a=this.g.length;e<a;e++){var d=this.g[e];void 0!==d&&d.R()}N.j(!1,"c.DagNodeValue.SetDirty end")};b.na=function(){};
b.da=function(){N.j(!1,"c.DagNodeValue.ClearChildParentLinks start");if(void 0!==this.w){switch(this.C){case "document":var e=this.D();e.da();break;case "documentarray":for(var a=this.D(),d=0,f=a.length;d<f;d++)e=a[d],e.da();break;case "iddocumentmap":for(d in a=this.D(),a)!1!==a.hasOwnProperty(d)&&(e=a[d],e.da())}N.j(!1,"c.DagNodeValue.ClearChildParentLinks end")}};
b.ba=function(e){N.j(!1,"c.DagNodeValue.AddChildParentLinks start");if(void 0!==this.w){switch(this.C){case "document":var a=this.D();a.ba(e);break;case "documentarray":for(var d=this.D(),f=0,g=d.length;f<g;f++)a=d[f],a.ba(e);break;case "iddocumentmap":for(f in d=this.D(),d)!1!==d.hasOwnProperty(f)&&(a=d[f],a.ba(e))}N.j(!1,"c.DagNodeValue.AddChildParentLinks end")}};b.ab=function(e){this.g.push(e)};b.rb=function(e){this.g=this.g.filter(function(a){return a!==e})};
b.toString=function(){for(var e="{m_value:"+this.w+", m_outputArray[",a=0,d=this.g.length;a<d;a++){var f=this.g[a];a&&(e+=", ");e+=f.oa()}return e+"]}"};N.H={};
N.H.Gb=function(e,a){for(var d in e)if(!1!==e.hasOwnProperty(d)){var f=e[d],g=f.na();if(g)for(var k=0,l=g.length;k<l;k++){var p=g[k],r=p[N.i.fa],w="getparentnode"===r,v="setparentnode"===r;if(!1!==w||!1!==v){var r=p[N.i.I],B=a[r];if(!B)throw f=e?JSON.stringify(Object.keys(e)):"undefined",g=a?JSON.stringify(Object.keys(a)):"undefined",Error("AddNodeMapLinksParent node not found:"+r+" for node:"+d+" subIndex:"+k+" instruction:"+JSON.stringify(p)+" nodeKeysString:"+f+" parentNodeKeysString:"+g);p[N.i.Y]=
B;!0===w&&N.H.qa(B,f);if(!0===v){if(!1===B instanceof U)throw Error("AddNodeMapLinksParent node incorrect type for setNode:"+r+" link from:"+d);N.H.qa(f,B)}}}}};
N.H.ec=function(e){for(var a in e)if(!1!==e.hasOwnProperty(a)){var d=e[a],f=d.na();if(f)for(var g=0,k=f.length;g<k;g++){var l=f[g],p=l[N.i.fa],r="getparentnode"===p,p="setparentnode"===p;if(!1!==r||!1!==p){var w=l[N.i.I],v=l[N.i.Y];l[N.i.Y]=void 0;if(void 0===v)throw Error("RemoveNodeMapLinksParent node not found:"+w+" for node:"+a+" subIndex:"+g+" instruction:"+JSON.stringify(l));!0===r&&N.H.sb(v,d);!0===p&&N.H.sb(d,v)}}}};
N.H.Fb=function(e){for(var a in e)if(!1!==e.hasOwnProperty(a)){var d=e[a],f=d.na();if(f)for(var g=0,k=f.length;g<k;g++){var l=f[g],p=l[N.i.fa],r="getnode"===p,w="setnode"===p;if(!1!==r||!1!==w){var p=l[N.i.I],v=e[p];if(!v)throw e=e?JSON.stringify(Object.keys(e)):"undefined",Error("AddNodeMapLinks node not found:"+p+" for node:"+a+" subIndex:"+g+" instruction:"+JSON.stringify(l)+" nodeKeysString:"+e);l[N.i.Y]=v;!0===r&&N.H.qa(v,d);if(!0===w){if(!1===v instanceof U)throw Error("AddNodeMapLinks node incorrect type for setNode:"+
p+" link from:"+a);N.H.qa(d,v)}}}}};N.H.qa=function(e,a){e?a?(e.ab(a),a.R()):N.j(!0,"c.DagNodeCollection.SetNodesLinked in_output:"+a):N.j(!0,"c.DagNodeCollection.SetNodesLinked in_input:"+e)};N.H.sb=function(e,a){e.rb(a);a.R()};N.W={};N.W.B="type";N.W.yc="id";function O(e,a,d){this.G=e;this.g=a;this.C=d}N.Document=O;function V(e,a,d){N.j(!1,"Document.Factory in_type:"+e+" in_mapNameNode:"+a+" in_parentNodeOrUndefined:"+d);return new O(e,a,d)}O.Factory=V;O.prototype.w=function(){return this.G};O.prototype.GetType=O.prototype.w;O.prototype.D=function(e){N.j(!1,"Document.GetValue in_name:"+e+" in:"+(e in this.g));if(e in this.g)return this.g[e].D()};O.prototype.GetValue=O.prototype.D;
O.prototype.S=function(e,a){N.j(!1,"c.Document.SetValue name:"+e+" in_value:"+a);e in this.g&&this.g[e].S(a,this.g,this)};O.prototype.SetValue=O.prototype.S;O.prototype.N=function(e){N.j(!1,"c.Document.GetDisplayName name:"+e);return e in this.g?this.g[e].N():e};O.prototype.GetLocaleName=O.prototype.N;O.prototype.M=function(e,a){N.j(!1,"c.Document.GetDisplayValue name:"+e);return e in this.g?this.g[e].M(a):""};O.prototype.GetDisplayValue=O.prototype.M;
O.prototype.J=function(e,a,d){N.j(!1,"Document.SetDisplayValue in_name:"+e+" in:"+(e in this.g));if(e in this.g){e=this.g[e];var f=this.g;a=N.f.wc(d,a,e.J,e.T);void 0!==a&&e.S(a,f,this)}};O.prototype.SetDisplayValue=O.prototype.J;O.prototype.La=function(e,a){N.j(!1,"Document.GetTooltip in_name:"+e+" in:"+(e in this.g));if(e in this.g){var d=this.g[e],f=d.Ka(a);return f?[{text:d.M(a),tooltip:f}]:void 0}};O.prototype.GetTooltip=O.prototype.La;
function R(e){N.j(!1,"Document.OnChildNodeSetDirty");e.C&&e.C.R()}O.prototype.da=function(){N.j(!1,"Document.ClearChildParentLinks");N.H.ec(this.g)};O.prototype.ba=function(e){N.j(!1,"Document.AddChildParentLinks");N.H.Gb(this.g,e)};O.prototype.toString=function(){return"disable document to string"};N.f={};N.f.o=function(e,a){var d=a?a[N.v.zc]:void 0;if(void 0===d||!1===e in d)return e;d=d[e];return void 0===d?e:d};N.f.Yb=function(e,a,d,f){if(void 0!==e&&a&&void 0!==d){a=f[N.v.P][a.w()];var g=N.A(f,a[N.v.ia]),k=N.A(f,a[N.v.wa]),l=a=void 0;void 0!==g&&e in g&&(a=g[e][N.b.ha]);void 0!==k&&e in k&&(e=k[e],a=e[N.i.ha],l=e[N.i.Wa]);if(!0===l)return{isLocale:!0};if(void 0!==a)return d=N.A(f,[N.v.L,N.v.ra,d,a]),Object.assign({dimension:a},d)}};
N.f.Oa=function(e,a,d,f,g,k){if(!0===g||"key"===a)return N.f.o(e,k);if("keyarray"===a){d="[";var l=0;for(f=e.length;l<f;l++)a=e[l],l&&(d+=", "),d+=N.f.o(a,k);return d+"]"}if("keymap"===a){d="[";f=!0;for(l in e)!1!==e.hasOwnProperty(l)&&(!0===f?f=!1:d+=", ",d+=N.f.o(l,k));return d+"]"}switch(a){case "document":case "documentarray":case "iddocumentmap":return""}l=void 0;void 0!==f&&(l=N.A(k,[N.v.L,N.v.ra,d,f]));return d=N.f.dc(e,l)};
N.f.wc=function(e,a,d,f){N.j(!1,"UnmakeDisplayValue in_displayValue:"+e+" in_units:"+a+" in_dimentionOrUndefined:"+d);var g=void 0;void 0!==d&&(g=N.A(f,[N.v.L,N.v.ra,a,d]));return N.f.xc(e,g)};
N.f.dc=function(e,a){if(void 0===e)return"";if(void 0===a)return e.toString();var d=e*a.convert;if(void 0!==a.divisor)var f=0>d,d=Math.abs(d),d=d/a.divisor,g=Math.floor(d),d=((d-g)*a.divisor).toFixed(0),d=""+(!0===f?"-":"")+g.toFixed(0)+a.name1+d+a.name0;else f=1,void 0!==a.length&&(f=a.length),d=d.toFixed(f)+a.name0;return d};
N.f.xc=function(e,a){N.j(!1,"UnmakeDisplayValueUnit in_displayValue:"+e+" in_staticUnitData:"+JSON.stringify(a));if(void 0!==a){var d=0;if(void 0!==a.divisor){var f;f=e.split(a.name0)[0];f=f.split(a.name1);1<f.length?(d=0,""!==f[1]&&(d+=Math.max(0,Math.min(parseFloat(f[1]),a.divisor))),""!==f[0]&&(d+=parseFloat(f[0])*a.divisor)):0<f.length&&(d=parseFloat(f[0]))}else f=e.split(a.name0)[0],d=parseFloat(f);if(void 0===d||!0===isNaN(d))d=0;d/=a.convert;!0===isNaN(d)&&(d=0);return d}};
N.f.Pa=function(e,a,d,f){a=N.f.Yb(e,a,d,f);var g=N.f.o(e,f);e+="_tooltip";var k=N.f.o(e,f),l=void 0;e!==k&&(l=[k]);a&&l&&(l=N.f.h(l,"__U__",N.f.o("unit_"+d+"_"+a.dimension,f)));return void 0!==l?[{text:g,tooltip:l}]:[g]};N.f.F=function(e,a){var d=N.Ma(a);if(!(!0===d&&0>=a.length))if(0<e.length&&!0===N.Ma(e[e.length-1])&&!0===d)0<a.length&&(e[e.length-1]+=a);else if(N.pa(a))for(var d=0,f=a.length;d<f;d++)N.f.F(e,a[d]);else void 0!==a&&(!1===d&&"text"in a&&!1==="tooltip"in a?N.f.F(e,a.text):e.push(a))};
N.f.h=function(e,a,d){for(var f=[],g=0,k=e.length;g<k;g++){var l=e[g];if(!1!==N.Ma(l))for(;;){var p=l.indexOf(a);if(-1===p)break;N.f.F(f,l.substring(0,p));N.f.F(f,d);l=l.substring(p+a.length)}N.f.F(f,l)}return f};function W(e,a,d){this.g=e;this.za=a?a:{};this.C=d?d:{}}N.DocumentManager=W;W.Factory=function(e,a,d){return new W(e,a,d)};W.prototype.Za=function(){for(var e=Object.keys(this.g[N.v.P]),a={},d=0,f=e.length;d<f;d++){var g=e[d];a[g]=this.o(g)}return a};W.prototype.GetTypeMap=W.prototype.Za;W.prototype.U=function(){for(var e=Object.keys(this.C),a={},d=0,f=e.length;d<f;d++){var g=e[d];a[g]=this.o(g)}return a};W.prototype.GetActionMap=W.prototype.U;
W.prototype.$a=function(){var e=N.A(this.g,[N.v.L,N.v.ra]),a={};if(void 0!==e)for(var e=Object.keys(e),d=0,f=e.length;d<f;d++){var g=e[d];a[g]=this.o(g)}return a};W.prototype.GetUnitMap=W.prototype.$a;W.prototype.o=function(e){return N.f.o(e,this.g)};W.prototype.GetLocaleData=W.prototype.o;W.prototype.Pa=function(e,a,d){return N.f.Pa(e,a,d,this.g)};W.prototype.MakePropertyNameTooltipData=W.prototype.Pa;
W.prototype.ka=function(e){var a=this.g[N.v.P][e];if(null==a)return[];e=N.A(this.g,a[N.v.ia]);var a=N.A(this.g,a[N.v.wa]),d=[];void 0!==e&&(d=d.concat(Object.keys(e)));void 0!==a&&(d=d.concat(Object.keys(a)));return d};W.prototype.GetDocumentPropertyNameArray=W.prototype.ka;
W.prototype.ea=function(e,a){var d=this.g[N.v.P][e];if(null!=d){var f=N.A(this.g,d[N.v.ia]),f=void 0!==f&&a in f?f[a]:void 0,d=N.A(this.g,d[N.v.wa]),g=void 0!==d&&a in d?d[a]:void 0,k=d=void 0,l=void 0;void 0!==f&&N.b.B in f&&(d=f[N.b.B]);void 0!==g&&N.i.B in g&&(d=g[N.i.B]);void 0!==f&&(k=N.b.tb in f?!0===f[N.b.tb]:!1);void 0!==g&&(k=!0);if(void 0!==f&&N.b.$ in f&&(g=N.A(this.g,f[N.b.$]),void 0!==g))for(w in l={},g)!1!==g.hasOwnProperty(w)&&(l[w]=this.o(w));var p=void 0;if(void 0!==f&&N.b.Z in f&&
(g=f[N.b.Z],void 0!==g))for(var p={},f=0,r=g.length;f<r;f++){var w=g[f];p[w]=this.o(w)}return{type:d,locked:k,keyoptions:l,childtypeoptions:p}}};W.prototype.GetDocumentPropertyData=W.prototype.ea;W.prototype.T=function(e){if(e in this.C)return this.C[e].input};W.prototype.GetActionInputType=W.prototype.T;W.prototype.ya=function(e,a,d,f,g){if(e in this.C)return this.C[e].run(this,a,d,f,g)};W.prototype.RunAction=W.prototype.ya;
W.prototype.G=function(e){N.j(!1,"DocumentManager.NewDocumentData in_type:"+e);if(null==this.g[N.v.P])N.j(!0,"DocumentManager.NewDocumentData gameobject_types undefined");else if(!1===e in this.g[N.v.P])N.j(!0,"DocumentManager.NewDocumentData document_types in_type not found:"+e);else{var a={};a[N.W.B]=e;e=S(this,a,void 0);a=void 0;e&&(a=this.w(e));return a}};W.prototype.NewDocumentData=W.prototype.G;W.prototype.O=function(e){return S(this,e,void 0)};W.prototype.DocumentDataToDocument=W.prototype.O;
function S(e,a,d){N.j(!1,"DocumentManager.DocumentDataToDocument in_documentData:"+JSON.stringify(a)+" in_parentNodeOrUndefined:"+d);if(a){var f=a[N.W.B];if(null==f)N.j(!0,"DocumentManager.DocumentDataToDocument no type in data document");else{var g=e.g[N.v.P][f];if(null!=g){d=V(f,{},d);var f=N.A(e.g,g[N.v.ia]),g=N.A(e.g,g[N.v.wa]),k=e.za,k=k?k:{};if(void 0!=f)for(var l in f){var p=f[l];d.g[l]=new U(l,e.o(l),void 0,p[N.b.B],p[N.b.ha],e.g)}if(void 0!=g)for(var r in g){l=e.o(r);var w=g[r],p=w[N.i.B],
v=w[N.i.L];if(void 0===v)N.j(!0,"DocumentManager.DocumentDataToDocument undefined data for calculate node:"+r+" in document data:"+JSON.stringify(a));else{for(var B=[],E=0,G=v.length;E<G;E++){var h=Object.assign({},v[E]);B.push(h)}v=w[N.i.ha];E=w[N.i.Wa];void 0===E&&(E=!1);w=w[N.i.Ac];void 0===w&&(w=!1);d.g[r]=new P(r,l,p,d,B,v,E,w,e.g,k)}}if(void 0!=f)for(var m in f){r=f[m];g=m in d.g?d.g[m]:void 0;if(!g)throw Error("invalid internal state Lost node:"+m);r=N.a.ib(a[m],r,e.g,e,g);d.S(m,r)}N.H.Fb(d.g);
return d}}}}W.prototype.w=function(e){if(e){var a=e.w(),d=this.g[N.v.P][a];if(null!=d){var d=N.A(this.g,d[N.v.ia]),f={};f[N.W.B]=a;if(void 0!=d)for(var g in d){var a=d[g],k=e.D(g);void 0!==k&&(a=N.a.fc(k,a,this.g,this),void 0!==a&&(f[g]=a))}return f}}};W.prototype.DocumentToDocumentData=W.prototype.w;W.prototype.xa=function(e,a,d,f){return N.u.hb(e,a,d,f)};W.prototype.MakeUpdatePatch=W.prototype.xa;W.prototype.J=function(e,a){return N.u.bb(e,a)};W.prototype.ApplyUpdatePatch=W.prototype.J;N.v={};N.v.P="documenttypes";N.v.ia="value";N.v.wa="calculate";N.v.zc="locale";N.v.L="data";N.v.ra="units";N.l={};N.l.Bc="lock";N.l.L="d";N.l.B="t";N.l.Ya="r";N.l.Xa="i";N.l.Eb="u";N.l.aa="p";N.l.ja="v";N.u={};N.ObjectDelta=N.u;N.u.hb=function(e,a,d,f){var g=[];f||(f=[]);N.u.eb(g,f,e,a);e={};0<g.length&&(e[N.l.L]=g);void 0!=d&&(e[N.l.Bc]=d);return e};N.u.Factory=N.u.hb;
N.u.Aa=function(e,a,d,f){if(void 0!==d&&void 0===f)f={},f[N.l.B]=N.l.Ya,f[N.l.aa]=N.K(a),e.push(f);else if(void 0===d&&void 0!==f)d={},d[N.l.B]=N.l.Xa,d[N.l.aa]=N.K(a),d[N.l.ja]=f,e.push(d);else if(void 0!==d&&void 0!==f){var g=Object.prototype.toString.call(d),k=Object.prototype.toString.call(f);g!==k?N.j(!0,"c.ObjectDelta.CollectDelta type missmatch sourceType:"+g+" targetType:"+k+" path:"+JSON.stringify(a)):"[object Array]"===g?N.u.Ib(e,a,d,f):"[object Object]"===g?N.u.eb(e,a,d,f):d!==f&&(d={},
d[N.l.B]=N.l.Eb,d[N.l.aa]=N.K(a),d[N.l.ja]=f,e.push(d))}};N.u.Ib=function(e,a,d,f){for(var g=[],k=0,l=f.length;k<l;k++){for(var p=f[k],r=[],w=0,v=d.length;w<v;w++){var B=N.u.la(d[w],p);0>=B||r.push({s:w,m:B})}g.push(r)}g=N.u.vc(g);k=v=w=r=0;for(l=g.length;k<l;k++){p=f[k];B=g[k];if(void 0==B)N.u.Kb(e,a,p,k),r+=1;else{for(var E=B.s,G=E+r-w;k<G;)N.u.gb(e,a,G-1),w+=1,G=E+r-w;B=B.m;1>B&&N.u.Lb(e,a,d[E],p,G)}v+=1}for(;v<d.length+r-w;)N.u.gb(e,a,v),w+=1};
N.u.la=function(e,a){var d=Object.prototype.toString.call(e);if(d!==Object.prototype.toString.call(a))return 0;if("[object Array]"===d){var d=0,f=1;e.length!==a.length&&(f=.5);for(var g=Math.min(e.length,a.length),k=0;k<g;k++)d+=N.u.la(e[k],a[k]);k=1;0<g&&(k=d/g);return k*f}if("[object Object]"===d){d=g=0;for(f in e)!1!==e.hasOwnProperty(f)&&(g+=1,d+=N.u.la(e[f],a[f]));for(f in a)!1===a.hasOwnProperty(f)||f in e||(g+=1,d+=N.u.la(e[f],a[f]));k=1;0<g&&(k=d/g);return k}return e===a?1:0};
N.u.gb=function(e,a,d){var f={};a=N.K(a);a.push(d);f[N.l.B]=N.l.Ya;f[N.l.aa]=a;e.push(f)};N.u.Kb=function(e,a,d,f){var g={};a=N.K(a);a.push(f);g[N.l.B]=N.l.Xa;g[N.l.aa]=a;g[N.l.ja]=d;e.push(g)};N.u.Lb=function(e,a,d,f,g){a=N.K(a);a.push(g);N.u.Aa(e,a,d,f)};N.u.vc=function(e){for(var a=[],d=-1,f=0,g=e.length;f<g;f++){for(var k=e[f],l=void 0,p=0,r=k.length;p<r;p++){var w=k[p];if(d<w.s){d=w.s;l=w;break}}a.push(l)}return a};
N.u.eb=function(e,a,d,f){for(var g in d)if(!1!==d.hasOwnProperty(g)){var k=N.K(a);k.push(g);N.u.Aa(e,k,d[g],f[g])}for(g in f)!1===f.hasOwnProperty(g)||g in d||(k=N.K(a),k.push(g),N.u.Aa(e,k,d[g],f[g]))};
N.u.bb=function(e,a){var d=N.Ba(e),f=a[N.l.L];if(null==f)return d;for(var g=0,k=f.length;g<k;g++){var l=f[g],p=l[N.l.B],r=N.K(l[N.l.aa]);switch(p){case N.l.Ya:l=r[r.length-1];r.splice(-1,1);r=N.A(d,r);!0===N.pa(r)?r.splice(l,1):delete r[l];break;case N.l.Xa:p=r[r.length-1];r.splice(-1,1);r=N.A(d,r);l=l[N.l.ja];!0===N.pa(r)?r.splice(p,0,l):r[p]=l;break;case N.l.Eb:l=l[N.l.ja],N.qb(d,r,l)}}return d};N.u.ApplyDelta=N.u.bb;function X(e){this.g=e%233280}N.RandomSequence=X;X.Factory=function(e){return new X(e)};X.MakeSeed=function(){return Math.floor(233280*Math.random())};X.prototype.w=function(){this.g=(9301*this.g+49297)%233280;return this.g/233280};X.prototype.Random=X.prototype.w;X.prototype.C=function(){return this.g};X.prototype.GetCurrentSeed=X.prototype.C;
X.prototype.G=function(e,a){a||(a=[]);a.length=e.length;for(var d=0;d<a.length;++d)a[d]=e[d];for(d=a.length;d;){var f=Math.floor(this.w()*d),d=d-1,g=a[d];a[d]=a[f];a[f]=g}return a};X.prototype.ShuffelArray=X.prototype.G;
