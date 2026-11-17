const page = await figma.getNodeByIdAsync('0:1');
await figma.setCurrentPageAsync(page);
if (page.children.some(n=>n.name==='IIUC / Revision 02 / Student experience')) throw new Error('Revision already exists; inspect before retry.');
await Promise.all(['Regular','Medium','Semi Bold','Bold'].map(style=>figma.loadFontAsync({family:'Inter',style})));
await Promise.all(['Regular','Medium','SemiBold','Bold'].map(style=>figma.loadFontAsync({family:'Noto Sans Bengali',style})));
const created=[];
const rgb=h=>({r:parseInt(h.slice(0,2),16)/255,g:parseInt(h.slice(2,4),16)/255,b:parseInt(h.slice(4,6),16)/255});
// Adapted from the skill's createVariableCollection helper.
async function createVariableCollection(name, modeNames) {
 const collection=figma.variables.createVariableCollection(name), modeIds={};
 collection.renameMode(collection.modes[0].modeId,modeNames[0]); modeIds[modeNames[0]]=collection.modes[0].modeId;
 for(let i=1;i<modeNames.length;i++) modeIds[modeNames[i]]=collection.addMode(modeNames[i]);
 return {collection,modeIds};
}
const {collection,modeIds}=await createVariableCollection('IIUC R02 / Theme',['Light','Dark']);
const palette={page:['EDF4F7','101F2A'],surface:['FFFFFF','1B2F3D'],ink:['173B4A','ECF4F7'],muted:['58717F','A9BDC9'],line:['D4E1E7','344D5C'],primary:['236E91','94D5EE'],onPrimary:['FFFFFF','0D2938'],tint:['DFEDF3','233F50'],glass:['FFFFFF','294453'],success:['32715D','A1D7BF'],warm:['F4EEE1','3A352A']};
const variables={};
for(const [name,values] of Object.entries(palette)){const v=figma.variables.createVariable(name,collection,'COLOR');v.scopes=['FRAME_FILL','SHAPE_FILL','TEXT_FILL','STROKE_COLOR'];v.setVariableCodeSyntax('WEB','var(--'+name+')');for(const [i,mode]of ['Light','Dark'].entries())v.setValueForMode(modeIds[mode],{...rgb(values[i]),a:name==='glass'?(i?.75:.66):1});variables[name]=v;}
const metrics=await createVariableCollection('IIUC R02 / Geometry',['Value']);
for(const [name,value,scope]of [['space/8',8,'GAP'],['space/12',12,'GAP'],['space/16',16,'GAP'],['space/24',24,'GAP'],['radius/pill',999,'CORNER_RADIUS'],['radius/panel',20,'CORNER_RADIUS']]){const v=figma.variables.createVariable(name,metrics.collection,'FLOAT');v.scopes=[scope];v.setValueForMode(metrics.modeIds.Value,value);variables[name]=v;}
const styles={};
for(const [key,size,style,line]of [['title',30,'Semi Bold',38],['heading',22,'Semi Bold',29],['body',14,'Regular',21],['label',13,'Semi Bold',18],['caption',11,'Medium',16]]){const s=figma.createTextStyle();s.name='IIUC R02 / '+key;s.fontName={family:'Inter',style};s.fontSize=size;s.lineHeight={unit:'PIXELS',value:line};styles[key]=s;}
const glass=figma.createEffectStyle();glass.name='IIUC R02 / Glass controls';glass.effects=[{type:'BACKGROUND_BLUR',radius:18,visible:true,blurType:'NORMAL'},{type:'DROP_SHADOW',color:{...rgb('173B4A'),a:.09},offset:{x:0,y:6},radius:18,spread:-4,visible:true,blendMode:'NORMAL'},{type:'INNER_SHADOW',color:{r:1,g:1,b:1,a:.7},offset:{x:0,y:1},radius:1,visible:true,blendMode:'NORMAL'}];
const solid=(key)=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:rgb('FFFFFF')},'color',variables[key]);
function label(parent,value,size=14,weight='Regular',color='ink'){const n=figma.createText();n.fontName={family:'Inter',style:weight};n.fontSize=size;n.lineHeight={unit:'PIXELS',value:Math.round(size*1.45)};n.characters=value;n.fills=[solid(color)];parent.appendChild(n);created.push(n.id);return n;}
const right=Math.max(...page.children.map(n=>n.x+n.width));
const board=figma.createFrame();board.name='IIUC / Revision 02 / Student experience';board.resize(1900,6000);board.x=right+240;board.y=616;board.fills=[{type:'SOLID',color:rgb('DFE8ED')}];board.clipsContent=false;created.push(board.id);
let title=label(board,'IIUC Student Hub',44,'Semi Bold');title.x=64;title.y=44;
let sub=label(board,'Revision 02 — a quieter campus companion',18,'Regular','muted');sub.x=66;sub.y=106;
let note=label(board,'Editable concept · original designs preserved · demo schedules until PDFs are provided',13,'Regular','muted');note.x=66;note.y=144;
const kit=figma.createFrame();kit.name='IIUC R02 / Local components';kit.resize(760,480);kit.x=board.x+1960;kit.y=board.y;kit.fills=[{type:'SOLID',color:rgb('EDF4F7')}];created.push(kit.id);
const ktitle=label(kit,'Shared controls · Inter / Noto Sans Bengali',20,'Semi Bold');ktitle.x=24;ktitle.y=20;
const comps={};
for(const [i,kind]of ['Primary','Glass','Quiet','Field'].entries()){
 const c=figma.createComponent();c.name='IIUC R02 / '+kind;c.description='Reusable '+kind.toLowerCase()+' control; inherits light/dark theme. Label is an exposed text property.';c.resize(kind==='Field'?342:160,48);c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';c.primaryAxisAlignItems=kind==='Field'?'MIN':'CENTER';c.counterAxisAlignItems='CENTER';c.paddingLeft=18;c.paddingRight=18;c.itemSpacing=8;c.cornerRadius=999;c.setBoundVariable('topLeftRadius',variables['radius/pill']);c.setBoundVariable('topRightRadius',variables['radius/pill']);c.setBoundVariable('bottomLeftRadius',variables['radius/pill']);c.setBoundVariable('bottomRightRadius',variables['radius/pill']);c.fills=[solid(kind==='Primary'?'primary':kind==='Quiet'?'tint':'glass')];c.strokes=[solid('line')];c.strokeWeight=.75;c.effectStyleId=glass.id;kit.appendChild(c);c.x=24+(i%2)*365;c.y=76+Math.floor(i/2)*86;created.push(c.id);
 const t=label(c,kind==='Field'?'Search or enter a value':'Button',13,'Medium',kind==='Primary'?'onPrimary':'ink');t.textStyleId=styles.label.id;const prop=c.addComponentProperty('Label','TEXT',t.characters);t.componentPropertyReferences={characters:prop};comps[kind]={id:c.id,prop};
}
const info=label(kit,'Glass belongs on controls. Content uses typography, space and fine rules.\nNo heavy accent borders. No teacher portraits.',13,'Regular','muted');info.x=24;info.y=290;
return {createdNodeIds:created,board:{id:board.id,x:board.x,y:board.y,width:board.width,height:board.height},kitId:kit.id,collectionId:collection.id,modeIds,variables:Object.fromEntries(Object.entries(variables).map(([k,v])=>[k,v.id])),styles:Object.fromEntries(Object.entries(styles).map(([k,v])=>[k,v.id])),glassStyleId:glass.id,components:comps};
