"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[953],{85904:function(t,e,n){n.d(e,{Z:function(){return s}});/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n(57977).Z)("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]])},76737:function(t,e,n){var s,o,i,a,r,c,l,d,u,h,f,g,E,p,C,m,O,y,_,v,I,T,N,A;n.d(e,{$D:function(){return ti}}),(E=s||(s={})).STRING="string",E.NUMBER="number",E.INTEGER="integer",E.BOOLEAN="boolean",E.ARRAY="array",E.OBJECT="object",(p=o||(o={})).LANGUAGE_UNSPECIFIED="language_unspecified",p.PYTHON="python",(C=i||(i={})).OUTCOME_UNSPECIFIED="outcome_unspecified",C.OUTCOME_OK="outcome_ok",C.OUTCOME_FAILED="outcome_failed",C.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded";/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let R=["user","model","function","system"];(m=a||(a={})).HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",m.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",m.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",m.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",m.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",(O=r||(r={})).HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",O.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",O.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",O.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",O.BLOCK_NONE="BLOCK_NONE",(y=c||(c={})).HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",y.NEGLIGIBLE="NEGLIGIBLE",y.LOW="LOW",y.MEDIUM="MEDIUM",y.HIGH="HIGH",(_=l||(l={})).BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",_.SAFETY="SAFETY",_.OTHER="OTHER",(v=d||(d={})).FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",v.STOP="STOP",v.MAX_TOKENS="MAX_TOKENS",v.SAFETY="SAFETY",v.RECITATION="RECITATION",v.LANGUAGE="LANGUAGE",v.OTHER="OTHER",(I=u||(u={})).TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",I.RETRIEVAL_QUERY="RETRIEVAL_QUERY",I.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",I.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",I.CLASSIFICATION="CLASSIFICATION",I.CLUSTERING="CLUSTERING",(T=h||(h={})).MODE_UNSPECIFIED="MODE_UNSPECIFIED",T.AUTO="AUTO",T.ANY="ANY",T.NONE="NONE",(N=f||(f={})).MODE_UNSPECIFIED="MODE_UNSPECIFIED",N.MODE_DYNAMIC="MODE_DYNAMIC";/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S extends Error{constructor(t){super("[GoogleGenerativeAI Error]: ".concat(t))}}class w extends S{constructor(t,e){super(t),this.response=e}}class b extends S{constructor(t,e,n,s){super(t),this.status=e,this.statusText=n,this.errorDetails=s}}class M extends S{}(A=g||(g={})).GENERATE_CONTENT="generateContent",A.STREAM_GENERATE_CONTENT="streamGenerateContent",A.COUNT_TOKENS="countTokens",A.EMBED_CONTENT="embedContent",A.BATCH_EMBED_CONTENTS="batchEmbedContents";class D{toString(){var t,e;let n=(null===(t=this.requestOptions)||void 0===t?void 0:t.apiVersion)||"v1beta",s=(null===(e=this.requestOptions)||void 0===e?void 0:e.baseUrl)||"https://generativelanguage.googleapis.com",o="".concat(s,"/").concat(n,"/").concat(this.model,":").concat(this.task);return this.stream&&(o+="?alt=sse"),o}constructor(t,e,n,s,o){this.model=t,this.task=e,this.apiKey=n,this.stream=s,this.requestOptions=o}}async function x(t){var e;let n=new Headers;n.append("Content-Type","application/json"),n.append("x-goog-api-client",function(t){let e=[];return(null==t?void 0:t.apiClient)&&e.push(t.apiClient),e.push("".concat("genai-js","/").concat("0.21.0")),e.join(" ")}(t.requestOptions)),n.append("x-goog-api-key",t.apiKey);let s=null===(e=t.requestOptions)||void 0===e?void 0:e.customHeaders;if(s){if(!(s instanceof Headers))try{s=new Headers(s)}catch(t){throw new M("unable to convert customHeaders value ".concat(JSON.stringify(s)," to Headers: ").concat(t.message))}for(let[t,e]of s.entries()){if("x-goog-api-key"===t)throw new M("Cannot set reserved header name ".concat(t));if("x-goog-api-client"===t)throw new M("Header name ".concat(t," can only be set using the apiClient field"));n.append(t,e)}}return n}async function L(t,e,n,s,o,i){let a=new D(t,e,n,s,i);return{url:a.toString(),fetchOptions:Object.assign(Object.assign({},function(t){let e={};if((null==t?void 0:t.signal)!==void 0||(null==t?void 0:t.timeout)>=0){let n=new AbortController;(null==t?void 0:t.timeout)>=0&&setTimeout(()=>n.abort(),t.timeout),(null==t?void 0:t.signal)&&t.signal.addEventListener("abort",()=>{n.abort()}),e.signal=n.signal}return e}(i)),{method:"POST",headers:await x(a),body:o})}}async function H(t,e,n,s,o){let i=arguments.length>5&&void 0!==arguments[5]?arguments[5]:{},a=arguments.length>6&&void 0!==arguments[6]?arguments[6]:fetch,{url:r,fetchOptions:c}=await L(t,e,n,s,o,i);return U(r,c,a)}async function U(t,e){let n,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:fetch;try{n=await s(t,e)}catch(e){!function(t,e){let n=t;throw t instanceof b||t instanceof M||((n=new S("Error fetching from ".concat(e.toString(),": ").concat(t.message))).stack=t.stack),n}(e,t)}return n.ok||await P(n,t),n}async function P(t,e){let n,s="";try{let e=await t.json();s=e.error.message,e.error.details&&(s+=" ".concat(JSON.stringify(e.error.details)),n=e.error.details)}catch(t){}throw new b("Error fetching from ".concat(e.toString(),": [").concat(t.status," ").concat(t.statusText,"] ").concat(s),t.status,t.statusText,n)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F(t){return t.text=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn("This response had ".concat(t.candidates.length," ")+"candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates."),k(t.candidates[0]))throw new w("".concat(K(t)),t);return function(t){var e,n,s,o;let i=[];if(null===(n=null===(e=t.candidates)||void 0===e?void 0:e[0].content)||void 0===n?void 0:n.parts)for(let e of null===(o=null===(s=t.candidates)||void 0===s?void 0:s[0].content)||void 0===o?void 0:o.parts)e.text&&i.push(e.text),e.executableCode&&i.push("\n```"+e.executableCode.language+"\n"+e.executableCode.code+"\n```\n"),e.codeExecutionResult&&i.push("\n```\n"+e.codeExecutionResult.output+"\n```\n");return i.length>0?i.join(""):""}(t)}if(t.promptFeedback)throw new w("Text not available. ".concat(K(t)),t);return""},t.functionCall=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn("This response had ".concat(t.candidates.length," ")+"candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates."),k(t.candidates[0]))throw new w("".concat(K(t)),t);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),G(t)[0]}if(t.promptFeedback)throw new w("Function call not available. ".concat(K(t)),t)},t.functionCalls=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn("This response had ".concat(t.candidates.length," ")+"candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates."),k(t.candidates[0]))throw new w("".concat(K(t)),t);return G(t)}if(t.promptFeedback)throw new w("Function call not available. ".concat(K(t)),t)},t}function G(t){var e,n,s,o;let i=[];if(null===(n=null===(e=t.candidates)||void 0===e?void 0:e[0].content)||void 0===n?void 0:n.parts)for(let e of null===(o=null===(s=t.candidates)||void 0===s?void 0:s[0].content)||void 0===o?void 0:o.parts)e.functionCall&&i.push(e.functionCall);return i.length>0?i:void 0}let j=[d.RECITATION,d.SAFETY,d.LANGUAGE];function k(t){return!!t.finishReason&&j.includes(t.finishReason)}function K(t){var e,n,s;let o="";if((!t.candidates||0===t.candidates.length)&&t.promptFeedback)o+="Response was blocked",(null===(e=t.promptFeedback)||void 0===e?void 0:e.blockReason)&&(o+=" due to ".concat(t.promptFeedback.blockReason)),(null===(n=t.promptFeedback)||void 0===n?void 0:n.blockReasonMessage)&&(o+=": ".concat(t.promptFeedback.blockReasonMessage));else if(null===(s=t.candidates)||void 0===s?void 0:s[0]){let e=t.candidates[0];k(e)&&(o+="Candidate was blocked due to ".concat(e.finishReason),e.finishMessage&&(o+=": ".concat(e.finishMessage)))}return o}function Y(t){return this instanceof Y?(this.v=t,this):new Y(t)}"function"==typeof SuppressedError&&SuppressedError;/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let B=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function q(t){let e=[],n=t.getReader();for(;;){let{done:t,value:s}=await n.read();if(t)return F(function(t){let e=t[t.length-1],n={promptFeedback:null==e?void 0:e.promptFeedback};for(let e of t){if(e.candidates)for(let t of e.candidates){let e=t.index;if(n.candidates||(n.candidates=[]),n.candidates[e]||(n.candidates[e]={index:t.index}),n.candidates[e].citationMetadata=t.citationMetadata,n.candidates[e].groundingMetadata=t.groundingMetadata,n.candidates[e].finishReason=t.finishReason,n.candidates[e].finishMessage=t.finishMessage,n.candidates[e].safetyRatings=t.safetyRatings,t.content&&t.content.parts){n.candidates[e].content||(n.candidates[e].content={role:t.content.role||"user",parts:[]});let s={};for(let o of t.content.parts)o.text&&(s.text=o.text),o.functionCall&&(s.functionCall=o.functionCall),o.executableCode&&(s.executableCode=o.executableCode),o.codeExecutionResult&&(s.codeExecutionResult=o.codeExecutionResult),0===Object.keys(s).length&&(s.text=""),n.candidates[e].content.parts.push(s)}}e.usageMetadata&&(n.usageMetadata=e.usageMetadata)}return n}(e));e.push(s)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function J(t,e,n,s){return function(t){let[e,n]=(function(t){let e=t.getReader();return new ReadableStream({start(t){let n="";return function s(){return e.read().then(e=>{let o,{value:i,done:a}=e;if(a){if(n.trim()){t.error(new S("Failed to parse stream"));return}t.close();return}let r=(n+=i).match(B);for(;r;){try{o=JSON.parse(r[1])}catch(e){t.error(new S('Error parsing JSON response: "'.concat(r[1],'"')));return}t.enqueue(o),r=(n=n.substring(r[0].length)).match(B)}return s()})}()}})})(t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0}))).tee();return{stream:function(t){return function(t,e,n){if(!Symbol.asyncIterator)throw TypeError("Symbol.asyncIterator is not defined.");var s,o=n.apply(t,e||[]),i=[];return s={},a("next"),a("throw"),a("return"),s[Symbol.asyncIterator]=function(){return this},s;function a(t){o[t]&&(s[t]=function(e){return new Promise(function(n,s){i.push([t,e,n,s])>1||r(t,e)})})}function r(t,e){try{var n;(n=o[t](e)).value instanceof Y?Promise.resolve(n.value.v).then(c,l):d(i[0][2],n)}catch(t){d(i[0][3],t)}}function c(t){r("next",t)}function l(t){r("throw",t)}function d(t,e){t(e),i.shift(),i.length&&r(i[0][0],i[0][1])}}(this,arguments,function*(){let e=t.getReader();for(;;){let{value:t,done:n}=yield Y(e.read());if(n)break;yield yield Y(F(t))}})}(e),response:q(n)}}(await H(e,g.STREAM_GENERATE_CONTENT,t,!0,JSON.stringify(n),s))}async function V(t,e,n,s){let o=await H(e,g.GENERATE_CONTENT,t,!1,JSON.stringify(n),s);return{response:F(await o.json())}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W(t){if(null!=t){if("string"==typeof t)return{role:"system",parts:[{text:t}]};if(t.text)return{role:"system",parts:[t]};if(t.parts)return t.role?t:{role:"system",parts:t.parts}}}function X(t){let e=[];if("string"==typeof t)e=[{text:t}];else for(let n of t)"string"==typeof n?e.push({text:n}):e.push(n);return function(t){let e={role:"user",parts:[]},n={role:"function",parts:[]},s=!1,o=!1;for(let i of t)"functionResponse"in i?(n.parts.push(i),o=!0):(e.parts.push(i),s=!0);if(s&&o)throw new S("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!s&&!o)throw new S("No content is provided for sending chat message.");return s?e:n}(e)}function Q(t){let e;return e=t.contents?t:{contents:[X(t)]},t.systemInstruction&&(e.systemInstruction=W(t.systemInstruction)),e}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Z=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],z={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]},$="SILENT_ERROR";class tt{async getHistory(){return await this._sendPromise,this._history}async sendMessage(t){var e,n,s,o,i,a;let r,c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};await this._sendPromise;let l=X(t),d={safetySettings:null===(e=this.params)||void 0===e?void 0:e.safetySettings,generationConfig:null===(n=this.params)||void 0===n?void 0:n.generationConfig,tools:null===(s=this.params)||void 0===s?void 0:s.tools,toolConfig:null===(o=this.params)||void 0===o?void 0:o.toolConfig,systemInstruction:null===(i=this.params)||void 0===i?void 0:i.systemInstruction,cachedContent:null===(a=this.params)||void 0===a?void 0:a.cachedContent,contents:[...this._history,l]},u=Object.assign(Object.assign({},this._requestOptions),c);return this._sendPromise=this._sendPromise.then(()=>V(this._apiKey,this.model,d,u)).then(t=>{var e;if(t.response.candidates&&t.response.candidates.length>0){this._history.push(l);let n=Object.assign({parts:[],role:"model"},null===(e=t.response.candidates)||void 0===e?void 0:e[0].content);this._history.push(n)}else{let e=K(t.response);e&&console.warn("sendMessage() was unsuccessful. ".concat(e,". Inspect response object for details."))}r=t}),await this._sendPromise,r}async sendMessageStream(t){var e,n,s,o,i,a;let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};await this._sendPromise;let c=X(t),l={safetySettings:null===(e=this.params)||void 0===e?void 0:e.safetySettings,generationConfig:null===(n=this.params)||void 0===n?void 0:n.generationConfig,tools:null===(s=this.params)||void 0===s?void 0:s.tools,toolConfig:null===(o=this.params)||void 0===o?void 0:o.toolConfig,systemInstruction:null===(i=this.params)||void 0===i?void 0:i.systemInstruction,cachedContent:null===(a=this.params)||void 0===a?void 0:a.cachedContent,contents:[...this._history,c]},d=Object.assign(Object.assign({},this._requestOptions),r),u=J(this._apiKey,this.model,l,d);return this._sendPromise=this._sendPromise.then(()=>u).catch(t=>{throw Error($)}).then(t=>t.response).then(t=>{if(t.candidates&&t.candidates.length>0){this._history.push(c);let e=Object.assign({},t.candidates[0].content);e.role||(e.role="model"),this._history.push(e)}else{let e=K(t);e&&console.warn("sendMessageStream() was unsuccessful. ".concat(e,". Inspect response object for details."))}}).catch(t=>{t.message!==$&&console.error(t)}),u}constructor(t,e,n,s={}){this.model=e,this.params=n,this._requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=t,(null==n?void 0:n.history)&&(function(t){let e=!1;for(let n of t){let{role:t,parts:s}=n;if(!e&&"user"!==t)throw new S("First content should be with role 'user', got ".concat(t));if(!R.includes(t))throw new S("Each item should include role field. Got ".concat(t," but valid roles are: ").concat(JSON.stringify(R)));if(!Array.isArray(s))throw new S("Content should have 'parts' property with an array of Parts");if(0===s.length)throw new S("Each Content should have at least one part");let o={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(let t of s)for(let e of Z)e in t&&(o[e]+=1);let i=z[t];for(let e of Z)if(!i.includes(e)&&o[e]>0)throw new S("Content with role '".concat(t,"' can't contain '").concat(e,"' part"));e=!0}}(n.history),this._history=n.history)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function te(t,e,n,s){return(await H(e,g.COUNT_TOKENS,t,!1,JSON.stringify(n),s)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tn(t,e,n,s){return(await H(e,g.EMBED_CONTENT,t,!1,JSON.stringify(n),s)).json()}async function ts(t,e,n,s){let o=n.requests.map(t=>Object.assign(Object.assign({},t),{model:e}));return(await H(e,g.BATCH_EMBED_CONTENTS,t,!1,JSON.stringify({requests:o}),s)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class to{async generateContent(t){var e;let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},s=Q(t),o=Object.assign(Object.assign({},this._requestOptions),n);return V(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(e=this.cachedContent)||void 0===e?void 0:e.name},s),o)}async generateContentStream(t){var e;let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},s=Q(t),o=Object.assign(Object.assign({},this._requestOptions),n);return J(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(e=this.cachedContent)||void 0===e?void 0:e.name},s),o)}startChat(t){var e;return new tt(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(e=this.cachedContent)||void 0===e?void 0:e.name},t),this._requestOptions)}async countTokens(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=function(t,e){var n;let s={model:null==e?void 0:e.model,generationConfig:null==e?void 0:e.generationConfig,safetySettings:null==e?void 0:e.safetySettings,tools:null==e?void 0:e.tools,toolConfig:null==e?void 0:e.toolConfig,systemInstruction:null==e?void 0:e.systemInstruction,cachedContent:null===(n=null==e?void 0:e.cachedContent)||void 0===n?void 0:n.name,contents:[]},o=null!=t.generateContentRequest;if(t.contents){if(o)throw new M("CountTokensRequest must have one of contents or generateContentRequest, not both.");s.contents=t.contents}else if(o)s=Object.assign(Object.assign({},s),t.generateContentRequest);else{let e=X(t);s.contents=[e]}return{generateContentRequest:s}}(t,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent}),s=Object.assign(Object.assign({},this._requestOptions),e);return te(this.apiKey,this.model,n,s)}async embedContent(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n="string"==typeof t||Array.isArray(t)?{content:X(t)}:t,s=Object.assign(Object.assign({},this._requestOptions),e);return tn(this.apiKey,this.model,n,s)}async batchEmbedContents(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=Object.assign(Object.assign({},this._requestOptions),e);return ts(this.apiKey,this.model,t,n)}constructor(t,e,n={}){this.apiKey=t,this._requestOptions=n,e.model.includes("/")?this.model=e.model:this.model="models/".concat(e.model),this.generationConfig=e.generationConfig||{},this.safetySettings=e.safetySettings||[],this.tools=e.tools,this.toolConfig=e.toolConfig,this.systemInstruction=W(e.systemInstruction),this.cachedContent=e.cachedContent}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ti{getGenerativeModel(t,e){if(!t.model)throw new S("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new to(this.apiKey,t,e)}getGenerativeModelFromCachedContent(t,e,n){if(!t.name)throw new M("Cached content must contain a `name` field.");if(!t.model)throw new M("Cached content must contain a `model` field.");for(let n of["model","systemInstruction"])if((null==e?void 0:e[n])&&t[n]&&(null==e?void 0:e[n])!==t[n]){if("model"===n&&(e.model.startsWith("models/")?e.model.replace("models/",""):e.model)===(t.model.startsWith("models/")?t.model.replace("models/",""):t.model))continue;throw new M('Different value for "'.concat(n,'" specified in modelParams')+" (".concat(e[n],") and cachedContent (").concat(t[n],")"))}let s=Object.assign(Object.assign({},e),{model:t.model,tools:t.tools,toolConfig:t.toolConfig,systemInstruction:t.systemInstruction,cachedContent:t});return new to(this.apiKey,s,n)}constructor(t){this.apiKey=t}}}}]);