(()=>{
  if(!Attn.requireSetup()) return;
  const startBtn=Attn.qs('#start'), stage=Attn.qs('#stageContent'), bar=Attn.qs('#bar'), phaseLabel=Attn.qs('#phaseLabel'), countLabel=Attn.qs('#countLabel');
  let phase='idle', trials=[], idx=0, trialStart=0, timer=null, locked=false, rows=[];
  // 标准箭头 Flanker 变式：箭头方向与方向键存在直观映射。
  const targets=['left','right'];
  const symbol={left:'←',right:'→'};
  function makeTrial(cue,congruency,practice=false){
    const target=targets[Math.floor(Math.random()*targets.length)];
    const flank = congruency==='congruent' ? target : (target==='left'?'right':'left');
    return {cue,congruency,target,flanker:flank,practice};
  }
  function buildFormal(){const a=[];for(const cue of ['standard','highlight'])for(const congruency of ['congruent','incongruent'])for(let i=0;i<12;i++)a.push(makeTrial(cue,congruency,false));return Attn.shuffle(a)}
  function buildPractice(){const a=[];for(const cue of ['standard','highlight'])for(const congruency of ['congruent','incongruent'])for(let i=0;i<2;i++)a.push(makeTrial(cue,congruency,true));return Attn.shuffle(a)}
  function updateProgress(){const total=trials.length;const done=Math.min(idx,total);countLabel.textContent=`${done} / ${total}`;bar.style.width=(total?done/total*100:0)+'%';phaseLabel.textContent=phase==='practice'?'练习':'正式实验'}
  function showFixation(){locked=true;stage.innerHTML='<div class="big-fix">+</div>';timer=setTimeout(showStimulus,400)}
  function stimHTML(t){
    const fc=t.cue==='highlight'?'muted':'standard', tc=t.cue==='highlight'?'highlight':'standard';
    const arrows=[t.flanker,t.flanker,t.target,t.flanker,t.flanker];
    const glyphs=arrows.map((v,i)=>`<span class="${i===2?'target '+tc:'flanker '+fc}" aria-label="${v==='left'?'向左':'向右'}">${symbol[v]}</span>`).join('');
    return `<div class="flanker-stimulus" role="img" aria-label="五个箭头，请判断中间箭头方向">${glyphs}</div><div class="key-hint"><span class="key">← 键 = 向左</span><span class="key">→ 键 = 向右</span></div>`
  }
  function showStimulus(){locked=false;const t=trials[idx];stage.innerHTML=stimHTML(t);trialStart=performance.now();timer=setTimeout(()=>record(null),2200)}
  function record(key){if(locked)return;locked=true;clearTimeout(timer);const t=trials[idx];const rt=key?performance.now()-trialStart:null;const response=key==='ArrowLeft'?'left':key==='ArrowRight'?'right':null;const correct=response===t.target;
    rows.push({session_id:sessionId,participant:Attn.getParticipant(),experiment:Attn.experimentName('flanker'),phase,trial_index:idx+1,cue_condition:t.cue,congruency:t.congruency,stimulus_type:'arrow',target:t.target,flanker:t.flanker,response,response_key:key,correct:correct?1:0,rt_ms:rt?Math.round(rt*10)/10:null,timestamp:new Date().toISOString()});
    if(phase==='practice'){stage.innerHTML=stimHTML(t)+`<div class="feedback ${correct?'ok':'bad'}">${correct?'✓ 正确':'✕ 错误'}</div>`;setTimeout(next,650)} else setTimeout(next,300);
  }
  function next(){idx++;updateProgress();if(idx>=trials.length){if(phase==='practice')showPracticeDone();else finish();return}showFixation()}
  function showPracticeDone(){phase='between';stage.innerHTML='<h2>练习完成</h2><p>正式实验共 48 次。请保持注意，尽量又快又准。</p><button class="btn" id="formalBtn">开始正式实验</button>';phaseLabel.textContent='练习完成';countLabel.textContent='8 / 8';bar.style.width='100%';Attn.qs('#formalBtn').onclick=beginFormal}
  function beginFormal(){phase='formal';trials=buildFormal();idx=0;rows=[];updateProgress();showFixation()}
  async function finish(){phase='done';updateProgress();Attn.saveTrials(rows);const valid=rows.filter(r=>r.correct===1&&r.rt_ms>=150&&r.rt_ms<=3000);const by=(cue,cong)=>valid.filter(r=>r.cue_condition===cue&&r.congruency===cong).map(r=>r.rt_ms);const m=(a)=>Attn.mean(a);const sEff=m(by('standard','incongruent'))-m(by('standard','congruent'));const hEff=m(by('highlight','incongruent'))-m(by('highlight','congruent'));const acc=rows.filter(r=>r.correct===1).length/rows.length*100;
    stage.innerHTML=`<h2>Flanker 实验完成</h2><div class="kpi-grid"><div class="kpi"><div class="value">${acc.toFixed(1)}%</div><div class="label">正确率</div></div><div class="kpi"><div class="value">${Number.isFinite(sEff)?sEff.toFixed(0):'—'} ms</div><div class="label">同色 Flanker 效应</div></div><div class="kpi"><div class="value">${Number.isFinite(hEff)?hEff.toFixed(0):'—'} ms</div><div class="label">突出目标 Flanker 效应</div></div><div class="kpi"><div class="value">${rows.length}</div><div class="label">正式 trial</div></div></div><div class="debrief"><h3>从注意实验到教学材料设计</h3><p>课堂 PPT 中的颜色和高亮可以充当注意线索。本实验比较的是目标识别的速度与干扰程度，不能据此直接判断记忆、理解或学习成绩有没有提高。</p><p class="small">思考：如果将目标从单个字母换成概念解释，突出重点是否仍然有效？这需要额外的学习测验才能回答。</p></div><div id="uploadStatus" class="status">正在尝试上传……</div><div class="actions"><button class="btn outline" id="download">下载本实验数据</button><a class="btn" href="graphical.html">继续实验 2</a></div>`;
    Attn.qs('#download').onclick=()=>Attn.downloadRows(rows,`flanker_${Attn.getParticipant()}`);const result=await Attn.submitExperiment(Attn.experimentName('flanker_arrow_improved'),rows);const us=Attn.qs('#uploadStatus');if(window.ATTN_CONFIG?.TEST_MODE) result.message='【测试模式】'+result.message;us.className='status '+(result.ok?'ok':'err');us.textContent=result.message;
  }
  function startPractice(){phase='practice';trials=buildPractice();idx=0;rows=[];startBtn.disabled=true;updateProgress();showFixation()}
  const sessionId=Attn.uid();startBtn.onclick=startPractice;document.addEventListener('keydown',e=>{if(phase!=='practice'&&phase!=='formal')return;const k=e.key;if(k==='ArrowLeft'||k==='ArrowRight'){e.preventDefault();if(!e.repeat)record(k)}});
})();
