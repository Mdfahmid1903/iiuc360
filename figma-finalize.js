const b=await figma.getNodeByIdAsync('16:27');const modified=[];
await Promise.all(['Regular','Medium','Semi Bold','Bold'].map(style=>figma.loadFontAsync({family:'Inter',style})));
await Promise.all(['Regular','Medium','SemiBold','Bold'].map(style=>figma.loadFontAsync({family:'Noto Sans Bengali',style})));
for(const t of b.findAllWithCriteria({types:['TEXT']})){if(!t.id.startsWith('I')){t.textAutoResize='HEIGHT';modified.push(t.id);}}
const names=['Onboarding','Home','Routine','Teachers','Transport','Map','Updates','Review update','Home Bangla','Home dark','Home Bangla dark','Prayer'];
for(let i=0;i<names.length;i++){
 const s=await figma.getNodeByIdAsync(STATE.screens[names[i]]);s.resize(390,960);s.y=230+Math.floor(i/4)*1042;
 const c=s.children.find(n=>n.name==='Content');c.itemSpacing=['Transport','Prayer'].includes(names[i])?10:12;
 const nav=s.children.find(n=>n.name==='Bottom navigation');if(nav){nav.y=880;modified.push(nav.id);}modified.push(s.id,c.id);
 const cap=b.children.find(n=>n.type==='TEXT'&&n.characters===String(i+1).padStart(2,'0')+' / '+names[i]);if(cap){cap.y=s.y-30;modified.push(cap.id);}
}
for(const [name,y]of [['Home — desktop',3420],['Schedule manager — desktop',4410],['Campus map — desktop',5400],['Update published',4410]]){
 const n=await figma.getNodeByIdAsync(STATE.screens[name]);n.y=y;modified.push(n.id);const cap=b.children.find(n=>n.type==='TEXT'&&n.characters===name);if(cap){cap.y=n.y-34;modified.push(cap.id);}
}
b.resize(1900,6550);modified.push(b.id);
const enabled=[];const modes=['Home','Home Bangla','Home dark','Home Bangla dark'];
for(const l of STATE.links){
 if(!STATE.screens[l.dest])continue;const n=await figma.getNodeByIdAsync(l.id);let p=n;while(p.parent&&p.parent.id!==b.id)p=p.parent;
 const isToggle=['বাংলা','English','Dark','Light'].includes(n.name);if(isToggle&&!modes.includes(p.name))continue;
 await n.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:STATE.screens[l.dest],navigation:'NAVIGATE',transition:{type:'DISSOLVE',duration:.18,easing:{type:'EASE_OUT'}},preserveScrollPosition:false}]}]);modified.push(n.id);enabled.push(n.id);
}
const gm=b.findOne(n=>n.type==='INSTANCE'&&n.name==='Open in Google Maps');await gm.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'URL',url:'https://www.google.com/maps/search/?api=1&query=International+Islamic+University+Chittagong+Kumira'}]}]);modified.push(gm.id);
const original=await figma.getNodeByIdAsync('9:868');const all=b.findAll(()=>true);
return {mutatedNodeIds:modified,prototypeLinks:enabled.length+1,originalBounds:{x:original.x,y:original.y,w:original.width,h:original.height},descendantCount:all.length,nodeTypes:all.reduce((a,n)=>(a[n.type]=(a[n.type]||0)+1,a),{}),fonts:[...new Set(b.findAllWithCriteria({types:['TEXT']}).map(n=>n.fontName.family))],imageNodes:all.filter(n=>'fills'in n&&Array.isArray(n.fills)&&n.fills.some(f=>f.type==='IMAGE')).map(n=>({id:n.id,name:n.name,type:n.type,w:n.width,h:n.height})),screens:b.children.filter(n=>n.type==='FRAME').map(s=>({id:s.id,name:s.name,h:s.height,content:s.children.filter(n=>n.name==='Content'||n.name==='Desktop content').map(n=>({bottom:n.y+n.height,navTop:s.children.find(n=>n.name==='Bottom navigation')?.y}))}))};
