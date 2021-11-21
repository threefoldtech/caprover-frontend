import { Button, Form, Input, message, Row, Select } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { NetworkEnv } from 'grid3_client'
import React from 'react'
import Toaster from '../../utils/Toaster'
import ApiComponent from '../global/ApiComponent'
import CenteredSpinner from '../global/CenteredSpinner'
import ErrorRetry from '../global/ErrorRetry'

export default class GridConfig extends ApiComponent<
    {
        isMobile: boolean
    },
    {
        gridConfig: any
        isLoading: boolean
    }
> {
    constructor(props: any) {
        super(props)

        this.state = {
            isLoading: true,
            gridConfig: {},
        }
    }

    componentDidMount() {
        const self = this
        self.setState({ isLoading: true })
        this.apiManager
            .getGridConfig()
            .then(function (data: any) {
                self.setState({ gridConfig: data })
            })
            .catch(Toaster.createCatcher())
            .then(function () {
                self.setState({ isLoading: false })
            })
    }

    updateConfig(newConfig: any) {
        const self = this
        self.setState({ isLoading: true })

        this.apiManager
            .setGridConfig(
                newConfig
            ).then(() => {
                message.success("Saved!")
                self.setState({gridConfig: newConfig})
            })
            .catch(Toaster.createCatcher())
            .then(function () {
                self.setState({ isLoading: false })
            })
    }

    render() {
        const self = this
        if (self.state.isLoading) {
            return <CenteredSpinner />
        }

        let gridConfig = this.state.gridConfig

        if (!gridConfig) {
            return <ErrorRetry />
        }

        const networkOptions = Object.keys(NetworkEnv).map((key: any) => (<Select.Option value={NetworkEnv[key as keyof typeof NetworkEnv]}>{key}</Select.Option> ))

        return (
            <Form
                name="gridconfig"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 26 }}
                initialValues={ gridConfig }
                onFinish={(values) => self.updateConfig(values)}
                autoComplete="off">
                    <Form.Item
                        label="Mnemonics"
                        name="mnemonics"
                        rules={[{ required: true, message: 'Please enter your mnemonics!' }]}>
                        <Input.Password minLength={25}/>
                    </Form.Item>
                    <hr />
                    <div style={{ height: 20 }} />
                    <Form.Item
                        label="Network"
                        name="network"
                        rules={[{ required: true, message: 'Please choose a network' }]}>
                        <Select>
                            {networkOptions}
                        </Select>
                    </Form.Item>
                    <div style={{ height: 20 }} />
                    <Form.Item
                        label="Public key"
                        name="public_key">
                        <TextArea></TextArea>
                    </Form.Item>
                    <div style={{ height: 40 }} />
                    <Form.Item>
                        <Row justify="end">
                            <Button
                                type="primary"
                                htmlType="submit"
                                block={this.props.isMobile}>Save</Button>
                        </Row>
                    </Form.Item>
            </Form >
        )
    }
}