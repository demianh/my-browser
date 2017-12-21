import {CssParser} from '../../../../js/CssParser'

describe('Simple Rules', () => {
  var parser = new CssParser()

  it('should render correct contents', () => {
    var nodes = parser.parse('h1 {}')
    expect(JSON.stringify(nodes)).to.be('[{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[]}]')
  })
})
