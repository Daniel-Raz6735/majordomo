import { Drawer, Icon, InputGroup, Input } from 'rsuite';
import React from 'react';
import x_icon from '../images/x_icon.svg'
import { Containers } from './containers';
import './../components/drawer.css';
import { Dictionary, getRTL, getLeftRight } from '../Dictionary';
import { category_names, category_symbols, category_colors } from './notifications_data';
import { AddItem } from '../pages/orders_page';
import { InventoryTile } from '../pages/home page/home_page';



export class CategoryDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'lg',
      placemnt: 'bottom',
      show: false,
      weights_dict: props.weights_dict,
      cat_id: props.cat_id,
      cat_name: this.props.cat_name ? this.props.cat_name : category_names[props.cat_id],
      page: [],
      cat_image: []
    };
    this.close = this.close.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleChangeSize = this.handleChangeSize.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.switchContent = this.switchContent.bind(this);

  }

  componentDidMount() {
    // console.log(this.props.weights_dict["cat_name"])
    this.switchContent(this.props.item_id)
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

    this.setState({ page: <Containers weights_dict={newDict} openItem={this.switchContent} /> });

  }
  switchContent(item_id) {
    let page = [],
      cat_image = [],
      cat_id = this.props.cat_id
    if (item_id) {
      cat_image = <div onClick={() => this.switchContent()}>this is a back arrow</div>
      page = <div>here are fruit statistics</div>
    }
    else {
      page.push(<SearchBar handleChange={this.handleChange} cat_id={this.props.cat_id} weights_dict={this.props.weights_dict} />)
      page.push(<Containers weights_dict={this.props.weights_dict} openItem={this.switchContent} />)
      cat_image = <img src={category_symbols[cat_id]} alt={category_names[cat_id]} />
    }
    this.setState({ page, cat_image })


  }



  render() {
    console.log(this.props.weights_dict)
    const { size, placement, show } = this.state,
      cat_id = this.props.cat_id
     

    // invnetory page - supplier case
    let color = this.props.cat_name ? "gray" : category_colors[cat_id]
    let symbol = this.props.cat_name ? "" : this.state.cat_image

    let st = "5px solid " + String(color);
    let title = <div className="notification_toggler" style={{ color: color, width: 'fit-content' }} >{this.state.cat_name}</div>
    let clas = this.props.order_drawer ? "add_item_container" : "category_drawer_container"

    let see_full_inventory
    if (!this.props.order_drawer && !this.props.tile) //inventory page 
      see_full_inventory = <div className="inventory_clicker url_like" onClick={() => this.toggleDrawer()}>{Dictionary["see_full"]}</div>

    else if (this.props.order_drawer && !this.props.tile) //order page
      see_full_inventory = <AddItem func={this.toggleDrawer} />

    else { // home page
      title = ""
      clas = "home_page_drawer"

      see_full_inventory = <InventoryTile name={this.props.cat_name} symbol={this.props.symbol} cat_color={category_colors[cat_id]} weights_dict={this.props.weights_dict} func={this.toggleDrawer} />
    }


    return (
      <div className={clas + " notification_toggler"}>
        {title}
        {see_full_inventory}


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
              <div className="drawer_title h4" style={{ color: color }} >{this.state.cat_name}</div>
              <div className="cat_drawer_symbol">
                {/* {this.state.cat_image} */}
                {symbol}
              </div>
            </div>
            <div className="drawer_title_border" style={{ borderBottom: st }} />
          </div>
          <Drawer.Body>
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