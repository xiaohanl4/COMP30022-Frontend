import React from 'react';
import 'antd/dist/antd.css';
import { Upload, Button, message, Modal, Input } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import reqwest from 'reqwest';
import { Row, Col } from 'antd';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class Demo extends React.Component {
    state = {
        fileList: [],
        uploading: false,
        previewVisible: false,
        descriptionBox: false,
        previewImage: '',
        previewTitle: '',
    };
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = ({ fileList }) => {
        console.log(fileList);
        // this.setState({ fileList, descriptionBox: true, })
    };

    handleUpload = () => {
        const { fileList } = this.state;
        console.log(fileList);
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files', file);
        });
        console.log(formData)
        console.log(formData.get('files'));
        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like
        reqwest({
            url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            method: 'post',
            processData: false,
            data: formData,
            success: () => {
                this.setState({
                    fileList: [],
                    uploading: false,
                });
                message.success('upload successfully.');
            },
            error: () => {
                this.setState({
                    uploading: false,
                });
                message.error('upload failed.');
            },
        });
    };

    render() {
        const { previewVisible, descriptionBox, previewImage, previewTitle, uploading, fileList } = this.state;

        const uploadButton = (
            <div className="description">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Add Media</div>
            </div>
        );
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };

        return (
            <>
                <div className="add-media">
                            <Upload
                                {...props}
                                listType="picture-card"
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                                >
                                {fileList.length >= 5 ? null : uploadButton}
                            </Upload>
                </div>
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={this.handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{ marginTop: 16 }}
                >
                    {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
            </>
        );
    }
}