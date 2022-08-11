import * as datatype from './datatype.js';

export function test_module(){
  console.log('import: ', datatype.TTypedNode);
  var test = new datatype.TtnObject({
    Name: new datatype.TtnString('TestName'),
    Data: new datatype.TtnObject({
      Part1: new datatype.TtnString('TestData1'),
      Part2: new datatype.TtnString('TestData2')
    }),
    List: new datatype.TtnArray([
      new datatype.TtnString('TestListItem1'),
      new datatype.TtnString('TestListItem2'),
      new datatype.TtnString('TestListItem3')
    ])
  });
  let n = test.getSub('Data.Part2');
  console.log(n);
  n.addEventListener('test',(e) => {console.log('Listener: ',e)})
  n.dispatchEvent(new CustomEvent('test',{detail: {src: n}}));
  console.log(test);
  var s = test.toJson();
  test = datatype.TTypedNode.fromJSON(s);
  console.log('test: ',s, '=>', test);
}

test_module();