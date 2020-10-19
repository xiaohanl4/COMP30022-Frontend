import React, { Component } from "react";
import {Descriptions, Badge,} from "antd";
import "../userPortfolio/userPortfolio.scss";

export default class PortfolioInfoEdu extends Component {
    constructor(props){
        super(props);
        this.state = {
            records: [],
            user: this.props.user,
        }
    }

    componentDidMount = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };
        await fetch('https://mojito-portfolio-backend.herokuapp.com/user/info/education/' + this.state.user, requestOptions)
            .then(res => res.json())
            .then(res => {
                if (res.success === false) {
                    setTimeout(() => {

                    }, 300);
                } else {
                    this.setState({records:res.data.records})
                }
            })
    }

    badgeStatus(record){
        if(record.status === "ongoing"){
            return(["processing","Ongoing"])
        }else{
            return(["default","Finished"])
        }
    }

    recordMajor(major){
        if(major == null){
            return ('\\')
        }else{
            return major
        }
    }

    render(){
        if (this.state.records.length < 1) {
            return (<div className="puserPortfolio__descriptions">This user has not uploaded his educational background.</div>)
        } else {
            return(
                <div>
                    {this.state.records.map(record=>(
                        <Descriptions className="userPortfolio__descriptions" column={4}>
                            <Descriptions.Item label="Level">{record.level}</Descriptions.Item>
                            <Descriptions.Item label="Institution">{record.institution}</Descriptions.Item>
                            <Descriptions.Item label="Major">{this.recordMajor(record.major)}</Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Badge status={this.badgeStatus(record)[0]} text={this.badgeStatus(record)[1]} />
                            </Descriptions.Item>
                        </Descriptions>
                    ))}
                </div>
            )
        }
    }
}