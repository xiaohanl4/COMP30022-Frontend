import React, { Component } from "react";
import { Divider, } from "antd";
import PortfolioInfoBasic from "../../components/portfolioInfo/portfolioInfoBasic";
import PortfolioInfoEdu from "../../components/portfolioInfo/portfolioInfoEdu";
import PortfolioInfoWork from "../../components/portfolioInfo/portfolioInfoWork";

export default class portfolioFiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
        };
    }

    render() {
        const { user } = this.state;
        return (
            <div>
                <Divider orientation="left">Basic Information</Divider>
                <PortfolioInfoBasic user={user}/>
                <Divider orientation="left">Educational Background</Divider>
                <PortfolioInfoEdu user={user}/>
                <Divider orientation="left">Work Experience</Divider>
                <PortfolioInfoWork user={user}/>
            </div>
        );
    }
}