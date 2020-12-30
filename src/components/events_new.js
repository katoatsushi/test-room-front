import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'
import { postEvent } from '../actions'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button' 


class EventsNew extends Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
    }

    renderField(field) {
        const{input, label, type, meta: {touched, error}} = field
        console.log(field)
        return (
            <TextField 
                placeholder={label}
                size={'medium'}
                type={type}
                error={touched && error}
                {...input}
                fullWidth={true}
                // errorText={touched && error}
            />
        )
    }

    async onSubmit(values) {
        await this.props.postEvent(values)
        this.props.history.push('/')
    }

    render() {
        const {handleSubmit, pristine, submitting, invalid} = this.props
        console.log(submitting)
        return (
            <React.Fragment>
                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <div><Field label="Title" name="title" type="text" component={this.renderField}/></div>
                    <div><Field label="Body" name="body" type="text" component={this.renderField}/></div>
                    <Button variant="contained" size='large' color="secondary" type="submit" disabled={pristine || submitting || invalid}>新規追加</Button>
                    <Button variant="contained" size='large' color="primary" href="/">キャンセル</Button>
                </form>
            </React.Fragment>
        )
    }
}

const validate = values => {
    const errors = {}
    if (!values.title) errors.title = "Enter a title .please"
    if (!values.body) errors.body = "Enter a body .please"
    return errors
}

const mapDispachToProps = ({ postEvent })

export default connect(null, mapDispachToProps)(
    reduxForm({ validate, form: 'eventNewForm'})(EventsNew)
)