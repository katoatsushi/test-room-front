import axios from 'axios'

// reducer に渡す
export const READ_EVENTS = 'READ_EVENTS'
export const READ_EVENT = 'READ_EVENT'
export const CREAT_EVENT = 'CREAT_EVENT'
export const DELETE_EVENT = 'DELETE_EVENT'
export const UPDATE_EVENT = 'UPDATE_EVENT'


const ROOT_URL = 'https://udemy-utils.herokuapp.com/api/v1'
const QUERYSTRING = '?token=token123'

export const readEvents = () =>  async dispach => {
    const response = await axios.get(`${ROOT_URL}/events${QUERYSTRING}`)
    dispach({ type: READ_EVENTS, response })
}

export const postEvent = values =>  async dispach => {
    // const url = ROOT_URL + "/events" + QUERYSTRING
    const response = await axios.get(`${ROOT_URL}/events${QUERYSTRING}`, values)
    // const response = await axios.post(url, values)
    dispach({ type: CREAT_EVENT, response })
}

export const getEvent = id =>  async dispach => {
    const response = await axios.get(`${ROOT_URL}/events/${id}${QUERYSTRING}`)
    // console.log(response)
    dispach({ type: READ_EVENT, response })
}

export const deleteEvent = id =>  async dispach => {
    await axios.delete(`${ROOT_URL}/events/${id}${QUERYSTRING}`)
    dispach({ type: DELETE_EVENT, id })
}

export const putEvents = values =>  async dispach => {
    const response = await axios.put(`${ROOT_URL}/events/${values.id}${QUERYSTRING}`, values)
    dispach({ type: UPDATE_EVENT, response })
}
