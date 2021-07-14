import { Drawer, Icon, InputGroup, Input, Divider, Dropdown, Loader, Whisper, Tooltip, } from 'rsuite';
import React, { Component } from 'react';
import x_icon from '../images/x_icon.svg'
import back_icon from '../images/icons/arrows/right_arrow.svg'
import { Containers } from './containers';
import { AlertNotifications } from './notifications';
import './../components/drawer.css';
import { Dictionary, getRTL, getLeftRight } from '../Dictionary';
import { category_names, category_symbols, category_colors } from './notifications_data';
import { AddItem } from '../pages/orders page/orders_page';
import { InventoryTile } from '../pages/home page/home_page';
import Chart from 'chart.js'
import { base_url } from '../index';
import $ from 'jquery';
import info_symbol from '../images/icons/info_symbol.svg'
import { data_dict, getUnitById } from './data_dictionary';
import { getDate } from './containers'
import { get_date, get_time, set_offset, get_hours, get_table_key } from './time_manager';
import moment from 'moment';



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
      if (item_name.includes(e)) {
        newDict[key] = dict[key]
      }
    })
    var page = []
    page.push(<SearchBar key={"search_bar1"} handleChange={this.handleChange} cat_id={this.props.cat_id} weights_dict={this.props.weights_dict} />)
    page.push(<Containers key={"containers1"} weights_dict={newDict} openItem={this.switchContent} />)
    this.setState({ page });

  }
  switchContent(item_id) {
    let page = [],
      cat_image = [],
      cat_id = this.props.cat_id
    if (item_id) {
      cat_image = <div onClick={() => this.switchContent()}><img id="back_arrow" src={back_icon} alt="back" /></div>

      if (this.props.weights_dict) {
        page = <ItemPage key={"item_page"} business_id={1} item_id={item_id} notification_level={this.props.weights_dict[item_id]["notification_level"]} weight_info={this.props.weights_dict[item_id]} />
      }

      else
        console.log("No weights dict, can't render item")
    }
    else {
      page.push(<SearchBar key={"search_bar2"} handleChange={this.handleChange} cat_id={this.props.cat_id} weights_dict={this.props.weights_dict} />)
      page.push(<Containers key={"containers2"} weights_dict={this.props.weights_dict} openItem={this.switchContent} />)
      cat_image = <img src={category_symbols[cat_id]} alt={category_names[cat_id]} />
    }
    this.setState({ page, cat_image })


  }



  render() {

    const { size, placement, show } = this.state,
      cat_id = this.props.cat_id


    // invnetory page - supplier case
    let color = this.props.cat_name ? "gray" : category_colors[cat_id]

    let st = "5px solid " + String(color);
    let title = <div className="notification_toggler" style={{ color: color, width: 'fit-content' }} >{this.state.cat_name}</div>
    let clas = this.props.order_drawer ? "add_item_container" : "category_drawer_container"

    let see_full_inventory
    if (!this.props.order_drawer && !this.props.tile) //inventory page 
      see_full_inventory = <div className="inventory_clicker url_like" onClick={() => this.toggleDrawer(true)}>{Dictionary["see_full"]}</div>

    else if (this.props.order_drawer && !this.props.tile) //order page
      see_full_inventory = <AddItem key={"add_item"} func={this.toggleDrawer} />

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
          key={"drawer_cat"}
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
          <InputGroup.Button style={{top:"10px"}}>
            <Icon icon="search" />
          </InputGroup.Button>
          <Input onChange={e => this.props.handleChange(e, this.props.weights_dict)}  
            style={{ direction: lang, textAlign: text_align, margin: "10px", boxShadow: "0px 0px 6pt 0px " + category_colors[this.props.cat_id], borderRadius: "5px" }} placeholder={Dictionary["serach_placeholder"] + "?"} />          
        </InputGroup>
      </div>
    );
  }
}
export class ItemPage extends Component {
  /* shows all of the information about an item and its statistics*/
  constructor(props) {
    super(props);
    this.devide_data = this.devide_data.bind(this);
    this.diluteKeys = this.diluteKeys.bind(this);
    this.get_daily_update = this.get_daily_update.bind(this);
    this.get_weekly_update = this.get_weekly_update.bind(this);
    this.get_monthly_update = this.get_monthly_update.bind(this);
    this.get_average_statistics_by_day = this.get_average_statistics_by_day.bind(this);
    this.state = {
      page: "",
      dropdown_content: "",
      active_index: 0,
      dates_to_pull: [30, 7, 1],
      diluteing_metohds: [this.get_monthly_update, this.get_weekly_update, this.get_daily_update]

    }

  }

  componentDidMount() {
    var request = base_url + '/get/item/history';
    var business_id = this.props.business_id,
      item_id = this.props.item_id,
      min_date = get_old_date(new Date(), 30)
    min_date = min_date.getTime() / 1000;

    if (!business_id)
      console.log("No business id enterd. nothing happend")
    else if (!item_id)
      console.log("No item id enterd. nothing happend")
    else {
      request += "?business_id=" + business_id + "&item_id=" + item_id + "&min_date=" + min_date
      var thisS = this
      $.ajax({
        url: request,
        success: function (res) {
          thisS.devide_data(res)
  
        },
        error: function (err) {
          console.log(err)
        }
      });
    }
  }
  componentWillUnmount(){
    window.location.hash = '';
  }

  devide_data(res) {
    /*devide the data to diffarent dates and add a dropdown item stating the category*/
    var date_dict = {}
    if (typeof res === 'object' && res !== null) {
      res.forEach(obj => {
        if (obj["date"]) {
          var d = set_offset(obj["date"])
          if (d !== undefined) {
            obj["date"] = d;
            var date = get_date(d),
              time = get_time(d);
            if (!(date in date_dict))
              date_dict[date] = {}
            date_dict[date][time] = obj;
          }
        }
      })
    }
    var page = [], dates_to_pull = this.state.dates_to_pull, dropdown_content = [], i = 0;
    dates_to_pull.forEach(days => {
      var j = i++;
      dropdown_content.push(<Dropdown.Item key={"drop_item" + days} eventKey={days} onSelect={() => { this.setState({ active_index: j }) }}>{Dictionary[days]}</Dropdown.Item>)
    })
    this.setState({ page, dropdown_content, date_dict });
  }


  /* gets a result dict and returns a daily view of the weights.
 the daily veiw is a dict with one sample from each hour in the last day 
 (the day is considering 00:00 of the previous day) */
  get_daily_update(res) {
    var today = moment(), timeRes = {}, dateRes = {}, result = {}, todayTimes = {}, num_of_hours_today = Number.parseInt(get_hours(moment()))
    if (res && res[get_date(today)] !== undefined) {
      let todays = res[get_date(today)];
      let temp = {}
      if (todays) {
        Object.keys(todays).sort().forEach(key => {
          temp[key] = todays[key];
        });
        todayTimes = this.diluteKeys(temp, num_of_hours_today, 1);
      }
    }
    var _24hr = moment().subtract(1, 'days'),
      yesterdate = get_date(_24hr),
      timeNow = get_time(_24hr);

    if (yesterdate in res) {
      var yesterday = res[yesterdate]
      Object.keys(yesterday).sort().forEach(key => {
        if (key > timeNow)
          dateRes[key] = yesterday[key];
        else
          timeRes[key] = yesterday[key];
      })
    }
    var DateD = this.diluteKeys(timeRes, 24 - num_of_hours_today, 1);
    var timesD = this.diluteKeys(dateRes, num_of_hours_today, 1);
    result = Object.assign({}, DateD, timesD, todayTimes);
    return result;
  }

  /* gets a result dict and returns a weekly view of the weights.
  the weekly veiw is a dict with 2-3 (depending on the spred of the weights) 
  samples from each day in the past week*/
  get_weekly_update(res) {
    var result = {};
    if (res && typeof (res) == 'object') {
      var keys = Object.keys(res).sort();
      if (keys.length < 1)
        return result;
      for (let i = 6; i >= 0; i--) {
        let testDate = moment().subtract(i, 'days')
        var obj = res[get_date(testDate)]
        if (obj !== undefined) {
          let times = {}
          Object.keys(obj).sort().forEach(key => { times[key] = obj[key] })
          var diluted = this.diluteKeys(times, 3, 2)
          result = Object.assign({}, result, diluted);
        }

      }
    }
    return result;
  }
  /* gets a result dict and returns a monthly view of the weights.
 the monthly veiw is a dict with one sample from each day and 2-3
 (depending on the spred of the weights) samples of the last day */
  get_monthly_update(res) {
    var result = {};
    if (res && typeof (res) == 'object') {
      var keys = Object.keys(res).sort();
      if (keys.length < 1)
        return result;
      for (let i = 29; i >= 0; i--) {
        let testDate = moment().subtract(i, 'days')
        var obj = res[get_date(testDate)]
        if (obj !== undefined) {
          let times = {}
          Object.keys(obj).sort().forEach(key => { times[key] = obj[key] })
          var diluted = i !== 0 ? this.diluteKeys(times, 1, 3) : this.diluteKeys(times, 3, 2)//last day will have 3 keys
          result = Object.assign({}, result, diluted);
        }

      }
    }
    return result;
  }

  get_average_statistics_by_day(res, days) {
    var result = {
      "minimum": 0,
      "maximum": 0,
      "usage": 0,
      "stock": 0
    };
    var mini = [], maxi = [], minus = [], plus = []
    if (res && typeof (res) == 'object') {
      var keys = Object.keys(res).sort();
      if (keys.length < 1)
        return result;
      let prev_weight = undefined;
      for (let i = days; i >= 0; i--) {
        let testDate = moment().subtract(i, 'days'),
          day_plus = 0, day_minus = 0, local_mini = Number.MAX_VALUE, local_maxi = -Number.MAX_VALUE,
          obj = res[get_date(testDate)]
        if (obj !== undefined) {
          Object.keys(obj).sort().forEach(key => {
            let weight_info = obj[key],
              new_weight = weight_info["weight"]
            if (new_weight !== undefined) {
              if (prev_weight !== undefined) {
                let diffarence = new_weight - prev_weight
                if (diffarence < 0)
                  day_minus -= diffarence;
                else
                  day_plus += diffarence;
              }
              if (new_weight > local_maxi)
                local_maxi = new_weight
              if (new_weight < local_mini)
                local_mini = new_weight
              prev_weight = new_weight;
            }




          });

          plus.push(day_plus)
          minus.push(day_minus)
          if (local_mini < Number.MAX_VALUE)
            mini.push(local_mini)
          else
            mini.push(0)
          if (local_maxi > -Number.MAX_VALUE)
            maxi.push(local_maxi)
          else
            maxi.push(0)
        }

      }
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      var result = {
        "minimum": (mini.reduce(reducer,0)/mini.length).toFixed(1).replace(/\.0+$/, ''),
        "maximum": (maxi.reduce(reducer,0)/maxi.length).toFixed(1).replace(/\.0+$/, ''),
        "usage": (minus.reduce(reducer,0)/minus.length).toFixed(1).replace(/\.0+$/, ''),
        "stock": (plus.reduce(reducer,0)/plus.length).toFixed(1).replace(/\.0+$/, '')
      };

    }
    return result;
  }
  /*dilute the keys enterd up to num_of_keys */
  diluteKeys(res, num_of_keys, code) {
    if (!res || typeof (res) !== 'object')
      return res;
    var keys = Object.keys(res), result = {};
    if (keys.length <= 0)
      return result;
    //if there are not the minimal amount of keys expected return all
    if (keys.length < num_of_keys) {
      Object.keys(res).forEach(key => {
        var current_val = res[key],
          dateTimeKey = get_table_key(current_val['date']);
        if (dateTimeKey)
          result[dateTimeKey] = current_val["weight"]
      });
      return result;
    }

    var lastKey = keys[keys.length - 1]
    switch (code) {
      case 1:// first weying every hour
      default:
        var minHour = -1
        keys.forEach(key => {
          let val = res[key]
          let thisHour = get_hours(val["date"]);
          if (thisHour !== minHour || key === lastKey) {
            let k = get_table_key(val['date']);
            result[k] = val["weight"];
          }
          minHour = thisHour
        })
        break;
      case 2: // in a case of weekly weigts. this case is called per day
        var foundSecond = false, foundThird = false;
        var key = keys.shift()
        let val = res[key],
          date = moment(val["date"]);
        if (date !== undefined)
          result[get_table_key(date)] = val['weight'];

        //get two samples from this day one in morning and one in afternoon
        for (let i = 0; i < keys.length; i++) {
          let val = res[keys[i]], date = moment(val["date"]);
          if (date) {
            let eightAM = moment(val["date"]).set('hour', 8).valueOf(),
              fourPM = moment(val["date"]).set('hour', 16).valueOf(),
              this_date = date.valueOf();
            if (!foundSecond) {
              if (this_date >= eightAM) {
                result[get_table_key(date)] = val['weight'];
                foundSecond = true;
              }
            }
            else {
              if (this_date >= fourPM) {
                result[get_table_key(date)] = val['weight'];
                foundThird = true;
                break;
              }
            }
          }
        }
        if (!foundThird) {
          let val = res[lastKey], date = moment(val["date"]);
          if (date)
            result[get_table_key(date)] = val['weight'];
        }
        break;

      case 3: // in a case of monthly weigts. this case is called per day
        let found = false;
        for (let i = 0; i < keys.length; i++) {
          let val = res[keys[i]], date = moment(val["date"]);
          if (date) {
            let eightAM = moment(val["date"]).set('hour', 8).valueOf(),
              this_date = date.valueOf();
            if (this_date >= eightAM) {
              result[get_table_key(date)] = val['weight'];
              found = true;
              break;
            }
          }
        }

        if (!found) {
          let val = res[lastKey], date = moment(val["date"]);
          if (date)
            result[get_table_key(date)] = val['weight'];
        }
        break;

    }
    return result;
  }

  render() {
    let active_index = this.state.active_index, disabled = false,
      active_chart = this.state.dates_to_pull[active_index], chart,
      diluteing_metohd = this.state.diluteing_metohds[active_index],
      res = this.state.date_dict,
      reach = this.get_average_statistics_by_day(res, active_chart), 
      cubes="";
    if (res) {
      if (res.length === 0) {
        chart = <div className="emptyChart">{Dictionary["no_data"]}</div>
        disabled = true
      }
      else {
        var relavent_data = diluteing_metohd(res)
        chart = <ChartComponent {...this.props} key={active_chart} num_of_days={active_chart} dict={relavent_data} />
        cubes =[<InfoCube key={"cube" + 1} header={"Average usage"} info={reach["usage"]} dict={relavent_data} />,
        <InfoCube key={"cube" + 2} header={"Lowest average"} info={reach["minimum"]} dict={relavent_data} />,
        <InfoCube key={"cube" + 3} header={"Highest average"} info={reach["maximum"]} dict={relavent_data} />]
        
      }

    }
    else
      chart = <Loader speed="fast" size="xs" content="Loading..." vertical />
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
        <div className={"item_info_title"} >{this.props.weight_info["item_name"]}</div>
        <AlertNotifications keep_open={true} notifications_level={notifications_level} notification_info={notification_info} />
        <ItemDeatils business_id={this.props.business_id} item_id={this.props.item_id} dict={this.props.weight_info} />
        <div className="chart_container">
          <h4>{Dictionary["item_weight"]}</h4>
          <div className="chart_header">
            <Dropdown disabled={disabled} title={Dictionary[active_chart]} activeKey={active_chart}>
              {this.state.dropdown_content}
            </Dropdown>
          </div>
          <div className="chart_body">
            {chart}
          </div>
        </div>
        <div className="cube_container" id="cube_container">
          {cubes}
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
      chart_id: "food_chart" + this.props.item_id + "chart" + props.num_of_days,
      chart: null,
      render_the_chart:true
    };
    this.render_chart = this.render_chart.bind(this);

  }
  componentDidMount() {
    var props = this.props,
      dict = props.dict,
      weights = [], date_time = [],
      point_colors = [], point_radius = []

    if (dict && Object.keys(dict).length > 0) {
      Object.keys(dict).forEach(key => {
        var weight = dict[key]
        if (weight !== undefined) {
          weights.push(weight);
          point_colors.push("rgba(253, 94, 83, 0)")
          point_radius.push(1)
          date_time.push(key);
        }
      });
      // console.log(weights)
      // console.log(date_time)
      var weight_info = this.props.weight_info,
        setName = weight_info ? weight_info["item_name"] : Dictionary["unknown"]

      this.render_chart([[setName, weights]], date_time, this.state.chart_id, point_colors, point_radius)
    }
    else {
      //insert no data to show for this time period 
      this.setState({ render_the_chart:false})
    }
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
    // console.log(sets)
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
    if(this.state.render_the_chart)
    return <canvas className="usage_chart" id={this.state.chart_id} />
    else
    return (

      <div className="emptyChart" > 
        {Dictionary["no_data"]}
      </div>

    );
  }
}

export function download(content, fileName = "file.json", contentType = 'text/plain') {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export class InfoCube extends Component {

  constructor(props) {
    super(props);
    this.state = {
      weights: []
    };

  }

  render() {

    var page = [], info =this.props.info==="NaN"?0:this.props.info
    if (this.props.additional_data) {
      page.push(<Divider key={"divider"} />)
      page.push(<div> {this.props.additional_data} </div>)
    }


    return (

      <div className="info_cube">
        <div className={"cube_header"}>{this.props.header}</div>
        <div className={"cube_number"}>{info}</div>
        {page}
      </div>
    );
  }
}


function get_old_date(date, num_of_days) {
  /*get a date and return 00:00 in unix time number of days ago*/
  if (typeof (date) === Date)
    date = new Date(date)
  if (!date)
    return date
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - num_of_days);
  return date
}

class ItemDeatils extends Component {

  constructor(props) {
    super(props);

    this.state = {
      item_id: this.props.item_id ? this.props.item_id : null,
      business_id: this.props.business_id ? this.props.business_id : 1,
      str: "",
      container_details: []
    }

    this.getItemContainers = this.getItemContainers.bind(this)

  }

  componentDidMount() {
    let request = base_url + "/get/containers" + "?business_id=" + this.state.business_id + "&item_id=" + this.state.item_id + "&only_active_containers=true"
    var thisS = this
    $.ajax({
      url: request,
      success: function (res) {
        thisS.getItemContainers(res)
      },
      error: function (err) {
        console.log(err)
      }
    });



  }

  // get all containers of the item
  getItemContainers(data) {
    let str = "", cont_details = []
    for (let i = 0; i < data.length; i++) {
      let container = data[i]
      str += i === data.length - 1 ? container["container_id"] : container["container_id"] + ","
      cont_details.push(
        <div>
          <span className={"bold_text"} >{container["container_id"]}</span>
          {": "} {container["weight"]} {getUnitById(container["weight"])} {" "}{getDate(container["date"])}
        </div>)
    }
    this.setState({
      str: str,
      container_details: cont_details
    })
  }


  render() {
    let dict = this.props.dict, minimum = Dictionary["unset"], maximum = Dictionary["unset"]

    if (dict && dict["item_extended_details"]) {
      let details = dict["item_extended_details"];
      if (details["content_total_minimum"])
        minimum = details["content_total_minimum"] + " " + Dictionary["kg"]
      if (details["content_total_maximum"])
        maximum = details["content_total_maximum"] + " " + Dictionary["kg"]
    }

    let min_max_style = {
      fontWeight: "bold"
    }

    let divider_style = {
      height: "unset",
      width: "3px"
    }

    return (
      <div className="item_details">

        <ContainerInformationTip key={this.state.item_id} container_details={this.state.container_details} str={this.state.str} />

        <Divider key={"divider1"} style={divider_style} vertical={true} />
        <div className="item_min_max">
          <div style={min_max_style}>{minimum}</div>
          <div>{Dictionary["min"]}</div>
        </div>
        <Divider key={"divider2"} style={divider_style} vertical={true} />
        <div className="item_min_max">
          <div style={min_max_style}>{maximum}</div>
          <div>{Dictionary["max"]}</div>
        </div>
      </div>
    )
  }

}

const ContainerInformationTip = (props) => {


  return (
    <Whisper
      trigger="click"
      placement={'top'}
      speaker={
        <Tooltip>
          {props.container_details}
        </Tooltip>
      }
    >
      <div>Containers ID:{" "}
        <img src={info_symbol} alt="info" />
        <div>{props.str}</div>
      </div>
    </Whisper>
  )
}
