import { Drawer, Icon, InputGroup, Input } from 'rsuite';
import React, { Component } from 'react';

import { Containers } from './containers';
import './../components/drawer.css';
import { Dictionary } from '../Dictionary';
import { category_names, category_symbols, category_colors } from './notifications_data';

export class CategoryDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'md',
      placemnt: 'bottom',
      show: false,
      weights_dict: props.weights_dict,
      page: <Containers weights_dict={this.props.weights_dict} />
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
      placement: 'bottom',
      show: true
    });
  }

  handleChangeSize(size) {
    this.setState({ size });
  }

  render() {
    const { size, placement, show } = this.state,
      cat_id = this.props.cat_id,
      st = "5px solid " + String(category_colors[cat_id]);

    return (
      <div className="category_drawer_container">
        <div className="inventory_clicker url_like" onClick={() => this.toggleDrawer()}>see full inventory</div>

        <Drawer
          size={size}
          placement={placement}
          show={show}
          onHide={this.close}
          backdrop={true}
        >
          <div className="drawer_header">
            <div className="sub_drawer_header">
              <button className="close_btn_div" onClick={this.close}>X</button>
              <div className="drawer_title h4" style={{ color: category_colors[cat_id] }} >{category_names[cat_id]}</div>
              <div className="cat_drawer_symbol">
                <img src={category_symbols[cat_id]} alt={category_names[cat_id]} ></img>
              </div>
            </div>
            <div className="drawer_title_border" style={{ borderBottom: st }} />
          </div>
          <Drawer.Body>
            <SearchBar />
            {this.state.page}
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

  render() {

    let lang = Dictionary.getLanguage()
    let dir
    if (lang === "HE")
      dir = "right"
    else
      dir = "left"

    return (
      <div className="search">
        <InputGroup inside >
          <Input style={{ textAlign: dir }} placeholder={Dictionary["serach_placeholder"]} />
          <InputGroup.Button>
            <Icon icon="search" />
          </InputGroup.Button>
        </InputGroup>

      </div>
    )

  }

}

