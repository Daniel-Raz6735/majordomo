import { Drawer, Icon, InputGroup, Input } from 'rsuite';
import React from 'react';
import x_icon from '../images/x_icon.svg'
import { Containers } from './containers';
import './../components/drawer.css';
import { Dictionary, getRTL, getLeftRight } from '../Dictionary';
import { category_names, category_symbols, category_colors } from './notifications_data';



export class CategoryDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'md',
      placemnt: 'bottom',
      show: false,
      weights_dict: props.weights_dict,
      cat_id: props.cat_id,
      page: <Containers weights_dict={this.props.weights_dict} />
    };
    this.close = this.close.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleChangeSize = this.handleChangeSize.bind(this);
    this.handleChange = this.handleChange.bind(this);

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

  handleChange(e, dict) {
    let newDict = {}
    e = (e).toLowerCase();


    Object.keys(dict).forEach(key => {
      let item_name = (dict[key]["item_name"]).toLowerCase();
      if (item_name.startsWith(e)) {
        newDict[key] = dict[key]
      }
    })

    this.setState({ page: <Containers weights_dict={newDict} /> });

  }

  render() {
    const { size, placement, show } = this.state,
      cat_id = this.props.cat_id,
      st = "5px solid " + String(category_colors[cat_id]);
    let title = <div className="notification_toggler" style={{ color: category_colors[cat_id], width: 'fit-content' }} >{category_names[cat_id]}</div>


    return (
      <div className="category_drawer_container notification_toggler">
        {title}
        <div className="inventory_clicker url_like" onClick={() => this.toggleDrawer()}>{Dictionary["see_full"]}</div>


        <Drawer
          size={size}
          placement={placement}
          show={show}
          onHide={this.close}
          backdrop={true}
        >
          <div className="drawer_header">
            <div className="sub_drawer_header">
              <img className="close_btn_div" src={x_icon} onClick={this.close} alt="X" />
              <div className="drawer_title h4" style={{ color: category_colors[cat_id] }} >{category_names[cat_id]}</div>
              <div className="cat_drawer_symbol">
                <img src={category_symbols[cat_id]} alt={category_names[cat_id]} />
              </div>
            </div>
            <div className="drawer_title_border" style={{ borderBottom: st }} />
          </div>
          <Drawer.Body>
            <SearchBar handleChange={this.handleChange} cat_id={this.props.cat_id} weights_dict={this.props.weights_dict} />
            {this.state.page}
          </Drawer.Body>

        </Drawer>
      </div>
    );
  }
}



export class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      handleChange: props.handleChange,
      cat_id: props.cat_id,
      weights_dict: props.weights_dict
    };


  }


  render() {
    let lang = getRTL()
    let text_align = getLeftRight()

    return (

      <div className="search">
        <InputGroup inside >
          <Input onChange={e => this.props.handleChange(e, this.props.weights_dict)}
            style={{ direction: lang, textAlign: text_align, boxShadow: "0 0 6px" + category_colors[this.props.cat_id], borderRadius: "5px" }} placeholder={Dictionary["serach_placeholder"] + "?"} />
          <InputGroup.Button>
            <Icon icon="search" />
          </InputGroup.Button>
        </InputGroup>
      </div>
    );
  }
}