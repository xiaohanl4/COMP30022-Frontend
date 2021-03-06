import React, { Component } from "react";
import { Empty, Spin } from 'antd';
import FilterableEssayList from "../../components/filterableEssayList/filterableEssayList";
import url from '../../assets/constant/constant'

export default class ManageEssays extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notice: "",
      essayItemList: [],
      loading: true,
    };
  }

  componentDidMount = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    await fetch(
      url.backendUrl + 
      "/files/essay/" +
      sessionStorage.getItem("username"),
      requestOptions
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.success === false) {
          setTimeout(() => {
            this.setState({
              notice: res.error,
              loading: false,
            });
          }, 300);
        } else {
          this.setState({
            notice: res.message,
            loading: false,
          });
          const temEssayList = [];
          res.data.map(({ essay, image }) => {
            const { _id, title, content, date } = essay;
            const dateObj = new Date(date);
            const createdDate = dateObj.toLocaleString();
            var imageUrl = null;
            if (image != null) {
              var { Key: imageUrl } = image;
            }

            const essayObject = {
              id: _id,
              date: createdDate,
              name: title,
              content: content,
              thumbnail: imageUrl,
            };

            temEssayList.push(essayObject);
          });
          this.setState({
            essayItemList: temEssayList,
          });
        }
      });
  };
  render() {
    const {loading} = this.state;
    if (loading) {
      return (
          <div className="loadingOrEmptyContainer">
            <Spin className="spin" size="large" tip="Loading..."/>
          </div>
      );
    } else if (this.state.essayItemList.length < 1) {
      return(
          <div className="loadingOrEmptyContainer">
            <Empty description={"You have not uploaded any essay yet."}/>
          </div>
      )
    }else {
      return <FilterableEssayList essays={this.state.essayItemList} />;
    }
  }
}
