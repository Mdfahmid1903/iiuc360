const {test}=require('node:test');
const assert=require('node:assert/strict');
const D=require('../js/data.js');
test('roll mapping accepts known demo cohorts and rejects unknown students',()=>{
  assert.equal(D.identifyRoll('c221234').semester,5);
  assert.equal(D.identifyRoll('C231234').semester,3);
  assert.equal(D.identifyRoll('X999999'),null);
});
test('future schedules stay inactive until their effective date, and groups stay independent',()=>{
  const base=D.routines['cse-5-a'];
  const newer={...D.clone(base),id:'new',version:2,effective:'2026-11-01'};
  const values=[base,newer,D.routines['cse-3-a']];
  assert.equal(D.activeVersion(values,'routine','cse-5-a','2026-10-25').id,base.id);
  assert.equal(D.activeVersion(values,'routine','cse-5-a','2026-11-01').id,'new');
  assert.equal(D.activeVersion(values,'routine','cse-3-a','2026-11-01').version,1);
});
test('rollback can supersede a publication with the same effective date',()=>{
  const base=D.bus;
  assert.equal(D.activeVersion([base,{...base,id:'new',version:2,effective:'2026-10-25'},{...base,id:'restored',version:3,effective:'2026-10-25'}],'bus','campus','2026-10-25').id,'restored');
});
test('stop lookup supports Bangla and aliases without inventing unlisted stops',()=>{
  assert.equal(D.matchStops(D.bus.stops,'হালিশহর')[0].id,'halishahar');
  assert.equal(D.matchStops(D.bus.stops,'HALISHAHAR')[0].id,'halishahar');
  assert.equal(D.matchStops(D.bus.stops,'Dhaka').length,0);
});
test('routine publication rejects missing rooms, invalid intervals and overlapping classes',()=>{
  const days=D.clone(D.routines['cse-5-a'].days);
  assert.equal(D.validateRoutine(days),null);
  days[0][0].room=''; assert.equal(D.validateRoutine(days),'room');
  days[0][0].room='4201';days[0][0].end='07:00';assert.equal(D.validateRoutine(days),'time');
  days[0][0].end='12:00';assert.equal(D.validateRoutine(days),'overlap');
});
