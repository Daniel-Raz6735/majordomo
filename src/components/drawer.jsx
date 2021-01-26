import { Drawer, Button, Radio, ButtonToolbar, RadioGroup, IconButton, Icon } from 'rsuite';
import React, { Component } from 'react';
import Paragraph from 'antd/lib/skeleton/Paragraph';
import ReactDOM from 'react-dom';
import 'rsuite/dist/styles/rsuite-default.css'

export class CategoryDrawer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        size: 'md',
        placemnt: 'bottom',
        show: false
      };
      this.close = this.close.bind(this);
      this.toggleDrawer = this.toggleDrawer.bind(this);
      this.handleChangeSize = this.handleChangeSize.bind(this);
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
              Bottom
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
                blalalalalal
            </Drawer.Body>
            
          </Drawer>
        </div>
      );
    }
  }
  
  