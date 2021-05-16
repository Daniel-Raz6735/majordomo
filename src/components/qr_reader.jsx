import React, { Component } from 'react'
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import './qr_reader.css'
import { Button, ControlLabel, Form, FormGroup, Loader, Modal, SelectPicker } from 'rsuite'
import item_scan from '../images/icons/item_scan.svg'
import chain_icon from '../images/icons/chain_icon.svg'
import green_chain_icon from '../images/icons/green_chain_icon.svg'
import scan_icon from '../images/icons/scan_icon.svg';
import pairing_complete from '../images/icons/pairing_complete.svg';
import { Dictionary } from '../Dictionary';
import $ from 'jquery';
import { base_url } from '..';
import { scree_alert } from '../pages/inventory_page'
import { showNotification } from './bars';

export class Scanner extends Component {
    state = {
        stopStream: false
    }

    render() {
        if (this.props.scaned)
            return <div></div>
        if (this.props.switchState) {
            var message = "Container scaned, Please scan item"
            if (this.props.item)
                message = "Item scanned, Please scan container";
            return (<div>{message}</div>);
        }
        else
            return (
                <div id="cmarArea">
                    <BarcodeScannerComponent
                        stopStream={this.state.stopStream}
                        onUpdate={(err, result) => {
                            // console.log(err)
                            // console.log(result)
                            if (result) {
                                this.props.handleScan(result)
                                // this.setState({ stopStream: true })
                            }
                            // else
                            //     console.log(err)
                            // this.handleError(err);
                        }} />
                </div >
            )
    }
}

export class ModalDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            business_id: this.props.business_id ? this.props.business_id : 1,
            item_data: [],
            container_data: [],

        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleScan = this.handleScan.bind(this);
        this.change_active = this.change_active.bind(this);
        this.get_items = this.get_items.bind(this);
        this.get_containers = this.get_containers.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.found_id = this.found_id.bind(this);
        // this.found_item = this.found_item.bind(this);
        this.removeCamera = this.removeCamera.bind(this);
        this.testExistenceInDict = this.testExistenceInDict.bind(this);
        this.resetComp = this.resetComp.bind(this);

    }

    componentDidMount() {
        this.resetComp()
        let dict
        if (this.props.dict["weights"] && this.props.dict["weights"]["category"])
            dict = this.props.dict["weights"]["category"]

        if (dict)
            this.get_items(dict)

        let request = base_url + "/get/containers" + "?business_id=" + this.state.business_id + "&only_active_containers=true"
        var callback = this.get_containers
        $.ajax({
            url: request,
            success: function (res) {
                callback(res)
                // console.log(res)

            },
            error: function (err) {
                console.log(err)
            }
        });

    }

    resetComp() {
        this.setState({
            show: false,
            switchState: false, // set transition for camera model
            item_name: Dictionary["unknown"],
            container_id: Dictionary["unknown"],
            is_item: false,
            scaned: false,
            value: null,
            item_found: false,
            container_id_found: false,
            chain_icon_src: chain_icon,
            pairing_complete: false,
            load: ""
        });

    }

    // get all exists containers for data to container id selector
    get_containers(data) {
        let container_data = []
        for (let i = 0; i < data.length; i++) {
            container_data.push({ "label": data[i]["container_id"], "value": data[i]["container_id"] })
        }
        this.setState({ container_data })
    }

    // get all exists items for data to item selector
    get_items(dict) {
        let data = []
        Object.keys(dict).forEach(cat => {
            Object.keys(dict[cat]).forEach(item => {
                let item_data = dict[cat][item]
                console.log(item)
                let obj = {}
                obj["label"] = item_data["item_name"]
                obj["value"] = item_data["item_name"]
                obj[item_data["item_name"]] = item
                data.push(
                    // "label": item_data["item_name"]
                    // , "value": item_data["item_name"],
                    obj
                )
            })
        })
        console.log(data)
        this.setState({ item_data: data })
    }


    close() {
        //reset modal
        this.resetComp();
    }
    open() {
        this.setState({ show: true });
    }

    // change active select filter
    change_active(kind) {
        if (kind == "Item") {
            this.setState({ item_found: false, is_item: true, scaned: false })
        }
        else if (kind == "Container ID")
            this.setState({ container_id_found: false, is_item: false, scaned: false })
    }

    //test dict and see if their is an item with the attribute 'value' that is equal to value
    testExistenceInDict(value, data_dict) {
        for (const [key, obj] of Object.entries(data_dict)) {
            if (obj["value"] == value)
                return true;
        }
        return false;
    }

    //test to see if the item chosen is one of the options and if so set it in the state 
    handleSelectChange(value) {
        var is_item = this.state.is_item;
        if (is_item) {
            if (!this.testExistenceInDict(value, this.state.item_data)) {
                showNotification('error', "Item not in list", "Item " + value + " not in list")
                return
            }
            this.setState({ item_name: value, item_found: true })
            if (this.state.container_id_found) {
                this.removeCamera()
                return
            }
        }
        else {
            if (!this.testExistenceInDict(value, this.state.container_data)) {
                showNotification('error', "Container not in list", "Container " + value + " not in list")
                return
            }
            this.setState({ container_id: parseInt(value), container_id_found: true })
            if (this.state.item_found) {
                this.removeCamera()
                return
            }
        }

        this.setState({ is_item: !is_item, stopStream: true }) //set the container to switch between categories and stop stream
        setTimeout(() => this.setState({ switchState: true }), 20) // let the stream stop before swiching state 
        setTimeout(() => this.setState({ switchState: false }), 4000) // set a timed switch so that the scan wont start emidiatly
    }

    // scan QR and load it into container ID input
    handleScan = data => {
        if (data) {
            this.handleSelectChange(data["text"])

        }
    }

    removeCamera() {
        //turn off the camera 
        this.setState({ stopStream: true })
        setTimeout(() => this.setState({ scaned: true }), 200)
    }

    handleSubmit() {

        this.setState({ load: <Loader speed="fast" size="lg" inverse content="Pairing..." center vertical /> })
        // index of the item on the item list
        let index = this.state.item_data.findIndex(item => item.value === this.state.item_name);
        let item_name = this.state.item_name, container_id = this.state.container_id;


        let request = base_url + "/containers/pair?business_id=" + this.state.business_id + "&container_id=" + container_id + "&item_id=" + this.state.item_data[index][item_name]
        let flag = false


        $.ajax({
            url: request,
            method: 'POST',
            success: function (res) {
                console.log(res)
                flag = true
                showNotification('success', "container paired", 'Container ' + container_id + " paird with " + item_name)

            },
            error: function (err) {
                console.log(err)
                showNotification('error', "Unable to pair", 'Their was a problem pairing container: ' + container_id + " with: " + item_name)
            }
        }).then(() => {

            console.log(flag)
            if (flag) {
                this.setState({ chain_icon_src: green_chain_icon, pairing_complete: true, load: "" })
            }
        });
    }


    render() {

        let value = this.state.is_item ? this.state.item_name : this.state.container_id;

        let comp = this.state.pairing_complete ? <img src={pairing_complete} alt="Pairing Complete" /> : <Scanner handleScan={this.handleScan} is_item={this.state.is_item} switchState={this.state.switchState} scaned={this.state.scaned} />

        let submit = this.state.container_id_found && this.state.item_found && !this.state.pairing_complete ? <Button className="pair_btn" onClick={this.handleSubmit} style={{}}>Pair</Button> : ""

        let selectTitle = this.state.pairing_complete ? "" : <ControlLabel >{this.state.is_item ? Dictionary["item"] : Dictionary["container_id"]}</ControlLabel>

        let select = this.state.pairing_complete ? "" :
            <SelectPicker
                value={value}
                onChange={this.handleSelectChange}
                placement={'topStart'}
                data={!this.state.is_item ? this.state.container_data : this.state.item_data}
                style={{ width: '100%' }}
                key={this.state.value}
            />



        return (
            <div className="modal_qr">
                <Modal size={"lg"} dialogClassName="add_container_area" show={this.state.show} onHide={this.close} >
                    <Modal.Header style={{ textAlign: "center" }}>
                        <Modal.Title>Container Pairing</Modal.Title>
                    </Modal.Header>

                    <Form fluid >
                        <div className="filters_area">
                            <ScanFilter description={this.state.container_id} hasValue={this.state.container_id_found} change_active={this.change_active} active={!this.state.is_item && !this.state.scaned} key={"container" + this.state.is_item + this.state.scaned} type={"Container ID"} />
                            <img src={this.state.chain_icon_src} alt="chain" />
                            <ScanFilter description={this.state.item_name} hasValue={this.state.item_found} change_active={this.change_active} active={this.state.is_item && !this.state.scaned} key={"item" + this.state.is_item + this.state.scaned} type={"Item"} />
                        </div>
                        <div className="barcode_scan_area">
                            <FormGroup>
                                {this.state.load}
                                {comp}
                            </FormGroup>
                        </div>

                        <FormGroup >
                            {selectTitle}
                            {select}
                        </FormGroup>

                    </Form>
                    {submit}
                </Modal>
                <img className="scan_icon" onClick={this.open} src={scan_icon} alt="Scan container" />

            </div>
        );
    }
}

class ScanFilter extends Component {
    //this shows a button with the state of the scan pairing
    constructor(props) {
        super(props)
        this.state = {
            type: this.props.type ? this.props.type : "error",
        }
    }

    render() {
        let description = this.props.description
        let border = this.props.active ? "3px solid red" : "3px solid #00000054"
        let className = this.props.active ? "pressed" : ""
        if (this.props.hasValue) {
            border = "3px solid #73D504"
        }

        return (
            <div onClick={() => this.props.change_active(this.props.type)} className={"scan_btns_filter " + className} style={{ border: border }}>
                <div>{this.state.type}</div>
                <div>{description}</div>
                <img style={{ marginTop: "10px" }} src={item_scan} alt="item_scan" />
            </div>
        )
    }

}