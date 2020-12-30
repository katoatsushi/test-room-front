import _ from 'lodash'
import { 
    CREAT_EVENT,
    READ_EVENTS, 
    DELETE_EVENT, 
    READ_EVENT,
    UPDATE_EVENT
} from '../actions'

export default (events = {}, action) => {
    // action は {type: "READ_EVENTS", response: {…}} の形でaction/indexjsからデータを引き受ける
    switch (action.type) {
        case CREAT_EVENT:
        case UPDATE_EVENT:
        case READ_EVENT:
            const data = action.response.data
            console.log(data)
            return { ...events, [data.id]: data }
        case READ_EVENTS:
            // console.log(action.response.data)
            return _.mapKeys(action.response.data, 'id')
        case DELETE_EVENT:
            // メモリ上から指定のidのイベントを削除する
            delete events[action.id]
            // 新しいメモリ上に更新されたeventを表示する
            return { ...events}
        default:
            return events
    }
}