import { Drawer, Icon, InputGroup, Input } from 'rsuite';
import React, { Component } from 'react';

import { Containers } from './containers';
// import { Dictionary } from '../Dictionary';
import './../components/drawer.css';
import { Dictionary } from '../Dictionary';

export class CategoryDrawer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        size: 'md',
        placemnt: 'bottom',
        show: false,
        weights_dict:props.weights_dict
      };
      this.close = this.close.bind(this);
      this.toggleDrawer = this.toggleDrawer.bind(this);
      this.handleChangeSize = this.handleChangeSize.bind(this);
      
    }
    componentDidMount(){
      
    }
    close() {
      this.setState({
        show: false
      });
    }
    toggleDrawer() {
      
      this.setState({
          placement:'bottom',
        show: true
      });
    }
    handleChangeSize(size) {
      this.setState({ size });
    }
    render() {
      const { size, placement, show } = this.state;
      
      return (
        <div className="category_drawer_container">
          <a  className="inventory_clicker" onClick={() => this.toggleDrawer()}>see full inventory</a>
        
          <Drawer
            size={size}
            placement={placement}
            show={show}
            onHide={this.close}
            backdrop = {true}
          >
             <Drawer.Header>
              <Drawer.Title style={{color:"#6FB91C", textAlign:"center"}}>Vegtables</Drawer.Title>
              <div id="drawer_title_border"></div>
            </Drawer.Header>
            <Drawer.Body>
            <SearchBar />
            <Containers weights_dict = {this.state.weights_dict}/>
            </Drawer.Body>
            
          </Drawer>
        </div>
      );
    }
  }


  export class SearchBar extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
         
        };
    
      }
    
    render(){

      let lang = Dictionary.getLanguage()
      let dir
      if(lang === "HE")
        dir = "right"
      else
        dir = "left"

    return(
        <div className="search">
        <InputGroup inside >
            <Input style={{textAlign:dir}} placeholder={Dictionary["serach_placeholder"]} />
            <InputGroup.Button>
            <Icon icon="search" />
            </InputGroup.Button>
        </InputGroup>
    
        </div>
    )

    }
     
  }
  
  