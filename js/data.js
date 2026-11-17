/* All schedules and roll mappings are assignment fixtures, not official IIUC records. */
(function(root){
  const groups = [
    {id:'cse-5-a',department:'CSE',semester:5,section:'A',prefix:'C221'},
    {id:'cse-3-a',department:'CSE',semester:3,section:'A',prefix:'C231'},
    {id:'cse-1-a',department:'CSE',semester:1,section:'A',prefix:'C241'}
  ];
  const subjects = [
    {id:'algorithms',name:'Algorithms',bn:'অ্যালগরিদম',code:'CSE-2203',room:'4201',start:'08:30',end:'09:50'},
    {id:'structures',name:'Data Structures',bn:'ডেটা স্ট্রাকচার',code:'CSE-2201',room:'4203',start:'11:30',end:'12:50'},
    {id:'database',name:'Database Lab',bn:'ডেটাবেজ ল্যাব',code:'CSE-2204',room:'Lab 3',start:'13:30',end:'15:20'},
    {id:'english',name:'English II',bn:'ইংরেজি ২',code:'ENG-1202',room:'3105',start:'15:30',end:'16:20'}
  ];
  const routines = {};
  groups.forEach((g,gi)=>{
    const rows=subjects.map((r,i)=>({...r,...(gi===1?{name:['Object-Oriented Programming','Discrete Mathematics','Programming Lab','English I'][i],bn:['অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং','ডিসক্রিট গণিত','প্রোগ্রামিং ল্যাব','ইংরেজি ১'][i],code:['CSE-2101','MAT-2103','CSE-2102','ENG-1101'][i]}:gi===2?{name:['Introduction to Computing','Calculus I','Computer Fundamentals Lab','English I'][i],bn:['কম্পিউটিং পরিচিতি','ক্যালকুলাস ১','কম্পিউটার ফান্ডামেন্টালস ল্যাব','ইংরেজি ১'][i],code:['CSE-1101','MAT-1101','CSE-1102','ENG-1101'][i]}:{})}));
    routines[g.id]={id:'routine-'+g.id+'-v1',kind:'routine',target:g.id,version:1,effective:'2026-01-01',source:'Assignment sample',days:{0:rows,1:rows.slice(0,3),2:[rows[1],rows[2]],3:[rows[0],rows[3]],4:rows.slice(0,2),5:[],6:[rows[0],rows[2]]}};
  });
  const stops=[
    {id:'halishahar',name:'Halishahar',bn:'হালিশহর',aliases:['halishahar','halishohor','halishar','হালিশহর'],outbound:['07:20','08:10','09:00'],return:['13:30','15:30','17:00']},
    {id:'agrabad',name:'Agrabad',bn:'আগ্রাবাদ',aliases:['agrabad','আগ্রাবাদ'],outbound:['07:00','08:00','09:00'],return:['13:30','15:30','17:00']},
    {id:'gec',name:'GEC Circle',bn:'জিইসি মোড়',aliases:['gec','g e c','জিইসি'],outbound:['07:35','08:25','09:15'],return:['13:30','15:30','17:00']},
    {id:'ak-khan',name:'A. K. Khan',bn:'এ কে খান',aliases:['ak khan','a k khan','a. k. khan','এ কে খান'],outbound:['07:50','08:40','09:30'],return:['13:30','15:30','17:00']},
    {id:'bhatiary',name:'Bhatiary',bn:'ভাটিয়ারী',aliases:['bhatiary','bhatiari','ভাটিয়ারী'],outbound:['08:05','08:55','09:45'],return:['13:30','15:30','17:00']}
  ];
  const bus={id:'bus-v1',kind:'bus',target:'campus',version:1,effective:'2026-01-01',source:'Assignment sample',stops};
  const teachers=[
    {name:'Prof. Md. Monirul Islam',bn:'প্রফেসর মো. মনিরুল ইসলাম',department:'CSE',phone:'01711701719',email:'monir@iiuc.ac.bd'},
    {name:'Mohammed Safiullah',bn:'মোহাম্মদ সাফিউল্লাহ',department:'CSE',phone:'01711304565',email:'safiullah@iiuc.ac.bd'},
    {name:'Abdullahil Kafi',bn:'আব্দুল্লাহিল কাফি',department:'CSE',phone:'01720155585',email:'abkafi@iiuc.ac.bd'}
  ];
  const clone=v=>JSON.parse(JSON.stringify(v));
  const identifyRoll=roll=>groups.find(g=>String(roll).toUpperCase().replace(/\s/g,'').startsWith(g.prefix))||null;
  function activeVersion(versions,kind,target,date){
    return versions.filter(v=>v.kind===kind&&v.target===target&&v.effective<=date).sort((a,b)=>b.effective.localeCompare(a.effective)||b.version-a.version)[0]||null;
  }
  function matchStops(stops,query){const q=query.trim().toLowerCase();return q?stops.filter(s=>[s.name,s.bn,...s.aliases].some(n=>n.toLowerCase().includes(q))):stops;}
  function minutes(time){const [h,m]=time.split(':').map(Number);return h*60+m;}
  function validateRoutine(days){
    const validTime=t=>/^([01]\d|2[0-3]):[0-5]\d$/.test(t);
    for(const rows of Object.values(days)){
      const sorted=[...rows].sort((a,b)=>a.start.localeCompare(b.start));
      for(let i=0;i<sorted.length;i++){
        const r=sorted[i];
        if(!r.room.trim())return 'room';
        if(!validTime(r.start)||!validTime(r.end)||minutes(r.start)>=minutes(r.end))return 'time';
        if(i&&minutes(sorted[i-1].end)>minutes(r.start))return 'overlap';
      }
    }
    return null;
  }
  const api={groups,routines,bus,teachers,subjects,clone,identifyRoll,activeVersion,matchStops,validateRoutine,minutes};
  if(typeof module!=='undefined')module.exports=api;else root.HUB_DATA=api;
})(typeof window!=='undefined'?window:globalThis);
