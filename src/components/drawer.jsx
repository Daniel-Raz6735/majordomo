import { Drawer, ButtonToolbar, IconButton, Icon } from 'rsuite';
import React, { Component } from 'react';
import 'rsuite/dist/styles/rsuite-default.css'
import { Containers } from './containers';
export class CategoryDrawer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        size: 'sm',
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
        <div>
          <ButtonToolbar>
            <IconButton
              icon={<Icon icon="angle-up" />}
              onClick={() => this.toggleDrawer()}
            >
              Show items
            </IconButton>
          </ButtonToolbar>
  
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
  
  