import React, { Component } from "react";
import { Empty, Spin } from 'antd';
import FilterableItemList from "../../components/filterableItemList/filterableItemList";

export default class ManageFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notice: "",
      fileItemList: [],
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
        user: sessionStorage.getItem("username"),
        path: "files",
      }),
    };
    await fetch(
      "https://mojito-portfolio-backend.herokuapp.com/files",
      requestOptions
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.success === false) {
          setTimeout(() => {
            this.setState({
              notice: res.error,
              loading: false
            });
          }, 300);
        } else {
          this.setState({
            notice: res.message,
            loading: false
          });

          res.files.map(({ Key: fileUrl, LastModified: date, Size: size }) => {
            const name = fileUrl.split("/").pop();
            const type = name.split(".").pop().toUpperCase();
            const kbSize = Math.round(size / 1024);
            let fileSize = "";
            if (kbSize <= 1024) {
              fileSize = `${kbSize}KB`;
            } else {
              const mbSize = Math.round(kbSize / 1024);
              fileSize = `${mbSize}MB`;
            }
            let dateObj = new Date(date);
            const createdDate = dateObj.toLocaleString();
            const fileObject = {
              name: name,
              type: type,
              date: createdDate,
              size: fileSize,
              fileUrl: fileUrl,
            };
            this.setState({
              fileItemList: [...this.state.fileItemList, fileObject],
            });
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
    } else if (this.state.fileItemList.length < 1) {
      return(
          <div className="loadingOrEmptyContainer">
            <Empty description={"You have not uploaded any file yet."}/>
          </div>
      )
    }else {
      return (
          <FilterableItemList files={this.state.fileItemList} useFor="manage"/>
      );
    }
  }
}
