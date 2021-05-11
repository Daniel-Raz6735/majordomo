import React, { Component } from 'react'
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import './qr_reader.css'
import { Button, ControlLabel, Form, FormGroup, Modal, SelectPicker } from 'rsuite'
import item_scan from '../images/icons/item_scan.svg'
import chain_icon from '../images/icons/chain_icon.svg'
import green_chain_icon from '../images/icons/green_chain_icon.svg'
import scan_icon from '../images/icons/scan_icon.svg';
import { Dictionary } from '../Dictionary';
import $ from 'jquery';
import { base_url } from '..';

export class Test extends Component {
    state = {
        stopStream: false

    }
    handleError = err => {
        // console.error(err)
    }

    componentDidMount() {
        // if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        //     console.log("Let's get this party started")
        //     navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { exact: "environment" } } }).catch(function (error) {
        //         console.log(error)
        //     }) 
        // }
    }
    render() {

        return (
            <div>
                <BarcodeScannerComponent
                    stopStream={this.state.stopStream}
                    onUpdate={(err, result) => {
                        // console.log(err)
                        // console.log(result)
                        if (result) {
                            this.props.handleScan(result)
                            // this.setState({ stopStream: true })
                        }
                        else
                            this.handleError(err);
                    }} />
            </div>
        )
    }
}

export class ModalDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            item_name: '',
            scaned: false,
            show: false,
            is_item: false,
            business_id: this.props.business_id ? this.props.business_id : 1,
            item_data: [],
            container_data: [],
            value: null,
            item_found: false,
            id_found: false,
            chain_icon_src: chain_icon

        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleScan = this.handleScan.bind(this);
        this.change_active = this.change_active.bind(this);
        this.get_items = this.get_items.bind(this);
        this.get_containers = this.get_containers.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.found_id = this.found_id.bind(this)
        this.found_item = this.found_item.bind(this)

    }

    componentDidMount() {

        let dict
        if (this.props.dict["weights"] && this.props.dict["weights"]["category"])
            dict = this.props.dict["weights"]["category"]

        if (dict)
            this.get_items(dict)

        let request = base_url + "/get/containers" + "?business_id=" + this.state.business_id
        // let request = base_url + path

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

                data.push({
                    "label": item_data["item_name"]
                    , "value": item_data["item_name"]
                })
            })
        })
        this.setState({ item_data: data })
    }


    close() {
        this.setState({ show: false, id: '', item_name: '', id_found: false, item_found: false, is_item: false, chain_icon_src: chain_icon });
    }
    open() {
        this.setState({ show: true });
    }

    change_active() {
        this.setState({ is_item: !this.state.is_item })
    }

    found_id(id) {
        for (let i = 0; i < this.state.container_data.length; i++)
            if (this.state.container_data[i]["value"] == id)
                return true
        alert("container not exist")
        return false

    }

    found_item(item) {
        for (let i = 0; i < this.state.item_data.length; i++) {
            console.log(this.state.item_data[i]["value"])
            if (this.state.item_data[i]["value"] == item)
                return true
        }
        alert("item not exist")
        return false
    }

    handleSelectChange(value) {
        // this.setState({ value })
        if (this.state.is_item)
            this.setState({ item_name: value, item_found: true })

        else
            this.setState({ id: value, id_found: true })
    }

    handleSubmit() {
        console.log(this.state.item_name)
        console.log(this.state.id)
        this.setState({ chain_icon_src: green_chain_icon })
    }

    // scan QR and load it into container ID input
    handleScan = data => {
        if (data) {

            // container ID case
            if (!this.state.is_item) {

                if (this.found_id(data["text"]))
                    this.setState({ id: parseInt(data["text"]), id_found: true })
            }

            // item name case    
            else
                if (this.found_item(data["text"]))
                    this.setState({ item_name: data["text"], item_found: true })

        }
    }


    render() {


        let comp = this.state.scaned ? <button onClick={() => this.setState({ scaned: false })}>scan again</button> : <Test handleScan={this.handleScan} />

        let value = this.state.is_item ? this.state.item_name : this.state.id

        let submit = this.state.id_found && this.state.item_found ? <Button onClick={this.handleSubmit} style={{ backgroundColor: "#73D504", color: "white", marginTop: "15px", fontSize: "20px" }}>Pair</Button> : ""




        return (
            <div className="modal_qr">
                <Modal backdrop={"static"} size={"lg"} dialogClassName="add_container_area" show={this.state.show} onHide={this.close} >
                    <Modal.Header style={{ textAlign: "center" }}>
                        <Modal.Title>Container Pairing</Modal.Title>
                    </Modal.Header>

                    <Form
                        fluid
                    >
                        <div className="filters_area">
                            <ScanFilter description={this.state.id} color={this.state.id_found} change_active={this.change_active} active={!this.state.is_item} key={"container" + this.state.is_item} type={"Container ID"} />
                            <img src={this.state.chain_icon_src} alt="chain" />
                            <ScanFilter description={this.state.item_name} color={this.state.item_found} change_active={this.change_active} active={this.state.is_item} key={"item" + this.state.is_item} type={"Item"} />
                        </div>
                        <div className="barcode_scan_area">
                            <FormGroup>
                                {comp}
                            </FormGroup>
                        </div>

                        <FormGroup >
                            <ControlLabel>{!this.state.is_item ? Dictionary["container_id"] : Dictionary["item"]}</ControlLabel>
                            <SelectPicker
                                value={value}
                                onChange={this.handleSelectChange}
                                placement={'topStart'}
                                data={!this.state.is_item ? this.state.container_data : this.state.item_data}
                                style={{ width: '100%' }}
                                key={this.state.value}
                            />
                        </FormGroup>

                    </Form>
                    {submit}
                </Modal>
                <img className="scan_icon" onClick={this.open} src={scan_icon} alt="scan" />

            </div>
        );
    }
}

class ScanFilter extends Component {

    constructor(props) {
        super(props)
        this.state = {
            type: this.props.type ? this.props.type : "error",
        }
    }

    render() {


        let description = "unknown"
        let border = this.props.active ? "3px solid red" : "3px solid #00000054"
        if (this.props.color) {
            description = this.props.description
            border = "3px solid #73D504"
        }

        return (
            <div onClick={this.props.change_active} className="scan_btns_filter" style={{ border: border }}>
                <div>{this.state.type}</div>
                <div>{description}</div>
                <img style={{ marginTop: "10px" }} src={item_scan} alt="item_scan" />
            </div>
        )
    }

}