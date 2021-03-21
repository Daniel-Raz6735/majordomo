import { Drawer, Icon, InputGroup, Input, Divider } from 'rsuite';
import React, { Component } from 'react';
import x_icon from '../images/x_icon.svg'
import back_icon from '../images/icons/arrows/right_arrow.svg'
import { Containers } from './containers';
import './../components/drawer.css';
import { Dictionary, getRTL, getLeftRight } from '../Dictionary';
import { category_names, category_symbols, category_colors } from './notifications_data';
import { AddItem } from '../pages/orders_page';
import { InventoryTile } from '../pages/home page/home_page';
import Chart from 'chart.js'
import { base_url } from '../index';
import $ from 'jquery';




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

  toggleDrawer(main_render) {
    if (main_render)
      this.switchContent(false);
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
    var page = []
    page.push(<SearchBar handleChange={this.handleChange} cat_id={this.props.cat_id} weights_dict={this.props.weights_dict} />)
    page.push(<Containers weights_dict={newDict} openItem={this.switchContent} />)
    this.setState({ page});

  }
  switchContent(item_id) {
    let page = [],
      cat_image = [],
      cat_id = this.props.cat_id
    if (item_id) {
      cat_image = <div onClick={() => this.switchContent()}><img src={back_icon} alt="back" /></div>
     
      if(this.props.weights_dict)
        page = <ItemInfo business_id={1} item_id={item_id} weight_info={this.props.weights_dict[item_id]}/>
      else
        console.log("No weights dict, can't render item")
    }
    else {
      page.push(<SearchBar handleChange={this.handleChange} cat_id={this.props.cat_id} weights_dict={this.props.weights_dict} />)
      page.push(<Containers weights_dict={this.props.weights_dict} openItem={this.switchContent} />)
      cat_image = <img src={category_symbols[cat_id]} alt={category_names[cat_id]} />
    }
    this.setState({ page, cat_image })


  }



  render() {

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
      see_full_inventory = <div className="inventory_clicker url_like" onClick={() => this.toggleDrawer(true)}>{Dictionary["see_full"]}</div>

    else if (this.props.order_drawer && !this.props.tile) //order page
      see_full_inventory = <AddItem func={this.toggleDrawer} />

    else { // home page
      title = ""
      color = category_colors[cat_id]
      st = "5px solid " + String(color)
      clas = "home_page_drawer"
      see_full_inventory = <InventoryTile key={this.props.cat_name + cat_id} name={this.props.cat_name} symbol={this.props.symbol} cat_color={category_colors[cat_id]} weights_dict={this.props.weights_dict} func={this.toggleDrawer} />
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
                {this.state.cat_image}
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
export class ItemInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chart_id:"food_chart" + this.props.item_id + "chart"
    };
    this.devide_data = this.devide_data.bind(this);

  }
  componentDidMount() {
    var request = base_url + '/get/item/history';
    var business_id = this.props.business_id,
      item_id = this.props.item_id,
      min_date = get_old_date(new Date(), 30)
      
    if (!business_id) {
      console.log("No business id enterd. nothing happend")
    }
    else if(!item_id){
      console.log("No item id enterd. nothing happend")
    } 
    else {
      request += "?business_id=" + business_id + "&item_id=" + item_id + "&min_date=" + min_date
      var callback = this.devide_data
      $.ajax({
        url: request,
        success: function (res) {
          callback(res)
        },
        error: function (err) {
          console.log(err)
        }
      });
    }
  }
  render_chart(prop_datasets,labels, id) {
    var weight_info= this.props.weight_info,
    setName = weight_info?weight_info["item_name"]:Dictionary["unknown"]
    

    console.log()

    var ctx = document.getElementById(id).getContext('2d');
    var sets = []
    if(prop_datasets){
        console.log(prop_datasets)
        prop_datasets.forEach(set=>{sets.push({label:setName,data:set[1]})})
    }
     new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets:sets,
            
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
    
}

  devide_data(res) {
    console.log(res)
    this.render_chart([["fruit", [12, 19, 3, 5, 2, 3]]],["12:20", '15:30', '17:30', '18:20', '19:30', '21:30'],this.state.chart_id)
  }

  render() {
    return (

      <div className="item_info">
        <canvas className="usage_chart" id={this.state.chart_id}/>
        <div className="cube_container">
          <InfoCube key={1} additional_data="skl" />
          <InfoCube key={2} additional_data="skl" />
          <InfoCube key={3} additional_data="skl" />
        </div>
        <div className="cube_container">
          <InfoCube key={4} additional_data="skl" />
          <InfoCube key={6} additional_data="skl" />
        </div>
        <div className="cube_container">
          <InfoCube key={5} additional_data="skl" />
          <InfoCube key={7} additional_data="skl" />
          <InfoCube key={8} additional_data="skl" />
        </div>
        <div className="cube_container">
          <InfoCube key={9} additional_data="skl" />
          <InfoCube key={10} additional_data="skl" />
        </div>
      </div>
    );
  }
}
export class InfoCube extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
    // this.close = this.close.bind(this);

  }

  // close(){

  // }

  render() {

    var page = []
    page.push(<div>header</div>)
    page.push(<div>23.5 kg</div>)

    if (this.props.additional_data) {
      page.push(<Divider />)
      page.push(<div> 12:15-12:20 </div>)
    }


    return (

      <div className="info_cube">
        {page}
      </div>
    );
  }
}
function get_old_date(date, num_of_days) {
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - num_of_days);
  return date.getTime() / 1000
}