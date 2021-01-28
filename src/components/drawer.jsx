import { Drawer, ButtonToolbar, IconButton, Icon } from 'rsuite';
import React, { Component } from 'react';

import { Containers } from './containers';
export class CategoryDrawer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        size: 'md',
        placemnt: 'bottom',
        show: false,
        data:props.data
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
          <a className="inventory_clicker" onClick={() => this.toggleDrawer()}>see full inventory</a>
        
          <Drawer
            size={size}
            placement={placement}
            show={show}
            onHide={this.close}
            backdrop = {true}
          >
            <Drawer.Body>
            <Containers data = {this.state.data}/>
            </Drawer.Body>
            
          </Drawer>
        </div>
      );
    }
  }
  
  