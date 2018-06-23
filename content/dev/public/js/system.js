

//@ sourceMappingURL=system.map

c={D:function(a,b,d){d=void 0!=d&&1==d;!0!==a&&!0!==d||console.info(b);!0===d&&alert(b)},G:function(a,b){var d=a;if(a&&b){for(var e=0,f=b.length;e<f&&(d=d[b[e]],void 0!==d);e++);return d}}};c.PathObjectGet=c.G;c.qb=function(a,b,d){var e=a;if(a&&b){a=0;for(var f=b.length;a<f;a++){var k=b[a];if(a===b.length-1){e[k]=d;break}e=e[k];if(void 0===e)break}}};c.PathObjectSet=c.qb;c.R=function(a){for(var b=[],d=0,e=a.length;d<e;d++)b.push(a[d]);return b};
c.Ha=function(a){if(a instanceof Array){result=[];for(var b=0,d=a.length;b<d;b++)result[b]=c.Ha(a[b]);return result}if(a instanceof Object){result={};for(b in a)a.hasOwnProperty(b)&&(result[b]=c.Ha(a[b]));return copy}a instanceof Date&&c.D(!0,"instance of class Date in DeepClone");return a};c.Pa=function(a,b){for(var d="",e=a;0<e;--e)d+=b[Math.floor(Math.random()*b.length)];return d};c.RandomString=c.Pa;c.kb=function(a){return Array.isArray(a)};c.od=function(a){return"[object Number]"===Object.prototype.toString.call(a)};c.c={};c.c.Ca="data";c.c.ea="op";
c.c.h={$c:"pushconst",Pc:"getstaticdataobject",rb:"getnode",sb:"setnode",Nc:"getdocumentvalue",bd:"setdocumentvalue",Oc:"getobjectvalue",cd:"setobjectvalue",Wc:"objecthaskey",Vc:"objectaddkey",Xc:"objectremovekey",Yc:"objecttostack",gd:"stacktoobject",Dc:"dup",ad:"remove",Qc:"if",Rc:"ifexit",hd:"testundefined",Cc:"clear",Ec:"equal",Tc:"lessequal",Sc:"less",Ac:"and",Zc:"or",Uc:"not",Bc:"arraytostack",fd:"stacktoarray",dd:"stackalltrue",ed:"stackanytrue",Fc:"f0",Gc:"f1",Hc:"f2",Ic:"f3",Jc:"f4",Kc:"f5",
Lc:"f6",Mc:"f7"};c.c.L="value";c.c.Qa="node";c.c.C="type";c.c.g={oa:"bool",pa:"boolarray",va:"int",wa:"intarray",sa:"float",ta:"floatarray",za:"string",Aa:"stringarray",Ba:"stringmap",xa:"key",ya:"keyarray",qa:"document",ra:"documentarray",ua:"iddocumentmap",sd:"unknown",td:"unknownarray"};c.ab={};
c.ab.Fb=function(a,b,d,e){c.D(!1,"DagNodeCalculateHelper.CalculateValue");a.length=0;for(var f=!0,k=0,m=b.length;k<m&&!0===f;k++){var h=b[k];if(!h)throw Error("null instruction at:"+k);var g=h[c.c.ea];switch(g){default:throw Error("invalid instruction at:"+k+" operation:"+g);case c.c.h.$c:g=h[c.c.L];a.push(g);break;case c.c.h.Pc:var h=a.pop(),l=c.G(d,h);a.push(l);break;case c.c.h.rb:h=h[c.c.Qa];g=h.K();a.push(g);break;case c.c.h.sb:g=a.pop();h=h[c.c.Qa];h.P(g);break;case c.c.h.Nc:h=a.pop();if(0==
("string"===typeof h||h instanceof String))throw Error("GetDocumentValue valueName not string:"+typeof h);l=a.pop();g=l instanceof c.Document;if(0==("c.Document"===typeof l||g))throw Error("GetDocumentValue document not document:"+typeof l);g=l.K(h);a.push(g);break;case c.c.h.bd:g=a.pop();h=a.pop();l=a.pop();l.P(h,g);break;case c.c.h.Oc:h=a.pop();g=a.pop();l=g[h];a.push(l);break;case c.c.h.cd:h=a.pop();g=a.pop();l=a.pop();l[h]=g;a.push(l);break;case c.c.h.Wc:h=a.pop();g=a.pop();l=h in g;a.push(l);
break;case c.c.h.Vc:h=a.pop();l=a.pop();l[h]=0;a.push(l);break;case c.c.h.Xc:h=a.pop();l=a.pop();delete l[h];a.push(l);break;case c.c.h.Yc:var g=a.pop(),q;for(q in g)g.hasOwnProperty(q)&&(a.push(g[q]),a.push(q));break;case c.c.h.gd:for(l={};1<a.length;)h=a.pop(),g=a.pop(),l[h]=g;a.push(l);break;case c.c.h.Dc:g=a.pop();h=a.length-1-g;l=a[h];a.push(l);break;case c.c.h.ad:g=a.pop();h=a.length-1-g;a.splice(h,1);break;case c.c.h.Qc:h=a.pop();g=a.pop();l=a.pop();a.push(h?g:l);break;case c.c.h.Rc:g=a.pop();
!0===g&&(f=!1);break;case c.c.h.hd:g=a.pop();l=void 0===g;a.push(l);break;case c.c.h.Cc:a.length=0;break;case c.c.h.Ec:g=a.pop();l=a.pop();l=g==l;a.push(l);break;case c.c.h.Tc:g=a.pop();l=a.pop();l=g<=l;a.push(l);break;case c.c.h.Sc:g=a.pop();l=a.pop();l=g<l;a.push(l);break;case c.c.h.Ac:g=a.pop();l=a.pop();l=g&&l;a.push(l);break;case c.c.h.Zc:g=a.pop();l=a.pop();l=g||l;a.push(l);break;case c.c.h.Uc:g=a.pop();l=!g;a.push(l);break;case c.c.h.Bc:for(g=a.pop();0<g.length;)a.push(g.pop());break;case c.c.h.fd:for(g=
[];0<a.length;)g.push(a.pop());a.push(g);break;case c.c.h.dd:for(l=!0;0<a.length;)h=a.pop(),l=l&&h;a.push(l);break;case c.c.h.ed:for(l=!1;0<a.length;)if(h=a.pop(),!0===h){l=!0;a.length=0;break}a.push(l);break;case c.c.h.Fc:h=h[c.c.L];h=e[h];g=h();a.push(g);break;case c.c.h.Gc:g=a.pop();h=h[c.c.L];h=e[h];g=h(g);a.push(g);break;case c.c.h.Hc:g=a.pop();l=a.pop();h=h[c.c.L];h=e[h];g=h(g,l);a.push(g);break;case c.c.h.Ic:var g=a.pop(),l=a.pop(),n=a.pop(),h=h[c.c.L],h=e[h],g=h(g,l,n);a.push(g);break;case c.c.h.Jc:var g=
a.pop(),l=a.pop(),n=a.pop(),p=a.pop(),h=h[c.c.L],h=e[h],g=h(g,l,n,p);a.push(g);break;case c.c.h.Kc:var g=a.pop(),l=a.pop(),n=a.pop(),p=a.pop(),r=a.pop(),h=h[c.c.L],h=e[h],g=h(g,l,n,p,r);a.push(g);break;case c.c.h.Lc:var g=a.pop(),l=a.pop(),n=a.pop(),p=a.pop(),r=a.pop(),t=a.pop(),h=h[c.c.L],h=e[h],g=h(g,l,n,p,r,t);a.push(g);break;case c.c.h.Mc:var g=a.pop(),l=a.pop(),n=a.pop(),p=a.pop(),r=a.pop(),t=a.pop(),u=a.pop(),h=h[c.c.L],h=e[h],g=h(g,l,n,p,r,t,u);a.push(g)}}if(1!=a.length)throw Error("invalid calculation stack:"+
a.length+" "+JSON.stringify(a));return a[0]};c.A=function(a,b,d,e,f){this.w=a;this.W=b;this.da=e;this.M=d;this.md=f;this.I=void 0;this.f=[];this.o=!0;this.Xa=[]};c.DagNodeCalculate=c.A;c.A.F=function(a,b,d,e,f){return new c.A(a,b,d,e,f)};c.A.Factory=c.A.F;c.A.prototype.S=function(){return this.w};c.A.prototype.GetName=c.A.prototype.S;
c.A.prototype.K=function(){c.D(!1,"DagNodeCalculate.GetValue dirty:"+this.o+" name:"+this.w);if(1==this.o){this.o=!1;try{this.I=c.ab.Fb(this.Xa,this.M,this.da,this.md)}catch(a){c.D(!0,"SWALLOWING EXCEPTION: GetValue name:"+this.w+" threw error:"+a+" this:"+this),this.I=void 0}}return this.I};c.A.prototype.GetValue=c.A.prototype.K;c.A.prototype.ba=function(){return this.o};c.A.prototype.GetDirty=c.A.prototype.ba;
c.A.prototype.N=function(){if(1!=this.o){this.o=!0;for(var a=0,b=this.f.length;a<b;a++){var d=this.f[a];null!=d&&d.N()}a=this.W;a.f&&a.f.N()}};c.A.prototype.aa=function(a){this.f.push(a)};c.A.prototype.ca=function(a){this.f=this.f.filter(function(b){return b!==a})};
c.A.prototype.toString=function(){for(var a="{m_name:"+this.w+", m_value:"+this.I+", m_dirty:"+this.o+", m_outputArray:[",b=0,d=this.f.length;b<d;b++){var e=this.f[b];b&&(a+=", ");a+=e.S()}a+="], m_instructionArray:[";b=0;for(d=this.M.length;b<d;b++)e=this.M[b],b&&(a+=", "),a+="{op:"+e[c.c.ea]+",value:"+e[c.c.L]+"}";return a+"]}"};c.A.prototype.toString=c.A.prototype.toString;c.b={};c.b.tb="clientlocked";c.b.C="type";c.b.g={oa:"bool",pa:"boolarray",va:"int",wa:"intarray",sa:"float",ta:"floatarray",za:"string",Aa:"stringarray",Ba:"stringmap",xa:"key",ya:"keyarray",qa:"document",ra:"documentarray",ua:"iddocumentmap"};c.b.fa="defaultvaluebool";c.b.Da="defaultvalueint";c.b.Ra="defaultvalueintdatenow";c.b.ha="defaultvaluefloat";c.b.ja="defaultvaluestring";c.b.vb="defaultvaluestringrandid";c.b.ub="defaultvaluestringranddatabaseid";c.b.Ta="defaultvaluestringmap";c.b.Ea="defaultvaluekey";
c.b.ia="defaultvaluekeyuserand";c.b.Sa="defaultvaluekeyrandarray";c.b.ga="defaultvaluedocumenttype";c.b.X="keypath";c.b.ka="documenttypearray";c.b.H="arraylengthmin";c.b.J="arraylengthmax";c.b.Bb="stringlengthmin";c.b.Ab="stringlengthmax";c.b.zb="intrangelow";c.b.yb="intrangehigh";c.b.xb="floatrangelow";c.b.wb="floatrangehigh";c.a={};c.DagNodeValueHelper=c.a;
c.a.eb=function(a,b,d,e,f){switch(b[c.b.C]){case c.b.g.oa:return c.a.Jb(a,b);case c.b.g.pa:return c.a.Ia(a,b);case c.b.g.va:return c.a.Ob(a,b);case c.b.g.wa:return c.a.Ka(a,b);case c.b.g.sa:return c.a.Mb(a,b);case c.b.g.ta:return c.a.Ja(a,b);case c.b.g.za:return c.a.Qb(a,b);case c.b.g.Aa:return c.a.Ma(a,b);case c.b.g.Ba:return c.a.Rb(a,b);case c.b.g.xa:return c.a.Pb(a,b,d);case c.b.g.ya:return c.a.La(a,b,d);case c.b.g.qa:return c.a.Kb(a,b,e,f);case c.b.g.ra:return c.a.Lb(a,b,e,f);case c.b.g.ua:return c.a.Nb(a,
b,e,f)}};c.a.FactoryValue=c.a.eb;c.a.$=function(a,b,d,e){if(void 0!==d&&a.length<d)for(;a.length<d;)a.push(b);void 0!==e&&e<a.length&&(a.length=e)};c.a.O=function(a,b,d,e){if(void 0!==d&&a.length<d)for(;a.length<d;)a.push(b());void 0!==e&&e<a.length&&(a.length=e)};c.a.T=function(a){return function(){return(" "+a).slice(1)}};c.a.pb=function(a){return function(){return a[Math.floor(Math.random()*a.length)]}};c.a.ic=function(){return function(){return c.a.Oa()}};c.a.hc=function(){return function(){return c.a.Na()}};
c.a.Jb=function(a,b){var d=b[c.b.fa];return!0===a?!0:!1===a?!1:void 0!==d?d:!1};c.a.Ia=function(a,b){var d=b[c.b.fa],e;if(void 0!=a&&Array.isArray(a)){e=a;for(var f=0,k=e.length;f<k;f++)e[f]=!0===e[f]}else e=[];c.a.$(e,void 0!==d?d:!1,b[c.b.H],b[c.b.J]);return e};c.a.Ob=function(a,b){var d=b[c.b.Da],d=void 0!==d?d:0;!0===b[c.b.Ra]&&(d=(new Date).valueOf());return c.a.gb(a,d,b[c.b.zb],b[c.b.yb])};
c.a.gb=function(a,b,d,e){a="number"===typeof a?Math.round(a):b;void 0!==d&&(a=Math.max(d,a));void 0!==e&&(a=Math.min(e,a));return a};c.a.Ka=function(a,b){var d=b[c.b.Da],d=void 0!==d?d:0;!0===b[c.b.Ra]&&(d=(new Date).valueOf());var e=b[c.b.zb],f=b[c.b.yb],k;if(void 0!=a&&Array.isArray(a)){k=a;for(var m=0,h=k.length;m<h;m++){var g=k[m],g=c.a.gb(g,d,e,f);k[m]=g}}else k=[];c.a.$(k,d,b[c.b.H],b[c.b.J]);return k};
c.a.fb=function(a,b,d,e){a="number"===typeof a?a:b;void 0!==d&&(a=Math.max(d,a));void 0!==e&&(a=Math.min(e,a));return a};c.a.Mb=function(a,b){var d=b[c.b.ha];return c.a.fb(a,void 0!==d?d:0,b[c.b.xb],b[c.b.wb])};c.a.Ja=function(a,b){var d=b[c.b.ha],d=void 0!==d?d:0,e=b[c.b.xb],f=b[c.b.wb],k;if(void 0!=a&&Array.isArray(a)){k=a;for(var m=0,h=k.length;m<h;m++){var g=k[m],g=c.a.fb(g,d,e,f);k[m]=g}}else k=[];c.a.$(k,d,b[c.b.H],b[c.b.J]);return k};
c.a.ib=function(a,b,d,e){var f=void 0;"string"===typeof a||a instanceof String?f=a:f=b;if(void 0!==d&&f.length<d)for(;f.length<d;)f+="_";void 0!==e&&e<f.length&&(f=f.substr(0,e));return f};c.a.Qb=function(a,b){var d=b[c.b.ja],d=void 0!==d?d:"";!0===b[c.b.vb]&&(d=c.a.Oa());!0===b[c.b.ub]&&(d=c.a.Na());return c.a.ib(a,d,b[c.b.Bb],b[c.b.Ab])};
c.a.Ma=function(a,b){var d=b[c.b.ja],d=void 0!==d?d:"",e=b[c.b.Bb],f=b[c.b.Ab],k;if(void 0!=a&&Array.isArray(a)){k=a;for(var m=0,h=k.length;m<h;m++){var g=k[m],g=c.a.ib(g,d,e,f);k[m]=g}}else k=[];e=b[c.b.H];f=b[c.b.J];d=c.a.T(d);!0===b[c.b.vb]&&(d=c.a.ic);!0===b[c.b.ub]&&(d=c.a.hc);c.a.O(k,d,e,f);return k};
c.a.jb=function(a,b){var d={};if(void 0===a||!1===Array.isArray(a))a=b;if(void 0!=a&&Array.isArray(a))for(var e=0,f=a.length;e<f;e++){var k=a[e];if("string"===typeof k||k instanceof String)d[k]=0}return d};c.a.Rb=function(a,b){return c.a.jb(a,b[c.b.Ta])};c.a.hb=function(a,b,d,e,f){return("string"===typeof a||a instanceof String)&&e&&a in e?a:!0===d&&f?f[Math.floor(Math.random()*f.length)]:b};
c.a.Pb=function(a,b,d){d=c.G(d,b[c.b.X]);var e=b[c.b.Ea],f=b[c.b.ia];b=b[c.b.Sa];var k=[];if(d)for(temp_key in d)d.hasOwnProperty(temp_key)&&k.push(temp_key);void 0!==b&&(k=b);void 0==e&&(0<k.length?e=k[0]:e="");return c.a.hb(a,e,f,d,k)};
c.a.La=function(a,b,d){d=c.G(d,b[c.b.X]);var e=b[c.b.Ea],f=b[c.b.ia],k=b[c.b.Sa],m=[];if(d)for(temp_key in d)d.hasOwnProperty(temp_key)&&m.push(temp_key);void 0!==k&&(m=k);void 0==e&&(0<m.length?e=m[0]:e="");if(void 0!=a&&Array.isArray(a))for(var k=[],h=0,g=a.length;h<g;h++)innerResult=c.a.hb(a[h],e,f,d,m),k[h]=innerResult;else k=[];c.a.O(k,!0===f&&0<m.length?c.a.pb(m):c.a.T(e),b[c.b.H],b[c.b.J]);return k};c.a.Oa=function(){return c.Pa(16,"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")};
c.a.Na=function(){return c.Pa(24,"0123456789ABCDEF")};c.a.na=function(a,b,d,e,f){if(e){var k=null,m=void 0;null!==a&&"object"===typeof a&&(m=e.o(a,f));m&&void 0!==d&&(k=m.w(),-1===d.indexOf(k)&&(m=void 0));if(!m){if(void 0===b)return;a=e.I(b);m=e.o(a,f)}m||c.D(!0,"c.DagNodeValueHelper.FactoryValueDocumentClean could not find type:"+k+" defaultType:"+b,!0);return m}};
c.a.Kb=function(a,b,d,e){if(!d)return null;var f=b[c.b.ga];b=b[c.b.ka];void 0===f&&void 0!==b&&0<b.length&&(f=b[0]);return c.a.na(a,f,b,d,e)};c.a.Lb=function(a,b,d,e){var f=b[c.b.ga],k=b[c.b.ka];void 0===f&&void 0!==k&&0<k.length&&(f=k[0]);if(void 0!=a&&Array.isArray(a)){for(var m=[],h=0,g=a.length;h<g;h++){var l=a[h];(l=c.a.na(l,f,k,d,e))&&m.push(l)}a=m}else a=[];c.a.O(a,c.a.gc(f,d,e),b[c.b.H],b[c.b.J]);return a};
c.a.Nb=function(a,b,d,e){b=b[c.b.ka];var f;if(void 0!=a&&Array.isArray(a)){f={};for(var k=0,m=a.length;k<m;k++){var h=c.a.na(a[k],void 0,b,d,e);if(h){var g=h.K(c.V.kd);void 0!==g&&(f[g]=h)}}}else f={};return f};c.a.gc=function(a,b,d){return function(){var e=b.I(a);return b.o(e,d)}};c.a.jc=function(a){return function(){return c.a.jb(void 0,a)}};
c.a.lb=function(a,b,d,e){var f=a[c.b.C];switch(f){case c.b.g.oa:return c.a.Tb(a);case c.b.g.pa:return c.a.Ub(a);case c.b.g.va:return c.a.nb(a);case c.b.g.wa:return c.a.bc(a);case c.b.g.sa:return c.a.Yb(a);case c.b.g.ta:return c.a.Zb(a);case c.b.g.za:return c.a.dc(a);case c.b.g.Aa:return c.a.ec(a);case c.b.g.Ba:return c.a.fc(a);case c.b.g.xa:return c.a.ob(a,b);case c.b.g.ya:return c.a.cc(a,b);case c.b.g.qa:return c.a.mb(a,d,e);case c.b.g.ra:return c.a.Xb(a,d,e);case c.b.g.ua:return c.a.ac()}c.D(!0,
"c.DagNodeValueHelper.MakeClearFunction type not found:"+f,!0);return function(){c.D(!0,"c.DagNodeValueHelper.MakeClearFunction type not found:"+f,!0)}};c.a.MakeClearFunction=c.a.lb;c.a.Tb=function(a){var b=a[c.b.fa],b=void 0!==b?b:!1;return function(){return b}};c.a.Ub=function(a){var b=a[c.b.fa],b=void 0!==b?b:!1,d=a[c.b.H],e=a[c.b.J];return function(){var a=[];c.a.$(a,b,d,e);return a}};
c.a.nb=function(a){var b=a[c.b.Da],b=void 0!==b?b:0,d=a[c.b.Ra];return function(){return!0===d?(new Date).valueOf():b}};c.a.bc=function(a){var b=c.a.nb(a),d=a[c.b.H],e=a[c.b.J];return function(){var a=[];c.a.O(a,b,d,e);return a}};c.a.Yb=function(a){var b=a[c.b.ha],b=void 0!==b?b:0;return function(){return b}};c.a.Zb=function(a){var b=a[c.b.ha],b=void 0!==b?b:0,d=a[c.b.H],e=a[c.b.J];return function(){var a=[];c.a.$(a,b,d,e);return a}};c.a.dc=function(a){a=a[c.b.ja];return c.a.T(void 0!==a?a:"")};
c.a.ec=function(a){var b=a[c.b.ja],d=a[c.b.H],e=a[c.b.J],f=c.a.T(void 0!==b?b:"");return function(){var a=[];c.a.O(a,f,d,e);return a}};c.a.ob=function(a,b){var d=c.G(b,a[c.b.X]),e=a[c.b.Ea],f=a[c.b.ia],k=a[c.b.Sa],m=[];if(d)for(temp_key in d)d.hasOwnProperty(temp_key)&&m.push(temp_key);void 0!==k&&(m=k);void 0==e&&(0<m.length?e=m[0]:e="");return!0===f&&0<m.length?c.a.pb(m):c.a.T(e)};c.a.cc=function(a,b){var d=c.a.ob(a,b),e=a[c.b.H],f=a[c.b.J];return function(){var a=[];c.a.O(a,d,e,f);return a}};
c.a.Wb=function(a){var b=a[c.b.wd];a=a[c.b.xd];b=void 0!==b?b:0;return!0===a?function(){return new Date}:function(){return new Date(b)}};c.a.qd=function(a){var b=c.a.Wb(a),d=a[c.b.H],e=a[c.b.J];return function(){var a=[];c.a.O(a,b,d,e);return a}};c.a.$b=function(a){var b=a[c.b.yd];return!0===a[c.b.zd]?function(){return c.a.Oa()}:c.a.T(void 0!==b?b:"")};c.a.rd=function(a){var b=c.a.$b(a),d=a[c.b.H],e=a[c.b.J];return function(){var a=[];c.a.O(a,b,d,e);return a}};
c.a.Vb=function(a){var b=a[c.b.ud];return!0===a[c.b.vd]?function(){return c.a.Na()}:c.a.T(void 0!==b?b:"")};c.a.pd=function(a){var b=c.a.Vb(a),d=a[c.b.H],e=a[c.b.J];return function(){var a=[];c.a.O(a,b,d,e);return a}};c.a.mb=function(a,b,d){var e=a[c.b.ga],f=a[c.b.ka];return function(){c.a.na(void 0,e,f,b,d)}};c.a.Xb=function(a,b,d){var e=c.a.mb(a,b,d),f=a[c.b.H],k=a[c.b.J];return function(){var a=[];c.a.O(a,e,f,k);return a}};c.a.ac=function(){return function(){return{}}};c.a.fc=function(a){return c.a.jc(a[c.b.Ta])};
c.a.kc=function(a,b,d,e){switch(b[c.b.C]){case c.b.g.oa:return c.a.lc(a,b);case c.b.g.pa:return c.a.mc(a,b);case c.b.g.va:return c.a.sc(a,b);case c.b.g.wa:return c.a.tc(a,b);case c.b.g.sa:return c.a.pc(a,b);case c.b.g.ta:return c.a.qc(a,b);case c.b.g.za:return c.a.wc(a,b);case c.b.g.Aa:return c.a.xc(a,b);case c.b.g.Ba:return c.a.yc(a,b);case c.b.g.xa:return c.a.uc(a,b,d);case c.b.g.ya:return c.a.vc(a,b,d);case c.b.g.qa:return c.a.nc(a,b,e);case c.b.g.ra:return c.a.oc(a,b,e);case c.b.g.ua:return c.a.rc(a,
e)}};c.a.lc=function(a,b){var d=b[c.b.fa];void 0===d&&(d=!1);if(!0===a&&a!==d||!1===a&&a!==d)return a};c.a.mc=function(a,b){var d=c.a.Ia(a,b),e=c.a.Ia(void 0,b);if(!0!==c.a.Z(d,e))return d};c.a.sc=function(a,b){var d=b[c.b.Da];if("number"===typeof a){var e=Math.round(a);if(e!==(void 0!==d?d:0))return e}};c.a.tc=function(a,b){var d=c.a.Ka(a,b),e=c.a.Ka(void 0,b);if(!0!==c.a.Z(d,e))return d};c.a.pc=function(a,b){var d=b[c.b.ha];if("number"===typeof a&&a!==(void 0!==d?d:0))return a};
c.a.qc=function(a,b){var d=c.a.Ja(a,b),e=c.a.Ja(void 0,b);if(!0!==c.a.Z(d,e))return d};c.a.wc=function(a,b){var d=b[c.b.ja];if(("string"===typeof a||a instanceof String)&&(void 0!==d?d:"")!==a)return a};c.a.xc=function(a,b){var d=c.a.Ma(a,b),e=c.a.Ma(void 0,b);if(!0!==c.a.Z(d,e))return d};c.a.uc=function(a,b,d){d=c.G(d,b[c.b.X]);var e=b[c.b.Ea];!0===b[c.b.ia]&&(e=void 0);if(d&&("string"===typeof a||a instanceof String)&&a in d&&a!==e)return a};
c.a.vc=function(a,b,d){a=c.a.La(a,b,d);if(1==b[c.b.ia])return a;b=c.a.La(void 0,b,d);if(!0!==c.a.Z(a,b))return a};c.a.nc=function(a,b,d){var e=b[c.b.ka],f=void 0;"GetType"in a&&(f=a.GetType());var k=void 0;void 0!==e&&void 0!==f&&-1!==e.indexOf(f)&&(k=d.w(a));if(k&&(f!==b[c.b.ga]||1!==Object.keys(k).length))return k};
c.a.oc=function(a,b,d){if(void 0!=a&&!1!==Array.isArray(a)){var e=[],f=b[c.b.ga];b=b[c.b.H];void 0===b&&(b=0);b=1&a.length==b;for(var k=0,m=a.length;k<m;k++){var h=d.w(a[k]);b&=h.type===f&&1===Object.keys(h).length;e.push(h)}if(1!=b)return e}};c.a.rc=function(a,b){if(void 0!=a){var d=0,e=[];for(id in a)if(a.hasOwnProperty(id)){var f=a[id];void 0!=f&&"GetValue"in f&&f.K("id")===id&&(f=b.w(f),e.push(f),d+=1)}if(d)return e}};
c.a.Z=function(a,b){var d=void 0!=b&&Array.isArray(b);if(0==(void 0!=a&&Array.isArray(a))||0==d||a.length!=b.length)return!1;for(var d=0,e=a.length;d<e;d++)if(a[d]!==b[d])return!1;return!0};c.a.nd=function(a,b){var d=void 0!=b&&Array.isArray(b);if(0==(void 0!=a&&Array.isArray(a))||0==d||a.length!=b.length)return!1;for(var d=0,e=a.length;d<e;d++)if(a[d].valueOf()!==b[d].valueOf())return!1;return!0};
c.a.Eb=function(a,b){var d=void 0!=b&&Array.isArray(b);if(0==(void 0!=a&&Array.isArray(a))||0==d||a.length!=b.length)return!1;for(var d=0,e=a.length;d<e;d++)if(-1===b.indexOf(a[d]))return!1;return!0};c.a.yc=function(a,b){var d=b[c.b.Ta];void 0===d&&(d=[]);var e;if(void 0!==a){e=[];for(temp_key in a)a.hasOwnProperty(temp_key)&&e.push(temp_key);if(!1===c.a.Eb(e,d))return e}};c.i=function(a,b,d,e){this.I=a;this.M=b;this.w=d;this.W=e;this.f=[];this.o=[]};c.DagNodeValue=c.i;c.i.F=function(a,b,d,e){return new c.i(a,b,d,e)};c.i.Factory=c.i.F;c.i.prototype.Za=function(){var a=this.W();a!==this.w&&(this.w=a,this.N())};c.i.prototype.Clear=c.i.prototype.Za;c.i.prototype.K=function(){c.D(!1,"DagNodeValue.GetValue name:"+this.I);return this.w};c.i.prototype.GetValue=c.i.prototype.K;
c.i.prototype.P=function(a){if(a===this.w)return!1;for(var b=0,d=this.o.length;b<d;b++){var e=this.o[b];void 0!==e&&e.Za()}this.w=a;this.N();return!0};c.i.prototype.SetValue=c.i.prototype.P;c.i.prototype.N=function(){for(var a=0,b=this.f.length;a<b;a++){var d=this.f[a];void 0!==d&&d.N()}this.M&&(a=this.M,a.f&&a.f.N())};c.i.prototype.SetDirty=c.i.prototype.N;c.i.prototype.S=function(){return this.I};c.i.prototype.GetName=c.i.prototype.S;c.i.prototype.aa=function(a){this.f.push(a)};
c.i.prototype.AddOutput=c.i.prototype.aa;c.i.prototype.ca=function(a){this.f=this.f.filter(function(b){return b!==a})};c.i.prototype.RemoveOutput=c.i.prototype.ca;c.i.prototype.da=function(a){this.o.push(a)};c.i.prototype.AddExclusive=c.i.prototype.da;c.i.prototype.Xa=function(a){this.o=this.o.filter(function(b){return b!==a})};c.i.prototype.RemoveExclusive=c.i.prototype.Xa;
c.i.prototype.toString=function(){for(var a="{m_name:"+this.I+", m_value:"+this.w+", m_outputArray:[",b=0,d=this.f.length;b<d;b++){var e=this.f[b];b&&(a+=", ");a+=e.S()}a+="], m_exclusiveArray[";b=0;for(d=this.o.length;b<d;b++)e=this.o[b],b&&(a+=", "),a+=e.S();return a+"]}"};c.i.prototype.toString=c.i.prototype.toString;c.bb={};c.bb.Db=function(a,b){for(var d=0,e=b.length;d<e;d++)for(var f=b[d],k=f.M,m=0,h=k.length;m<h;m++){var g=k[m],l=g[c.c.ea],q=c.c.h.rb===l,l=c.c.h.sb===l;if(!1!==q||!1!==l){var n=g[c.c.L],p=a[n];if(!p)throw Error("AddNodeMapLinks node not found:"+n);g[c.c.Qa]=p;!0===q&&c.v.f(p,f);if(!0===l){if(!1===p instanceof c.i)throw Error("AddNodeMapLinks node incorrect type for setNode:"+n);c.v.f(f,p)}}}};c.v=function(a){this.f=a};c.DagNodeCollection=c.v;c.v.F=function(a){return new c.v(a)};c.v.Factory=c.v.F;c.v.prototype.K=function(a){c.D(!1,"DagNodeCollection.GetValue in_name:"+a+" in:"+(a in this.f));if(a in this.f)return this.f[a].K()};c.v.prototype.GetValue=c.v.prototype.K;c.v.prototype.P=function(a,b){a in this.f&&this.f[a].P(b)};c.v.prototype.SetValue=c.v.prototype.P;c.v.prototype.w=function(a){c.D(!0,"DagNodeCollection.GetNode in_name:"+a);if(a in this.f)return this.f[a]};
c.v.prototype.GetNode=c.v.prototype.w;c.v.prototype.o=function(a,b){this.f[a]=b};c.v.prototype.SetNode=c.v.prototype.o;c.v.f=function(a,b){a?b?(a.aa(b),b.N()):c.D(!0,"c.DagNodeCollection.SetNodesLinked in_output:"+b):c.D(!0,"c.DagNodeCollection.SetNodesLinked in_input:"+a)};c.v.SetNodesLinked=c.v.f;c.v.o=function(a,b){a.ca(b);b.N()};c.v.SetNodesUnlinked=c.v.o;
c.v.prototype.toString=function(){var a="{m_mapNameNode:{",b=!0,d;for(d in this.f)!0===b?b=!1:a+=", ",a+=d+":"+this.f[d].toString();return a+"}}"};c.V={};c.V.C="type";c.V.kd="id";c.Document=function(a,b,d){this.I=a;this.o=b;this.f=d};c.Document=c.Document;c.Document.F=function(a,b,d){return new c.Document(a,b,d)};c.Document.Factory=c.Document.F;c.Document.prototype.w=function(){return this.I};c.Document.prototype.GetType=c.Document.prototype.w;c.Document.prototype.K=function(a){c.D(!1,"c.Document.GetValue name:"+a);return this.o.K(a)};c.Document.prototype.GetValue=c.Document.prototype.K;c.Document.prototype.P=function(a,b){!0===this.o.P(a,b)&&null!==this.f&&this.f.N()};
c.Document.prototype.SetValue=c.Document.prototype.P;c.Document.prototype.M=function(){var a=this.o,b=[],d;for(d in a.f){var e=a.f[d];e.ba&&!0===e.ba()&&b.push(d)}return b};c.Document.prototype.GetDirtyArray=c.Document.prototype.M;c.Document.prototype.toString=function(){var a="{m_type:"+this.I+",";this.f&&(a+="m_parentNode:"+this.f.S()+",");a+="m_dagCollection:"+this.o+"}";return a+"}"};c.u=function(a,b){this.f=a;this.M=b};c.DocumentManager=c.u;c.u.F=function(a,b){return new c.u(a,b)};c.u.Factory=c.u.F;c.u.prototype.W=function(){return Object.keys(this.f[c.B.U])};c.u.prototype.GetTypeNameArray=c.u.prototype.W;c.u.prototype.ca=function(a){var b=this.f[c.B.U][a];if(null==b)return[];a=c.G(this.f,b[c.B.Fa]);var b=c.G(this.f,b[c.B.Ua]),d=[];a&&(d=d.concat(Object.keys(a)));b&&(d=d.concat(Object.keys(b)));return d};c.u.prototype.GetDocumentPropertyNameArray=c.u.prototype.ca;
c.u.prototype.I=function(a){if(null==this.f[c.B.U])c.D(!0,"DocumentManager.NewDocumentData gameobject_types undefined");else if(!1===a in this.f[c.B.U])c.D(!0,"DocumentManager.NewDocumentData document_types in_type not found:"+a);else{var b={};b[c.V.C]=a;a=this.o(b,void 0);b=void 0;a&&(b=this.w(a));return b}};c.u.prototype.NewDocumentData=c.u.prototype.I;
c.u.prototype.ba=function(a,b){var d=this.f[c.B.U][a];if(null!=d){var e=c.G(this.f,d[c.B.Fa]),e=e&&b in e?e[b]:void 0,f=(d=c.G(this.f,d[c.B.Ua]))&&b in d?d[b]:void 0,k=d=void 0,m=void 0;void 0!==e&&c.b.C in e&&(d=e[c.b.C]);void 0!==f&&c.c.C in f&&(d=f[c.c.C]);void 0!==e&&(k=c.b.tb in e?!0===e[c.b.tb]:!1);void 0!==f&&(k=!0);void 0!==e&&c.b.X in e&&(e=c.G(this.f,e[c.b.X]))&&(m=Object.keys(e));return{type:d,locked:k,keyoptions:m}}};c.u.prototype.GetDocumentPropertyData=c.u.prototype.ba;
c.u.prototype.o=function(a,b){if(a){var d=a[c.V.C];if(null==d)c.D(!0,"DocumentManager.DocumentDataToDocument no type in data document");else{var e=this.f[c.B.U][d];if(null!=e){var f=c.v.F({}),d=c.Document.F(d,f,b),k=c.G(this.f,e[c.B.Fa]),m=c.G(this.f,e[c.B.Ua]),h=e[c.B.jd],e={};void 0!=h&&this.M&&(e=this.M[h]);e=void 0===e?{}:e;if(k)for(var g in k){var l=k[g],h=c.i.F(g,d,void 0,void 0),q=c.a.lb(l,this.f,this,h),l=c.a.eb(a[g],l,this.f,this,h);h.P(l);h.W=q;f.o(g,h)}g=[];if(m)for(var n in m){k=m[n][c.c.Ca];
h=[];q=0;for(l=k.length;q<l;q++){var p=k[q],r={};r[c.c.ea]=p[c.c.ea];r[c.c.L]=p[c.c.L];h.push(r)}k=c.A.F(n,d,h,this.f,e);g.push(k);f.o(n,k)}c.bb.Db(f.f,g);return d}}}};c.u.prototype.DocumentDataToDocument=c.u.prototype.o;c.u.prototype.w=function(a){if(a){var b=a.w(),d=this.f[c.B.U][b];if(null!=d){var d=c.G(this.f,d[c.B.Fa]),e={};e[c.V.C]=b;if(d)for(var f in d){var b=d[f],k=a.K(f);void 0!==k&&(b=c.a.kc(k,b,this.f,this),void 0!==b&&(e[f]=b))}return e}}};c.u.prototype.DocumentToDocumentData=c.u.prototype.w;
c.u.prototype.da=function(a,b,d,e){return c.l.F(a,b,d,e)};c.u.prototype.MakeUpdatePatch=c.u.prototype.da;c.u.prototype.aa=function(a,b){return c.l.Ya(a,b)};c.u.prototype.ApplyUpdatePatch=c.u.prototype.aa;c.B={};c.B.U="documenttypes";c.B.Fa="value";c.B.Ua="calculate";c.B.jd="instructioncontext";c.j={};c.j.ld="lock";c.j.Ca="d";c.j.C="t";c.j.Wa="r";c.j.Va="i";c.j.Cb="u";c.j.Y="p";c.j.la="v";c.l={};c.ObjectDelta=c.l;c.l.F=function(a,b,d,e){var f=[];e||(e=[]);c.l.$a(f,e,a,b);a={};0<f.length&&(a[c.j.Ca]=f);void 0!=d&&(a[c.j.ld]=d);return a};c.l.Factory=c.l.F;
c.l.Ga=function(a,b,d,e){if(void 0!==d&&void 0===e)e={},e[c.j.C]=c.j.Wa,e[c.j.Y]=c.R(b),a.push(e);else if(void 0===d&&void 0!==e)d={},d[c.j.C]=c.j.Va,d[c.j.Y]=c.R(b),d[c.j.la]=e,a.push(d);else if(void 0!==d&&void 0!==e){var f=Object.prototype.toString.call(d),k=Object.prototype.toString.call(e);f!==k?c.D(!0,"c.ObjectDelta.CollectDelta type missmatch sourceType:"+f+" targetType:"+k+" path:"+JSON.stringify(b)):"[object Array]"===f?c.l.Gb(a,b,d,e):"[object Object]"===f?c.l.$a(a,b,d,e):d!==e&&(d={},d[c.j.C]=
c.j.Cb,d[c.j.Y]=c.R(b),d[c.j.la]=e,a.push(d))}};c.l.Gb=function(a,b,d,e){for(var f=[],k=0,m=e.length;k<m;k++){for(var h=e[k],g=[],l=0,q=d.length;l<q;l++){var n=c.l.ma(d[l],h);0>=n||g.push({s:l,m:n})}f.push(g)}f=c.l.zc(f);k=q=l=g=0;for(m=f.length;k<m;k++){h=e[k];n=f[k];if(void 0==n)c.l.Hb(a,b,h,k),g+=1;else{for(var p=n.s,r=p+g-l;k<r;)c.l.cb(a,b,r-1),l+=1,r=p+g-l;n=n.m;1>n&&c.l.Ib(a,b,d[p],h,r)}q+=1}for(;q<d.length+g-l;)c.l.cb(a,b,q),l+=1};
c.l.ma=function(a,b){var d=Object.prototype.toString.call(a);if(d!==Object.prototype.toString.call(b))return 0;if("[object Array]"===d){var d=0,e=1;a.length!==b.length&&(e=.5);for(var f=Math.min(a.length,b.length),k=0;k<f;k++)d+=c.l.ma(a[k],b[k]);k=1;0<f&&(k=d/f);return k*e}if("[object Object]"===d){d=f=0;for(key in a)!1!==a.hasOwnProperty(key)&&(f+=1,d+=c.l.ma(a[key],b[key]));for(key in b)!1===b.hasOwnProperty(key)||key in a||(f+=1,d+=c.l.ma(a[key],b[key]));k=1;0<f&&(k=d/f);return k}return a===b?
1:0};c.l.cb=function(a,b,d){var e={};b=c.R(b);b.push(d);e[c.j.C]=c.j.Wa;e[c.j.Y]=b;a.push(e)};c.l.Hb=function(a,b,d,e){var f={};b=c.R(b);b.push(e);f[c.j.C]=c.j.Va;f[c.j.Y]=b;f[c.j.la]=d;a.push(f)};c.l.Ib=function(a,b,d,e,f){b=c.R(b);b.push(f);c.l.Ga(a,b,d,e)};c.l.zc=function(a){for(var b=[],d=-1,e=0,f=a.length;e<f;e++){for(var k=a[e],m=void 0,h=0,g=k.length;h<g;h++){var l=k[h];if(d<l.s){d=l.s;m=l;break}}b.push(m)}return b};
c.l.$a=function(a,b,d,e){for(key in d)if(!1!==d.hasOwnProperty(key)){var f=c.R(b);f.push(key);c.l.Ga(a,f,d[key],e[key])}for(key in e)!1===e.hasOwnProperty(key)||key in d||(f=c.R(b),f.push(key),c.l.Ga(a,f,d[key],e[key]))};
c.l.Ya=function(a,b){var d=c.Ha(a),e=b[c.j.Ca];if(null==e)return d;for(var f=0,k=e.length;f<k;f++){var m=e[f],h=m[c.j.C],g=c.R(m[c.j.Y]);switch(h){case c.j.Wa:m=g[g.length-1];g.splice(-1,1);g=c.G(d,g);!0===c.kb(g)?g.splice(m,1):delete g[m];break;case c.j.Va:h=g[g.length-1];g.splice(-1,1);g=c.G(d,g);m=m[c.j.la];!0===c.kb(g)?g.splice(h,0,m):g[h]=m;break;case c.j.Cb:m=m[c.j.la],c.qb(d,g,m)}}return d};c.l.ApplyDelta=c.l.Ya;c.Sb={};c.InstructionContext=c.Sb;