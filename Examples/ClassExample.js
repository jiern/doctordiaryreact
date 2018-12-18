import React, {Component} from 'react';
import ComponentExample from './ComponentExample';

class ClassExample extends Component{

  render(){


    return(
      <div className="wrapper">
        <p>Hello, I am a class! And under is a component inside this class!</p>
        <ComponentExample/>
      </div>
    );
  }

}

export default ClassExample;
