import { Drawer, Icon, InputGroup, Input, Divider, Dropdown, } from 'rsuite';
import React, { Component } from 'react';
import x_icon from '../images/x_icon.svg'
import back_icon from '../images/icons/arrows/right_arrow.svg'
import { Containers } from './containers';
import { AlertNotifications } from './notifications';
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
    this.setState({ page });

  }
  switchContent(item_id) {
    let page = [],
      cat_image = [],
      cat_id = this.props.cat_id
    if (item_id) {
      cat_image = <div onClick={() => this.switchContent()}><img src={back_icon} alt="back" /></div>

      if (this.props.weights_dict)
        page = <ItemPage business_id={1} item_id={item_id} notification_level={this.props.weights_dict[item_id]["notification_level"]} weight_info={this.props.weights_dict[item_id]} />

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
export class ItemPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page: "",
      dropdown_content: "",
      active_index: 0,
      dates_to_pull: [30, 7, 1]

    }
    this.devide_data = this.devide_data.bind(this);
    this.get_relavent_data = this.get_relavent_data.bind(this);

  }

  componentDidMount() {
    var request = base_url + '/get/item/history';
    var business_id = this.props.business_id,
      item_id = this.props.item_id,
      min_date = get_old_date(new Date(), 30)

    if (!business_id) {
      console.log("No business id enterd. nothing happend")
    }
    else if (!item_id) {
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
  devide_data(res) {
    var page = [], dates_to_pull = this.state.dates_to_pull, dropdown_content = [], i = 0;
    dates_to_pull.forEach(days => {
      var j = i++;
      dropdown_content.push(<Dropdown.Item eventKey={days} onSelect={() => { this.setState({ active_index: j }) }}>{Dictionary[days]}</Dropdown.Item>)
    })
    this.setState({ page, dropdown_content, res });
  }
  get_relavent_data(res, days) {
    var min_date = get_old_date(new Date(), days),
      relavent_data = {}, sorted_data = {};
    min_date = new Date(min_date * 1000)

    if (res) {
      res.forEach(weighing => {
        var date = new Date(weighing["date"])
        if (date >= min_date) {
          relavent_data[date] = weighing;
        }
      })

      var keys = Object.keys(relavent_data).sort();
      keys.forEach(key => sorted_data[key] = relavent_data[key])
    }
    return sorted_data;
  }

  render() {
    let active_index = this.state.active_index,
      active_chart = this.state.dates_to_pull[active_index], chart,
      res = this.state.res;
    if (res) {
      var relavent_data = this.get_relavent_data(res, active_chart)
      chart = <ChartComponent {...this.props} key={active_chart} num_of_days={active_chart} dict={relavent_data} />
    }
    var notifications_level, notification_info
    if (this.props["item_id"] && this.props["business_id"] && this.props["weight_info"]) {
      notification_info = { ...this.props["weight_info"] }
      notification_info["item_id"] = this.props["item_id"]
      notification_info["business_id"] = this.props["business_id"]
      notifications_level = (this.props["notification_level"] === -1) ? "-1" : this.props["notification_level"]
      notification_info = { notification_info }
    }



    return (
      <div className="item_info">
        <h1 style={{ textAlign: "center" }}>{this.props.weight_info["item_name"]}</h1>
        <AlertNotifications notifications_level={notifications_level} notification_info={notification_info} />
        <ItemDeatils dict={this.props.weight_info} />
        <div className="chart_container">
          <h4>Usage</h4>
          <div className="chart_header">
            <Dropdown title={Dictionary[active_chart]} activeKey={active_chart}>
              {this.state.dropdown_content}
            </Dropdown>
          </div>
          {chart}
        </div>
        <div className="cube_container">
          <InfoCube key={1} additional_data="skl" dict={relavent_data} />
          <InfoCube key={2} additional_data="skl" dict={relavent_data} />
          <InfoCube key={3} additional_data="skl" dict={relavent_data} />
        </div>
        <div className="cube_container">
          <InfoCube key={4} additional_data="skl" dict={relavent_data} />
          <InfoCube key={6} additional_data="skl" dict={relavent_data} />
        </div>
      </div>
    );
  }
}


export class ChartComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      num_of_days: props.num_of_days,
      chart_id: "food_chart" + this.props.item_id + "chart" + props.num_of_days
    };
    this.devide_data = this.devide_data.bind(this);
    this.pharse_date = this.pharse_date.bind(this);
    this.render_chart = this.render_chart.bind(this);

  }
  componentDidMount() {
    var props = this.props,
      dict = props.dict,
      weights = [], date_time = [],
      point_colors = [], point_radius = []
    console.log(dict)
    if (dict && Object.keys(dict).length > 0) {
      Object.keys(dict).forEach(date => {
        var weight = dict[date]["weight"]
        if (weight !== undefined) {
          weights.push(weight);
          point_colors.push("rgba(253, 94, 83, 1)")
          point_radius.push(5)
          date_time.push(this.pharse_date(new Date(date)));
        }

      });
      var weight_info = this.props.weight_info,
        setName = weight_info ? weight_info["item_name"] : Dictionary["unknown"]
      console.log(Math.min.apply(null, weights))
      this.render_chart([[setName, weights]], date_time, this.state.chart_id, point_colors, point_radius)
    }
    else {
      //insert no data to show for theis time period 
    }
  }
  devide_data(res) {
    console.log(res)
    // if (res && res.length > 0)

    // else { }
  }
  pharse_date(date) {
    if (!date)
      return date
    var new_date = new Date(date),
      today = new Date(),
      unix_today = get_old_date(today, 1) * 1000,
      diffarence = unix_today - new_date.getTime(),//old day is a day before at 00:00
      res = "";
    if (diffarence <= 86400) {//if the wight is yesterday or today
      res += new_date.getHours() + ":" + new_date.getMinutes();
    }
    else {
      res += new_date.getDate() + "/" + new_date.getMonth();
      let year = new_date.getFullYear();
      if (today.getFullYear() !== year)
        res += "/" + year
    }
    return res;
  }


  render_chart(prop_datasets, labels, id, point_colors, point_radius) {
    var ctx = document.getElementById(id).getContext('2d');
    var sets = []
    if (prop_datasets) {
      prop_datasets.forEach(set => {
        sets.push({
          label: set[0],
          data: set[1], backgroundColor: ['transparent'], borderColor: ['rgba(253, 94, 83, 1)'],
          pointBackgroundColor: point_colors, pointRadius: point_radius
        })
      })
    }
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: sets,


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
    });

  }

  render() {

    return (

      <canvas className="usage_chart" id={this.state.chart_id} />

    );
  }
}

export class InfoCube extends Component {

  constructor(props) {
    super(props);
    this.state = {
      weights: []
    };
    // this.close = this.close.bind(this);

  }

  // close(){

  // }

  componentDidMount() {
    var weights = []
    if (this.props.dict) {
      Object.keys(this.props.dict).forEach(date => {
        var weight = this.props.dict[date]["weight"]
        if (weight !== undefined)
          weights.push(weight);
      })
    }
    this.setState({ weights })
  }


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
  date = new Date(date)
  if (!date)
    return date
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - num_of_days);
  return date.getTime() / 1000
}

const ItemDeatils = (props) => {

  let min_max_style = {
    fontWeight: "bold"
  }

  let divider_style = {
    height: "unset",
    width: "3px"
  }

  console.log(props.dict)


  return (
    <div className="item_details">
      <div>Containers</div>
      <Divider style={divider_style} vertical="true" />
      <div className="item_min_max"><div style={min_max_style}>2.5 kg</div><div>{Dictionary["min"]}</div></div>
      <Divider style={divider_style} vertical="true" />
      <div className="item_min_max"><div style={min_max_style}>10 kg</div><div>{Dictionary["max"]}</div></div>
    </div>
  )

}