import React, { Component } from "react";
import { Empty, Spin } from 'antd';
import FilterableMediaList from "../userCentreManageContent/components/filterableMediaList";
import url from '../../assets/constant/constant'

export default class portfolioMedias extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notice: "",
      mediaItemList: [],
      user: this.props.user,
      loading: true,
    };
  }

  componentDidMount = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user: this.state.user,
      }),
    };
    await fetch(
      url.backendUrl + "/files/media",
      requestOptions
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.success === false) {
            this.setState({
              notice: res.error,
              loading: false,
            });
        } else {
          this.setState({
            notice: res.message,
            loading: false,
          });
          const temMediaList = [];
          res.data.map(
            ({
              url: mediaUrl,
              LastModified: date,
              description,
              descriptionUrl,
            }) => {
              let dateObj = new Date(date);
              const createdDate = dateObj.toLocaleString();
              const mediaObject = {
                time: createdDate,
                description: description,
                source: mediaUrl,
                descriptionUrl: descriptionUrl,
              };

              temMediaList.push(mediaObject);
            }
          );
          this.setState({
            mediaItemList: temMediaList,
          });
        }
      });
  };

  handleFilterTextChange = (filterText) => {
    this.setState({
      filterText: filterText,
    });
  };

  render() {
    const {loading} = this.state;
    if (loading) {
      return (
          <div className="loadingOrEmptyContainer">
            <Spin className="spin" size="large" tip="Loading..."/>
          </div>
      )
    } else if (this.state.mediaItemList.length < 1) {
      return(
          <div className="loadingOrEmptyContainer">
            <Empty description={"This user has not uploaded any media yet."}/>
          </div>
      )
    }else {
      return (
          <FilterableMediaList medias={this.state.mediaItemList} useFor="present"/>
      );
    }
  }
}
